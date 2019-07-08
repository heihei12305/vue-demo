let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let Goods = require('../models/goods')

//连接mongoDB数据库
mongoose.connect('mongodb://localhost/m_data');

mongoose.connection.on("connected",()=>{
    console.log("MongoDB connected success")
});
mongoose.connection.on("error",()=>{
    console.log("MongoDB connected fail")
})

mongoose.connection.on("disconnected",()=>{
    console.log("MongoDB connected disconnected")
})

router.get("/list",(req,res,next)=>{
   // res.send('hello goods list .')
   //分页功能实现
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let sort = parseInt(req.param("sort"));
    let priceLevel = req.param("priceLevel");
    let skip = (page-1)*pageSize;

    let params = {};
    let priceGt = '',priceLte = '';
    if(priceLevel!="all")
    {
        switch (priceLevel){
            case '0':priceGt = 0;priceLte = 1000;break;
            case '1':priceGt = 1000;priceLte = 2000;break;
            case '2':priceGt = 2000;priceLte = 5000;break;
        }
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec((err,doc)=>{
        if(err){
            res.json({
                status:"1",
                msg:err.message
            });
        }else{
            res.json({
                status:"0",
                msg:"",
                res:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
 
    // Goods.find({},(err,doc)=>{
        
    // })
})

//加入到购物车
// router.post("/goods/addCart",(req,res,next)=>{
//     var userId='100000',productId = req.body.productId;
//     var User = require('../models/user');

//     User.findOne({userId:userId},(err,userDoc)=>{
//         if(err){
//             res.json({
//                 status:"1",
//                 msg:err.message
//             })
//         }else{
//             console.log("userDoc:"+userDoc);
//             if(userDoc){
//                 Goods.findOne({productId:productId},(err1,doc)=>{
//                     if(err1){
//                         res.json({
//                             status:"1",
//                             msg:err.message
//                         })
//                     }else{
//                         if(doc){
//                             doc.productNum = 1;
//                             doc.checked = 1;
//                             User.cartList.push(doc);
//                             User.save(function(err2,doc){
//                                 if(err2){
//                                     res.json({
//                                         status:"1",
//                                         msg:err.message
//                                     })
//                                 }else{
//                                     res.json({
//                                         status:'0',
//                                         msg:'',
//                                         result:'suc'
//                                     })
//                                 }
//                             })
//                         }
//                     }

//                 })
//             }
//         }
//     })
// })
module.exports = router;
