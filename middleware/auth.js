import jwt from "jsonwebtoken"

export const auth=(req,res,next)=>{
    try {
        const token=req.header("Authorization");
        if(!token){
            return res.status(401).json({message:"Token bulunamadı"});
        }
        const verified=jwt.verify(token,process.env.JWT_SECRET);
        req.user=verified;
        next();
    } catch (error) {
        res.staus(401).json({message:error.message});
    }
}