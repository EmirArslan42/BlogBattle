import Blog from "../models/Blog.js";
import Match from "../models/Match.js";
import express from "express";
import { upload } from "../middleware/upload.js";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();
// giriş yapan kullanıcıların blog ekleme işlemi
router.post("/", auth,upload.single("image"), async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const newBlog = new Blog({
      title: title,
      content: content,
      category: category,
      user: req.user.id,
      image:req.file ? req.file.filename : undefined,
    });
    await newBlog.save();
    res.json(newBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("user", "username");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// blog güncelleme işlemi
router.put("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog bulunamadı" });
    }

    //güncelleme işlemini sadece blog sahibi yapabilmeli
    if (blog.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Güncelleme işlemi için yetkiniz yok" });
    }
    const { title, content, category } = req.body;
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.category = category || blog.category;

    await blog.save();
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// blog silme işlemi
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog Bulunamadı" });
    }
    if (blog.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bu bloğu silmek için yetkilendirilmediniz" });
    }
    await blog.deleteOne();
    res.json({ message: "Blog başarılı bir şekilde silindi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//en çok oy alan bloglar
router.get("/top", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ votes: -1 })
      .limit(5)
      .populate("user", "username");
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//kullanıcı bilgilerini getir
router.get("/me",auth,async (req,res)=>{
    try {
        const user=await User.findById(req.user.id).select("-password"); // şifre alanını hariç tutar güvenlik için
        res.json(user);
    } catch (error) {
        res.status(403).json({message:error.message});
    }
})

router.get("/match", auth, async (req, res) => {
  try {
    // const blogs = await Blog.aggregate([{ $sample: { size: 2 } }]);
    // const blogs = await Blog.find().sort({ _id: -1 }).limit(2); // en yeni 2 bloğu getirir
    const {category}=req.query; // category=telefon gibi
    const filter=category ? {category:category} : {};

    const blogs=await Blog.aggregate([ // aggreagete -> işlemi sıraya aldık
      {$match:filter}, // kategori varsa ona göre 2 tane çek yoksa rastgele 2 tane getir
      {$sample:{size:2}}  // bize 2 blog döndürsün istediğimiz için
    ])

    if(blogs.length<2){
      return res.status(400).json({message:"Karşılaştırma için en az 2 blog bulunmalıdır"});
    }

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/vote", auth, async (req, res) => {
  try {
    const { blogId } = req.body;
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog YOK !!" });
    }
    // kullanıcı daha önce oy verdi mi
    if(blog.votes.find(x=>x.user.toString()==req.user.id)){
      return res.status(400).json({message:"Daha önce oy verdiniz"});
    }
    blog.votes.push({user:req.user.id});
    await blog.save();

    const voteCount=blog.votes.length;

    res.json({ message: "Oy verme işlemi başarılı",votes:voteCount ,blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
