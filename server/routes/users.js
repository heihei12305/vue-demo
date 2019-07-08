var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var User = require('./../models/user')

/* GET users listing. */
// router.get('/', (req, res, next) => {
//   res.send('respond with a resource');
// });

router.post("/login",(req,res,next)=>{
  
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message

      });
    }else{
      if(doc){
          res.cookie("userId",doc.userId,{
            path:'/',
            maxAge:1000*60*60
          });
          res.cookie("userName",doc.userName,{
            path:'/',
            maxAge:1000*60*60
          });
          //req.session.user = doc;
          res.json({
            status:'0',
            msg:'',
            result:{
              userName:doc.userName
            }
          })
      }
    }
  })
})

//登出接口
router.post("/logout",(req,res,next)=>{
  res.cookie("userId","",{
    path:"/",
    manAge:-1
  });
  res.json({
    status:"0",
    msg:"",
    result:''
  })
})


router.get("/checkLogin",(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:"",
      result:{
        userName:req.cookies.userName||''
    
    }
    })
  }else{
    res.json({
      status:'1',
      msg:'no login',
      result:""
    })
  }
})
module.exports = router;
