
const mongoose = require('mongoose');
const transaction = new mongoose.Schema({
    Amount:Number,
    SchoolCode:String,
    TransactionDate:String,
    Comment:String,
    TransactionType:String
},
{
    timestamps:true
});

const transactions = mongoose.model('Transaction', transaction);
module.exports = transactions;