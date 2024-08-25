//This will be used to add/get last admission number
const mongoose = require('mongoose');
const db = require('../config/dbConnection');

const TimeTable = new mongoose.Schema({
    Session: {
        type:String
    },
    Term :{
        type:String,
    },
    Class:{
        type:String,
    },
    Information:{
        type:Object
    },
    SchoolCode:{
        
        type:String
    }
},
{
    timestamps:true
});


const TimeTables = mongoose.model('TimeTable', TimeTable);
module.exports = TimeTables;