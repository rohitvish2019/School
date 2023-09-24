const Student = require('../modals/admissionSchema');
const FeesHistory = require('../modals/feeHistory');
const moment = require('moment');
const fs = require('fs');
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
                count:response.length,
                response,
                
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Internal Server Error'
        })
    }

}

async function getAdmittedStudentsReport(start_date, end_date, activeUser){
    try{
        let startDate = new Date(Date.parse(start_date)).toISOString();
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        
        let studentsList = await Student.find({SchoolCode:activeUser.SchoolCode,AdmissionDate:{$gte:startDate,$lte:endDate}});
        return studentsList
    }catch(err){
        console.log("getting error")
        console.log(err);
        return 500
    }
}


async function getFeesReport(start_date, end_date, activeUser){
    try{
        let startDate = new Date(Date.parse(start_date)).toISOString();
        let endDate = new Date(Date.parse(end_date)).toISOString();
        console.log("Start Date : "+startDate+' end date : '+endDate)
        
        let feesHistory = await FeesHistory.find({SchoolCode:activeUser.SchoolCode,Payment_Date:{$gt:startDate, $lte:endDate}});
        return feesHistory
        
    }catch(err){
        return 500
        
    }
}

async function getFeesReportByUser(start_date, end_date, activeUser, userToSearch){
    try{
        let startDate = new Date(Date.parse(start_date)).toISOString();
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        let feesHistory = await FeesHistory.find({SchoolCode:activeUser.SchoolCode, PaidTo:req.body.email,Payment_Date:{$gt:startDate, $lte:endDate}});
        return feesHistory
        
    }catch(err){
        return 500
    }
}

async function getCurrentActiveStudentsList(start_date, end_date, activeUser){
    try{
        let students = await Student.find({SchoolCode:activeUser.SchoolCode,isThisCurrentRecord:true});
        return students
    }catch(err){
        return 500
    }
    
}


module.exports.getCSV = async function(req, res){
    let response;
    console.log(req.query.purpose)
    if(req.query.purpose === 'feesReport'){
        response = await getFeesReport(req.query.start_date, req.query.end_date, req.user)
    }else if(req.query.purpose === 'admittedStudents'){
        response = await getAdmittedStudentsReport(req.query.start_date, req.query.end_date, req.user)
    }else if(req.query.purpose === 'usersCollection'){
        response = await getFeesReportByUser(req.query.start_date, req.query.end_date, req.user, req.query.email)
    }else if(req.query.purpose === 'currentActiveStudents'){
        response = await getCurrentActiveStudentsList(req.query.start_date, req.query.end_date, req.user)
    }
    console.log(response.length);
    if(!(response === 500) && response.length > 0){
        saveCSV(response, req.query.purpose);
    }
}

function saveCSV(reportArray, purpose){
    console.log('Genratting report');
    fs.open('../School/assets/reports/sample.csv', 'w', function (err, file) {
        if (err) throw err;
        console.log('Saved!');
      });
    let filename = '../School/assets/reports/sample.csv'
    let data;
    for(let i=0;i<reportArray.length;i++){
        item = reportArray[i];
        let data = JSON.stringify(item).split(',');
        let text = '';
        for(let i=1;i<data.length;i++){
            let value = data[i].split(':')
            console.log("Value is " +value[1] +' done');
            text = text + value[1]+',';
        }
        console.log("New line "+text);
        fs.appendFile(filename, text.slice(0,-2)+'\n', function(err){
            if(err){
                console.log(err)
            }else{
                console.log('Written')
            }
        });
    }
    return 200
}

module.exports.bulkReportsHome = function(req, res){
    return res.render('reports');
}

