const adminDB = require('../modals/adminSchema');
module.exports.login = function(request, response){
    return response.render('../views/home');
}

module.exports.auth = function(request,response){
    /*
    //To create a new entry.
    adminDB.create(request.body,function(err){
        if(err){
            console.log("Error inserting data to db");
        }
    });
    console.log(request.body);
    return response.end("<html>Checking DB</html>");
    */
    adminDB.find({ username: request.body.username}, function (err, docs) {
        if(docs.length > 0){
            if(request.body.password == docs[0].password){
                if(docs[0].isBlocked == false){
                    response.cookie('id',request.body.username);
                    return response.render('./home');
                }
                else{
                    response.end("user is blocked");
                }
            }
            else{
                response.end("Login failed,Wrong password");
            }
            
        }
        else{
            response.end("No data found");
        }
    });
    
}