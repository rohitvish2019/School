const Student = require('../modals/admissionSchema');
module.exports.getStudent = async function(req, res){
    try{
        let student = await Student.findOne({AdmissionNo:req.params.adm_no});
        if(student){
            console.log("Student found");
            return res.render('student_details',{student:student});
        }else{
            console.log('Student not found')
            return res.status(404).json({
                message:"No student found"
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }

    
}

module.exports.search = function(req, res){
    return res.render('student_search');
}

module.exports.getStudentsByClassForm = function(req, res){
    return res.render('studentListByClass');
}

module.exports.getStudentsList = async function(req, res){
    let studentList = await Student.find({Class:req.query.Class})
    return res.status(200).json({
        message:"Student list fetched successfully",
        data: studentList
    })
}