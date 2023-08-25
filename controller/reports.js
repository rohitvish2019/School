const Student = require('../modals/admissionSchema');

module.exports.home = function(req, res){
    return res.render('reports_home',{error:""});
}


module.exports.getClassList = async function(req, res){
    console.log('query')
    console.log(req.query)
    let studentsList = await Student.find({Class:req.query.Class, Session:+req.query.Admission_year});
    if(studentsList.length > 0){
        return res.status(200).json({
            message:'Success',
            data: studentsList
        })
    }
    else if(studentsList.length <= 0){
        return res.status(412).json({
            message: 'Empty result received from server'
        })
    }
    
}