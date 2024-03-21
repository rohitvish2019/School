
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const totalMarksStudent = new mongoose.Schema({
    Class:{
        type:String
    },
    Term :{
        type: Number,
        enum: ['Quarterly','Half-Yearly','Final']
    },
    Total:{
        type:Number,
    }
},
{
    timestamps:true
});

const totalMarks = mongoose.model('totalMarksStudent', totalMarksStudent);
module.exports = totalMarks;