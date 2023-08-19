
const mongoose = require('mongoose');
const db = require('../config/dbConnection');
const TeachersDetails = new mongoose.Schema({
    Name:{
        type:String
    },
    Education :{
        type: String,
    },
    Salary:{
        type : Number
    },
    Address:{
        type:String
    },
    Documents:[{
        type:String
    }],
    Subjects:[{
        type:String,
        default:'General'
    }]
},
{
    timestamps:true
});

const Teachers = mongoose.model('Teachers', TeachersDetails);
module.exports = Teachers;