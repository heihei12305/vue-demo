var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
var User = require('./../models/user')

/* GET users listing. */
// router.get('/', (req, res, next) => {
//   res.send('respond with a resource');
// });

router.post("/login",(req,res,next)=>{
  
  let param = {
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
});


router.get("/getCartCount",(req,res,next)=>{
  if(req.cookies && req.cookies.userId){
    let userId = req.cookies.userId;
    User.findOne({userId:userId}, (err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err.message,
          result:''
        })
      }else{
        let cartList = doc.cartList;
        let cartCount = 0;
        cartList.map((item)=>{
          cartCount += parseInt(item.productNum);
        })
        res.json({
          status:'0',
          msg:'',
          result:cartCount
        })
      }
    })
  }
})

//查询当前用户购物车数据
router.get("/cartList",(req,res,next)=>{
  var userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        });
      }
    }
  })
});


//购物车删除
router.post("/cart/del",(req,res,next)=>{
  let userId = req.cookies.userId,productId = req.body.productId;
  User.update({
    userId:userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
  }
},(err,doc)=>{
  if(err){
    res.json({
      status:'1',
      msg:err.message,
      result:''
    });
  }else{
    res.json({
      status:'0',
      msg:'',
      result:'suc'
    });
  }
});
});

//修改商品数量
router.post("/cart/edit",(req,res,next)=>{
  let userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum":productNum,  //更新子文档
    "cartList.$.checked":checked
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
  }
});
});

router.post("/cart/editCheckAll",(req,res,next)=>{
  // console.log(req);
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll;
  User.findOne({userId:userId},(err,user)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(user){
        user.cartList.forEach((item,index)=>{
          item.checked = checkAll;
        })
        user.save((err1,doc)=>{
          if(err1){
            res.json({
              status:'1',
              msg:err1.message,
              result:''
            });
          }else{
            res.json({
              status:'0',
              msg:'',
              result:'suc'
            });
        }
        })
      }
      
  }
  })
})

//查询用户地址接口
router.get("/addressList",(req,res,next)=>{
  let userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'1',
        msg:'',
        result:doc.addressList
      })
    }
  })
})

//设置默认地址接口
router.post("/setDefault",(req,res,next)=>{
  // console.log(req.body);
  let userId = req.cookies.userId,
      addressId = req.body.addressId;
  if(!addressId){
    res.json({
      status:'1003',
      msg:"addressId is null",
      result:''
    })
  }else{
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      let addressList = doc.addressList;
      addressList.forEach((item)=>{
        if(item.addressId == addressId){
          item.isDefault = true; 
        }else{
          item.isDefault = false;
        }
      });

      doc.save((err1,doc1)=>{
        if(err1){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          });
        }else{
          res.json({
            status:'0',
            msg:'',
            result:''
          });
        }
      })
    }
  
  })
}
})

//删除地址接口
router.post("/delAddress",(req,res,next)=>{
  let userId = req.cookies.userId,
      addressId = req.body.addressId;
    User.update({
      userId:userId
    },{
      $pull:{
        'addressList':{
          'addressId':addressId
        }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      res.json({
        status:'0',
        msg:'',
        result:'suc'
      });
    }
  });
})
module.exports = router;
