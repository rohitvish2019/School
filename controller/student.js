const Student = require('../modals/admissionSchema');
module.exports.getStudent = async function(req, res){
    console.log(req.params.adm_no);
    let student = await Student.find({AdmissionNo:req.params.adm_no});
    if(student.length > 0){
        console.log("Student found");
        return res.status(200).json({
            message:"Student found",
            data: student
        });
    }else{
        console.log('Student not found')
        return res.status(404).json({
            message:"No student found"
        })
    }
}

module.exports.search = function(req, res){
    return res.render('student_search');
}