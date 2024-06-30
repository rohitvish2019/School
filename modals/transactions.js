
const mongoose = require('mongoose');
const transaction = new mongoose.Schema({
    amount:Number,
    SchoolCode:String,
    date:Date,
    comment:String,
    type:String,
    isValid:{
        type:Boolean,
        default:true
    },
    isCancelled:{
        type:Boolean,
        default:false
    },
    isCountable:Boolean,
    Person:String
},
{
    timestamps:true
});

const transactions = mongoose.model('Transaction', transaction);
module.exports = transactions;