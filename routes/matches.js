import express from "express";
import Match from "../models/Match.js";
import Blog from "../models/Blog.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// // Yeni maç oluştur (2 blog seçer)
// router.post("/create", auth, async (req, res) => {
//   try {
//     const { category } = req.body;
//     const filter = category ? { category } : {};
//     const blogs = await Blog.aggregate([
//       { $match: filter },
//       { $sample: { size: 2 } },
//     ]);

//     if (blogs.length < 2) {
//       return res.status(400).json({ message: "En az 2 blog olmalı" });
//     }

//     const match = new Match({ blogs: blogs.map(b => b._id) });
//     await match.save();
//     res.json(match);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Tam bracket oluşturma (örn. 8 blog)
router.post("/create-bracket", auth, async (req, res) => {
  try {
    const { category } = req.body;
    const filter = category ? { category } : {};

    // 8 blog seçiyoruz
    const blogs = await Blog.aggregate([
      { $match: filter },
      { $sample: { size: 8 } },
    ]);

    if (blogs.length < 8) {
      return res.status(400).json({ message: "En az 8 blog olmalı" });
    }

    // Çeyrek final eşleşmeleri (4 maç)
    const matches = [];
    for (let i = 0; i < blogs.length; i += 2) {
      const match = new Match({
        blogs: [blogs[i]._id, blogs[i + 1]._id],
        round: 1,
      });
      await match.save();
      matches.push(match);
    }

    res.json({ message: "Bracket oluşturuldu", matches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bracket endpoint
router.get("/bracket", async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("blogs") // blog detaylarını da getir
      .populate("votes.user", "username"); // oy veren kullanıcıları getir

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// // Maç için oy verme
// router.post("/vote", auth, async (req, res) => {
//   try {
//     const { matchId, blogId } = req.body;
//     const match = await Match.findById(matchId);

//     if (!match) return res.status(404).json({ message: "Maç bulunamadı" });

//     if (match.votes.find(v => v.user.toString() === req.user.id)) {
//       return res.status(400).json({ message: "Zaten oy verdiniz" });
//     }

//     match.votes.push({ user: req.user.id, blog: blogId });
//     await match.save();

//     // Oylar tamamlandıysa kazananı belirle
//     if (match.votes.length >= 2) {
//       const blogVotes = match.votes.reduce((acc, v) => {
//         acc[v.blog] = (acc[v.blog] || 0) + 1;
//         return acc;
//       }, {});

//       const winnerBlogId = Object.keys(blogVotes).reduce((a, b) =>
//         blogVotes[a] > blogVotes[b] ? a : b
//       );

//       match.winner = winnerBlogId;
//       match.completed = true;
//       await match.save();

//       // İsteğe bağlı: Üst tura yeni maç oluştur
//       const nextMatch = new Match({
//         blogs: [winnerBlogId],
//         round: match.round + 1,
//       });
//       await nextMatch.save();
//     }

//     res.json({ message: "Oy verildi", match });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// Yeni maç oluştur (2 blog seçer)
router.get("/match", auth, async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const blogs = await Blog.aggregate([
      { $match: filter },
      { $sample: { size: 2 } }
    ]);

    if (blogs.length < 2) {
      return res.status(404).json({ message: "Eşleşme bulunamadı" });
    }

    const match = new Match({
      blogs: blogs.map((b) => b._id),
      votes: []
    });

    await match.save();

    const populatedMatch = await Match.findById(match._id).populate("blogs");
    res.json(populatedMatch);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/match", auth, async (req, res) => {
  res.send("match route çalışıyor!");
});


router.post("/:id/vote", auth, async (req, res) => {
  try {
    const { matchId, blogId } = req.body;
    const match = await Match.findById(matchId);

    if (!match) return res.status(404).json({ message: "Maç bulunamadı" });

    if (match.votes.find(v => v.user.toString() === req.user.id)) {
      return res.status(400).json({ message: "Zaten oy verdiniz" });
    }

    match.votes.push({ user: req.user.id, blog: blogId });
    await match.save();

    // Eğer 2 oy alındıysa (maç tamamlandı)
    if (match.votes.length >= 2) {
      const blogVotes = match.votes.reduce((acc, v) => {
        acc[v.blog] = (acc[v.blog] || 0) + 1;
        return acc;
      }, {});

      const winnerBlogId = Object.keys(blogVotes).reduce((a, b) =>
        blogVotes[a] > blogVotes[b] ? a : b
      );

      match.winner = winnerBlogId;
      match.completed = true;
      await match.save();

      // Üst turu bul veya oluştur
      const nextRound = match.round + 1;

      // Aynı round ve winner yoksa yeni maç oluştur
      const upperMatch = await Match.findOne({
        round: nextRound,
        blogs: { $size: 1 }, // zaten bir blog varsa
        completed: false
      });

      if (upperMatch) {
        upperMatch.blogs.push(winnerBlogId);
        await upperMatch.save();
      } else {
        const newMatch = new Match({
          blogs: [winnerBlogId],
          round: nextRound,
        });
        await newMatch.save();
      }
    }

    res.json({ message: "Oy verildi", match });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Maç sonuçlarını göster
router.get("/:id/results", auth, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate("blogs votes.blog");
    if (!match) return res.status(404).json({ message: "Maç bulunamadı" });

    const results = match.blogs.map(blog => {
      const votes = match.votes.filter(v => v.blog.toString() === blog._id.toString()).length;
      const percent = match.votes.length > 0 ? ((votes / match.votes.length) * 100).toFixed(1) : 0;
      return { blog, votes, percent };
    });

    res.json({ results, winner: match.winner });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
