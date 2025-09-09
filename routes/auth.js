import User from "./../models/User.js"
import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const router=express.Router();

//kayıt olma
router.post("/register",async (req,res)=>{
    try {
        const {username,email,password}=req.body;
        const currentUser=await User.findOne({email});
        if(currentUser){
            return res.status(400).json({message:"Email kullanılıyor,başka bir adresle tekrar deneyiniz"});
        }
        const salt=await bcrypt.genSalt(10);
        const passwordHash=await bcrypt.hash(password,salt);
        const newUser=new User({username,email,password:passwordHash});
        await newUser.save();
        
        res.json({message:"Kullanıcı kayıt işlemi başarılı.Giriş yapabilirsiniz"});

    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

//giriş yapma
router.post("/login",async (req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
           return res.status(400).json({message:"Kullanıcı bulunamadı"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Bilgiler doğru değil"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.json({token,user:{
            id:user._id,
            username:user.username,
            email:user.email
        }})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
})

export default router;