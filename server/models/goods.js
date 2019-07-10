var mongoose = require('mongoose')
var Schema =  mongoose.Schema;

var produtSchema = new Schema({
    "productId":String,
    "productName":String,
    "salePrice":Number,
    "productImage":String,
    "productUrl":String,
    "productNum":Number,
    "checked":Number
});
module.exports = mongoose.model('Good',produtSchema);
