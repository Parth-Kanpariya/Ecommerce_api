const User = require('../model/User')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken')

const router=require('express').Router()

router.put('/:id',verifyTokenAndAuthorization,async (req,resp)=>{
    
   if(req.body.password)
   {
       req.body.password=CryptoJs.AES
       .encrypt(req.body.password,process.env.PASS_SEC)
       .toString()
   }

   try{

    const updateUser=await User.findByIdAndUpdate(req.params.id,{
        $set:req.body
    },{new:true})
         
    resp.status(200).json(updateUser);
   }catch(err){
         resp.status(500).json(err);
   }

});

//DELETE
router.delete('/:id',verifyTokenAndAuthorization,async(req,resp)=>{
    try{
           await User.findByIdAndDelete(req.params.id)
           resp.status(200).json('user has been delelted')
    }catch(err){
        resp.status(500).json(err);
    }
})

//GET METHOD for find user
router.get('/find/:id',verifyTokenAndAdmin,async(req,resp)=>{
    try{
          const user= await User.findById(req.params.id)
          const {password,...others}=user._doc
           
           resp.status(200).json(others)
    }catch(err){
        resp.status(500).json(err);
    }
});

//find all users
router.get('/',verifyTokenAndAdmin,async(req,resp)=>{
    const query=req.query.new
    try{
          const users= query ? await User.find().sort({_id:-1}).limit(1): await User.find() 
           resp.status(200).json(users)
    }catch(err){
        resp.status(500).json(err);
    }
});

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  
    try {
      const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);
      res.status(200).json(data)
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports=router