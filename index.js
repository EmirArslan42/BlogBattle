import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import blogRoutes from "./routes/blogs.js"
import matchRoutes from "./routes/matches.js";

dotenv.config();
const app = express();

app.use(cors());

app.use(express.json());

//Yönlendirmelerimiz burada yer alacak / routes
app.use("/auth", authRoutes);
app.use("/blogs", blogRoutes);
app.use("/matches",matchRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log("Server is running")
    );
  })
  .catch((error) => console.log("Hata sebebi", error));
