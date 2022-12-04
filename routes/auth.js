const router=require('express').Router();
const User=require('../model/User')
const CryptoJs=require('crypto-js')
const jwt=require('jsonwebtoken')

//REGISTER
router.post('/register', async (req,resp) =>{
   
    const newUser =  new User({
        username: req.body.username,
        email: req.body.email,
        password:CryptoJs.AES.encrypt(req.body.password,process.env.PASS_SEC).toString(),
      });
    
      try {
        const savedUser = await newUser.save();
        resp.status(201).json(savedUser);
        // resp.send(savedUser);
      } catch (err) {
        resp.status(500).json(err);
      }
});

//LOGIN
router.post('/login',async (req,resp)=>{
    try{
        const user=await User.findOne({username:req.body.username});
        !user && resp.status(401).json("wrong credential");

        const hashedPassword=CryptoJs.AES.decrypt(
            user.password,
            process.env.PASS_SEC
            );
        const Originalpassword=hashedPassword.toString(CryptoJs.enc.Utf8);

        Originalpassword !==req.body.password && resp.status(401).json("wrong credential");

        const accessToken=jwt.sign({
            id:user._id,
            isAdmin:user.isAdmin,
        },process.env.JWT_SEC,
        {expiresIn:"3d"}
        );

        const { password, ...others}=user._doc;

        resp.status(200).json({...others,accessToken});

    }catch(err){
        resp.status(500).json(err);

    }
})




module.exports=router