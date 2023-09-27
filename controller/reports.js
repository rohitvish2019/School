const Student = require('../modals/admissionSchema');
const FeesHistory = require('../modals/feeHistory');
const moment = require('moment');
const fs = require('fs');
var json2xls = require('json2xls');
module.exports.home = function(req, res){
    return res.render('reports_home',{error:"", role:req.user.role});
}


module.exports.getClassList = async function(req, res){
    try{
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
    }catch(err){
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
    
}

module.exports.getReports = async function(req, res){
    console.log(req.query);
    try{
        
        if(req.query.purpose === 'feesReport'){
            response = await getFeesReport(req.query.start_date, req.query.end_date, req.user)
        }else if(req.query.purpose === 'admittedStudents'){
            response = await getAdmittedStudentsReport(req.query.start_date, req.query.end_date, req.user)
        }else if(req.query.purpose === 'usersCollection'){
            response = await getFeesReportByUser(req.query.start_date, req.query.end_date, req.user, req.query.email)
        }else if(req.query.purpose === 'currentActiveStudents'){
            response = await getCurrentActiveStudentsList(req.query.start_date, req.query.end_date, req.user)
        }
        if(response == 500){
            return res.status(500).json({
                message:'Unable to fetch report'
            })
        }else{
            return res.status(200).json({
                response,
                purpose:req.query.purpose
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal Server Error2'
        })
    }

}

async function getAdmittedStudentsReport(start_date, end_date, activeUser){
    try{
        let startDate = new Date(Date.parse(start_date)).toISOString();
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        
        let studentsList = await Student.find({SchoolCode:activeUser.SchoolCode,AdmissionDate:{$gte:startDate,$lte:endDate}}).lean();
        return studentsList
    }catch(err){
        console.log("getting error")
        console.log(err);
        return 500
    }
}


async function getFeesReport(start_date, end_date, activeUser){
    try{
        console.log(start_date);
        let startDate = new Date(start_date).toISOString();
        console.log(startDate);
        let endDate = new Date(Date.parse(end_date)).toISOString();
        console.log("Start Date : "+startDate+' end date : '+endDate)
        let feesHistory = await FeesHistory.find({SchoolCode:activeUser.SchoolCode,Payment_Date:{$gt:startDate, $lte:endDate}}).select('-_id -__v').lean();
        
        return feesHistory;
    }catch(err){
        console.log(err);
        return 500
        
    }
}

async function getFeesReportByUser(start_date, end_date, activeUser, userToSearch){
    try{
        let startDate = new Date(Date.parse(start_date)).toISOString();
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        let feesHistory = await FeesHistory.find({SchoolCode:activeUser.SchoolCode, PaidTo:req.body.email,Payment_Date:{$gt:startDate, $lte:endDate}}).lean();
        return feesHistory
        
    }catch(err){
        return 500
    }
}

async function getCurrentActiveStudentsList(start_date, end_date, activeUser){
    try{
        let students = await Student.find({SchoolCode:activeUser.SchoolCode,isThisCurrentRecord:true}).lean();
        return students
    }catch(err){
        return 500
    }
    
}


module.exports.getCSV = async function(req, res){
    try{
        let response = [];
        if(req.query.purpose === 'feesReport'){
            response = await getFeesReport(req.query.start_date, req.query.end_date, req.user)
        }else if(req.query.purpose === 'admittedStudents'){
            response = await getAdmittedStudentsReport(req.query.start_date, req.query.end_date, req.user)
        }else if(req.query.purpose === 'usersCollection'){
            response = await getFeesReportByUser(req.query.start_date, req.query.end_date, req.user, req.query.email)
        }else if(req.query.purpose === 'currentActiveStudents'){
            response = await getCurrentActiveStudentsList(req.query.start_date, req.query.end_date, req.user)
        }
        let filename = saveCSV(response,req.query.start_date+"to"+req.query.end_date+'_'+req.query.purpose);
        if(filename == 500){
            return res.status(500).json({
                message:'Unable to create Excel'
            })
        }
        return res.status(200).json({
            message:'Downloading report',
            filename
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }
}

function saveCSV(reportArray, filename){
    try{
        json = reportArray
        let xls = json2xls(json);
        fs.writeFileSync('../School/assets/reports/'+filename+'.xlsx', xls, 'binary');
        return filename
    }catch(err){
        return 500;
    }
}

module.exports.bulkReportsHome = function(req, res){
    return res.render('reports',{role:req.user.role});
}

