const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/dbConnection');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const { request, urlencoded } = require('express');
const port = 8000;
const app = express();
app.use(cookieParser());
app.use(urlencoded({extended:true}));
app.use('/', require('./routers/index'));
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('./assets'));


app.listen(port, function(err){
    if(err){
        console.log("Error starting server");
        return;
    }
    console.log("Server started on port "+port);
});