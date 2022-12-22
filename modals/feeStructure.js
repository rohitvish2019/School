const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const FeeStructure = new mongoose.Schema({
    Class : {
        type: String,
    },
    Fees :{
        type: Number
    }
},
{
    timestamps:true
});

const FeeStr = mongoose.model('FeeStructure', FeeStructure);
module.exports = FeeStr;