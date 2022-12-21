const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/School');

const db = mongoose.connection;
db.on('error', function(){
    console.log("Error received while connecting to DB");
});

db.once('open', function(){
    console.log("Successfully connected to db");
});

module.exports = db;