const Student = require('../modals/admissionSchema');
const FeesHistory = require('../modals/feeHistory');
const moment = require('moment')
module.exports.home = function(req, res){
    return res.render('reports_home',{error:"", role:req.user.role});
}


module.exports.getClassList = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
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
    }else{
        return res.status(403).json({
            message:'Unautorized'
        })
    }
}



module.exports.getAdmittedStudentsReport = async function(req, res){
    try{
        let startDate = Date.parse(moment(req.query.start_date,'YYYYMMDD').format('ll'));
        let endDate = Date.parse(moment(req.query.end_date,'YYYYMMDD').format('ll'));
        let studentsList = await Student.find({SchoolCode:req.user.SchoolCode,AdmissionDate:{$gte:startDate}, AdmissionDate:{$lte:endDate}});
        return res.status(200).json({
            studentsList
        });
    }catch(err){
        return res.status(500).json({
            message:'Unable to fetch data'
        })
    }
}


module.exports.getFeesReport = async function(req, res){
    try{
        let startDate = Date.parse(moment(req.query.start_date,'YYYYMMDD').format('ll'));
        let endDate = Date.parse(moment(req.query.end_date,'YYYYMMDD').format('ll'));
        let feesHistory = await FeesHistory.find({SchoolCode:req.user.SchoolCode,Payment_Date:{$gte:startDate}, Payment_Date:{$lt:endDate}});
        return res.status(200).json({
            feesHistory
        });
    }catch(err){
        return res.status(500).json({
            message:'Unable to fetch data'
        })
    }
}

module.exports.getFeesReportByUser = async function(req, res){
    try{
        let startDate = Date.parse(moment(req.query.start_date,'YYYYMMDD').format('ll'));
        let endDate = Date.parse(moment(req.query.end_date,'YYYYMMDD').format('ll'));
        let feesHistory = await FeesHistory.find({SchoolCode:req.user.SchoolCode, PaidTo:req.body.email,Payment_Date:{$gte:startDate}, Payment_Date:{$lt:endDate}});
        return res.status(200).json({
            feesHistory
        });
    }catch(err){
        return res.status(500).json({
            message:'Unable to fetch data'
        })
    }
}

module.exports.getActiveStudentsList = async function(req, res){
    try{
        let students = await Student.find({SchoolCode:req.user.SchoolCode,isThisCurrentRecord:true});
        return res.status(200).json({
            students
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
    
}


module.exports.bulkReportsHome = function(req, res){
    return res.render('reports');
}

