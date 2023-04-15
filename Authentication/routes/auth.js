const express=require("express")
const router=express.Router();
const CryptoJS=require("crypto-js");
const jwt=require("jsonwebtoken")
const User=require("../model/user")
const {check,validationResult}=require("express-validator")

router.post("/signup",[
    check('email', 'Email cannot be empty').isEmail(),
    check('username', 'Name cannot be empty'),
    check('password', 'Password length should be 5 to 10 characters').isLength({ min: 5, max: 10 })
],
async(req,res) =>
{ 
    try
    {  
        const errors = validationResult(req);
        if (!errors.isEmpty()) 
        {
            res.json(errors)
        }
        const {username,email,password}=req.body;
        const userDetail=await User.findOne({email})
        if(userDetail)
        {
            return res.status(401).json({status:409,message:"User Already Exists"})
        }
        else
        {
            const newUser=new User({
               username,email,
               password:CryptoJS.AES.encrypt(password,process.env.CRYPTOJS_SEC_KEY).toString()
            })
            const result=await newUser.save();
            if(result)
            return res.status(201).json({status:201,token:tokengenerator(result._id)});
            else
            return res.status(500).json({status:500,message:"error registering user"});
        }
        
    }catch(err){
        console.log(err.message)
        return res.status(500).json({status:500,message:"Server Error while processing request"})
    }
})



router.post("/login",async(req,res) =>
{
    try{
        const {email,username,password}=req.body;
        const userDetail= await User.findOne({
            $or: [{
                email:email
            }, {
                username:username
            }]
        })
        if(userDetail)
        {
            const decryptedpassword=CryptoJS.AES.decrypt(userDetail.password,process.env.CRYPTOJS_SEC_KEY).toString(CryptoJS.enc.Utf8)
            if(password===decryptedpassword)
            {
                return res.status(200).json({status:200,token:tokengenerator(userDetail._id)});
            }
            else
            {
                return res.status(403).json({status:403,message:"Wrong password"});
            }
        }
        else
        {
            return res.status(404).json({status:404,message:"User doesnot exist"});
        }
    }catch(err){
        console.log(err.message)
        return res.status(500).json("Internal Error")
    }
})

function tokengenerator(_id)
{
     return jwt.sign({_id:_id},process.env.JWT_SEC_KEY,{expiresIn:"3d"});
}
module.exports=router