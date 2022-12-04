const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token;
    if(authHeader){
        const token=authHeader.split(" ")[1];
        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err){
                res.status(403).json("Token is not valid");
            }
            req.user=user;
            next();
            
        })

    }else{
        return res.status(401).json("You are not authenticated");
    }
}

const verifyTokenAndAuthorization=(req,resp,next)=>{
    verifyToken(req,resp,()=>{
        if(req.user.id===req.params.id||req.user.isAdmin){
             next() 
        }else{
            resp.status(403).json("you are not allowed to do that")
        }
    })
}

const verifyTokenAndAdmin=(req,resp,next)=>{
    verifyToken(req,resp,()=>{
        if(req.user.isAdmin){
             next() 
        }else{
            resp.status(403).json("you are not allowed to do that")
        }
    })
}

module.exports={verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}