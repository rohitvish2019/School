const express = require('express');
const mongoose = require('mongoose');
const db = require('./config/dbConnection');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const { request, urlencoded } = require('express');
const port = 8000;
const session = require('express-session');
const flash = require('connect-flash');
const customMiddleWare = require('./config/middleware');
const app = express();
app.use(cookieParser());
app.use(urlencoded({extended:true}));

app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('./assets'));

app.use(session({
    name: 'EmployeeReview',
    secret: 'getitDone',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
}));



app.use(flash());
app.use(customMiddleWare.setFlash);

app.use('/', require('./routers/index'));

app.listen(port, function(err){
    if(err){
        console.log("Error starting server");
        return;
    }
    console.log("Server started on port "+port);
});