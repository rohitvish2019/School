const Student = require('../modals/admissionSchema');

module.exports.addmission = function(request, response){ 
    return response.render('./addmission');
    
}

module.exports.addStudent = function(request, response){
    Student.create(request.body);
    console.log(request.body);
    return response.end('Added to DB Successfully');
}