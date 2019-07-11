var mongoose = require('mongoose')
var Schema =  mongoose.Schema;

var userSchema = new mongoose.Schema({
    "userId":String,
    "userName":String,
    "userPwd":String,
    "orderList":Array,
    "cartList":[
       {
        "productId":String,
        "productName":String,
        "productImage":String,
        "checked":Number,
        "productNum":Number,
        "salePrice":Number
       }
    ],
    "addressList":Array
});

module.exports = mongoose.model("User",userSchema);
