
const mongoose = require('mongoose');
const transaction = new mongoose.Schema({
    amount:Number,
    SchoolCode:String,
    date:String,
    comment:String,
    type:String
},
{
    timestamps:true
});

const transactions = mongoose.model('Transaction', transaction);
module.exports = transactions;