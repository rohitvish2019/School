const Student = require('../modals/admissionSchema');
const FeesHistory = require('../modals/feeHistory');
const Fee = require('../modals/FeeSchema');
const cashTransactions = require('../modals/transactions');
const timeTable = require('../modals/timeTable')
const moment = require('moment');
const fs = require('fs');
const propertiesReader = require('properties-reader');


var json2xls = require('json2xls');
const winston = require("winston");
const PropertiesReader = require('properties-reader');
const dateToday = new Date().getDate().toString()+'-'+ new Date().getMonth().toString() + '-'+ new Date().getFullYear().toString();
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error_"+dateToday+'.log', level: "warn" }),
    new winston.transports.File({ filename: "logs/app_"+dateToday+".log" }),
  ],
});

module.exports.home = function(req, res){
    if(req.user.role == 'Admin' || req.user.role=='Teacher'){
        try{
            let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
            let classList = properties.get(req.user.SchoolCode+".CLASSES_LIST").split(',');
            return res.render('reports_home',{error:"", role:req.user.role, classList});
        }catch(err){
            logger.error(err.toString())
            return res.redirect('back');
        }
    }else{
        return res.render('Error_403')
    }
    
}


module.exports.getClassList = async function(req, res){
    
    try{
        if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
            console.log(req.query)
            let studentsList = await Student.find({Session:req.query.Admission_year,Class:req.query.Class, SchoolCode:req.user.SchoolCode, isThisCurrentRecord:false}).collation({locale: "en" }).sort('FirstName');
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
    if(req.user.role == 'Admin' || req.user.role == 'Teacher'){
        console.log("Hitting here")
        let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
        classList = null;
        let students
        try{
            students = await Student.find({Class:req.query.Class, isThisCurrentRecord:true, SchoolCode:req.user.SchoolCode},'AdmissionNo FirstName LastName Class').sort('AdmissionNo');
            if(req.query.purpose === 'feesReport'){
                response = await getFeesReport(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'admittedStudents'){
                response = await getAdmittedStudentsReport(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'usersCollection'){
                response = await getFeesReportByUser(req.query.start_date, req.query.end_date, req.user, req.query.email)
            }else if(req.query.purpose === 'currentActiveStudents'){
                response = await getCurrentActiveStudentsList(req.query.start_date, req.query.end_date, req.query.Class, req.user)
            }else if(req.query.purpose === 'feesDuesTotal'){
                response = await getFeesDuesTotal(req.user)
            }else if(req.query.purpose === 'feesDuesClass'){
                response = await getFeesDuesByClass(req.user,req.query.Class);
            }else if( req.query.purpose === 'incompleteResult'){
                classList = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',');
                response = await getIncompleteResultsByClass(req.user);
            }else if(req.query.purpose === 'studentsListByClass'){
                response = await getStudentsByClass(req.query.Class, req.user.SchoolCode);
            }
            if(response == 500){
                return res.status(500).json({
                    message:'Unable to fetch report'
                })
            }else{
                return res.status(200).json({
                    classList,
                    response,
                    purpose:req.query.purpose,
                    students
                })
            }
        }catch(err){
            console.log(err)
            return res.status(500).json({
                message:'Internal Server Error2'
            })
        }
    }else{
        return res.render('Error_403')
    }
    
}

async function getStudentsByClass(classForFilter, SchoolCode){
    try{
        let students = await Student.find({Class:classForFilter, isThisCurrentRecord:true, SchoolCode:SchoolCode}).collation({locale: "en" }).sort('FirstName');
        return students
    }catch(err){
        console.log("error")
        console.log(err);
        return 500
    }
    
}

async function getAdmittedStudentsReport(start_date, end_date, activeUser){
    try{

        let startDate = new Date(Date.parse(start_date)).toISOString();
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        console.log("Start date is : "+startDate);
        let studentsList = await Student.find({SchoolCode:activeUser.SchoolCode,AdmissionDate:{$gte:startDate,$lte:endDate}}).collation({locale: "en" }).sort('FirstName').lean();
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
        let endDate = new Date(moment(end_date).add(1,'days')).toISOString();
        console.log("Start Date : "+startDate+' end date : '+endDate)
        let feesHistory = await FeesHistory.find({SchoolCode:activeUser.SchoolCode,Payment_Date:{$gt:startDate, $lte:endDate}}).select('-_id -__v').lean();
        
        return feesHistory;
    }catch(err){
        console.log(err);
        return 500
    }
}


async function getCurrentActiveStudentsList(start_date, end_date, Class, activeUser){
    try{
        let students = await Student.find({SchoolCode:activeUser.SchoolCode,isThisCurrentRecord:true, Class:Class}).collation({locale: "en" }).sort('FirstName').lean();
        return students
    }catch(err){
        return 500
    }
    
}
async function getFeesDuesTotal(user){
    try{
        let records = await Fee.find({SchoolCode:user.SchoolCode,Remaining:{$gt:0}}).lean();
        return records
    }catch(err){
        logger.error(err.toString());
        return null
    }
}

//Functions not live yet

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

/*
async function getFeesDuesByClass(user, Class){
    try{
        let records = await Fee.find({Class:Class,SchoolCode:user.SchoolCode},'AdmissionNo').sort('AdmissionNo').lean();
        let studentsAdmissionNumbers = []
        for(let i=0;i<records.length;i++){
            studentsAdmissionNumbers.push(records[i].AdmissionNo)
        }
        let data = Fee.find({AdmissionNo:{$in:studentsAdmissionNumbers},SchoolCode:user.SchoolCode}).sort('AdmissionNo').lean();
        return data
    }catch(err){
        logger.error(err.toString());
        return null
    }
}
*/


async function getFeesDuesByClass(user, Class){
    try{
        let records = await Student.find({Class:Class,SchoolCode:user.SchoolCode,isThisCurrentRecord:true},'AdmissionNo').sort('AdmissionNo').lean();
        let studentsAdmissionNumbers = []
        for(let i=0;i<records.length;i++){
            studentsAdmissionNumbers.push(records[i].AdmissionNo)
        }
        let data = Fee.find({AdmissionNo:{$in:studentsAdmissionNumbers},SchoolCode:user.SchoolCode}).sort('AdmissionNo').lean();
        return data
    }catch(err){
        logger.error(err.toString());
        return null
    }
}
async function getIncompleteResultsByClass(user){
    try{
        let records = await Student.find({TotalGrade:null, SchoolCode:user.SchoolCode},'Class').lean();
        return records
    }catch(err){
        logger.error(err.toString());
        return null
    }
}


module.exports.getCSV = async function(req, res){
    
    if(req.user.role == 'Admin' || req.user.role == 'Teacher'){
        try{
            let response = [];
            if(req.query.purpose === 'feesReport'){
                response = await getFeesReport(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'admittedStudents'){
                response = await getAdmittedStudentsReport(req.query.start_date, req.query.end_date, req.user)
            }else if(req.query.purpose === 'usersCollection'){
                response = await getFeesReportByUser(req.query.start_date, req.query.end_date, req.user, req.query.email)
            }else if(req.query.purpose === 'currentActiveStudents'){
                response = await getCurrentActiveStudentsList(req.query.start_date, req.query.end_date, req.query.Class, req.user)
            }else if(req.query.purpose === 'feesDuesTotal'){
                response = await getFeesDuesTotal(req.user)
            }else if(req.query.purpose === 'feesDuesClass'){
                response = await getFeesDuesByClass(req.user,req.query.Class);
            }else if( req.query.purpose === 'incompleteResult'){
                classList = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',');
                response = await getIncompleteResultsByClass(req.user);
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
    }else{
        return res.render('Error_403')
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
    if(req.user.role == 'Admin' || req.user.role=='Teacher'){
        try{
            let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
            let classList = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',');
            return res.render('reports',{role:req.user.role, classList});
        }catch(err){
            console.log(err)
            logger.error(err.toString())
            return res.redirect('back')
        }
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.cashBookHome = function(req, res){
    return res.render('cashbook',{role:req.user.role});
}


module.exports.addCashTransaction = async function(req, res){
    logger.info("Request received to add new transaction : ");
    logger.info(req.user)
    logger.info(req.body)
    logger.info(req.query)
    logger.info(req.params)
    console.log(req.body)
    let transactionType;
    if(req.body.type == 'in'){
        transactionType='credit'
        console.log("Crediting amount")
    }else if(req.body.type =='out'){
        transactionType='debit'
        console.log("Debiting amount")
    }else{
        console.log("No actions on amount")
    }
    try{
        let record = await cashTransactions.create({
            amount:req.body.amount,
            date:req.body.date,
            comment:req.body.comment,
            type:req.body.type,
            SchoolCode:req.user.SchoolCode,
            Person:req.body.person,
            transactionType:transactionType
        });
        return res.status(200).json({
            message:'Updated transaction successfully'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to add transaction, please try again later'
        })
    }
}

module.exports.getCashTransactions = async function(req, res){
    console.log("Getting cash transactions");
    console.log(req.query);
    try{
        let data = await cashTransactions.find({
            $and: [
                {date:{$gte :req.query.startDate}},
                {date: {$lte :req.query.endDate}},
                {SchoolCode:req.user.SchoolCode}
            ]
        }).sort("date");
        return res.status(200).json({
            message:'Transactions fetched',
            data
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to get transactions'
        })
    }
}


module.exports.timeTableHome = function(req, res){
    return res.render('time-table', {role:req.user.role});
}


module.exports.saveTimeTable = async function(req, res){
    logger.info("Request received to save time table : ");
    logger.info(req.user)
    logger.info(req.body)
    logger.info(req.query)
    logger.info(req.params)
    try{
        
        let savedData = await timeTable.findOne({Class:req.body.Class, Term:req.body.Term,Session:req.body.Session,SchoolCode:req.user.SchoolCode});
        if(savedData){
            await savedData.updateOne({Information:req.body.Information});
        }else{
            await timeTable.create({
                Class:req.body.Class,
                Term:req.body.Term,
                Information:req.body.Information,
                SchoolCode:req.user.SchoolCode,
                Session:req.body.Session
            })
        }
        
        return res.status(200).json({
            message:'Time table saved'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to save time table'
        })
    }
}


module.exports.getTimeTable = async function (req, res) {
    try{
        let tt = await timeTable.findOne({Class:req.query.classValue,Term:req.query.Term,Session:req.query.Session ,SchoolCode:req.user.SchoolCode});
        let classProperties = req.query.classValue
        if(classProperties == 'kg-1'){
            classProperties = 'KG1'
        }else if (classProperties == 'kg-2'){
            classProperties = 'KG2'
        }
            
        let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
        let subjectsFromProperties = properties.get(req.user.SchoolCode+'.SUBJECTS_'+classProperties);
        let subjects = subjectsFromProperties.split(',');
        if(tt){
            return res.status(200).json({
                message:'saved data found',
                timeTable: tt,
                isRecordFound: true,
                subjects
            })
        }else{
            
            return res.status(200).json({
                isRecordFound:false,
                subjects
            })
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to fetch data',
        })
    }
}

module.exports.otherReceiptsHome = function(req, res){
    return res.render('otherReceipts', {role:req.user.role});
}

module.exports.createReceipt = function(req, res){

}

module.exports.getOtherReceipts = function(req,res){

}

module.exports.getFeesReportByClass = async function(req, res) {
    try {
        console.log(req.query)
        let students = await Student.distinct("AdmissionNo",{Class:req.query.Class, isThisCurrentRecord:true, SchoolCode:'NCCAS'}).lean();
        let studentsData = await Student.find({Class:req.query.Class, isThisCurrentRecord:true, SchoolCode:'NCCAS'},"AdmissionNo FirstName LastName Class").lean();
        //console.log(students)
        let feeRecords = await Fee.aggregate([
        {
            $match: { AdmissionNo: { $in: students } }   // filter students
        },
        {
            $group: {
            _id: { AdmissionNo: "$AdmissionNo", Class: "$Class" }, // group by student + fee type
            total: { $sum: "$Total" },
            paid: { $sum: "$Paid" },
            remaining: { $sum: "$Remaining" },
			concession: { $sum: "$Concession" }
            }
        },
        {
            $project: {
            _id: 0,
            AdmissionNo: "$_id.AdmissionNo",
            type: "$_id.type",
            total: 1,
            paid: 1,
            remaining: 1,
            Class: "$_id.Class",
            concession:1
            }
        },
        {
            $sort: { AdmissionNo: 1, type: 1 }   // optional sorting
        }
        ]);
        console.log(studentsData[0]);
        console.log(feeRecords[0])
        let feeSummary = studentsData.map( s => ({
            ...s,
            fees : feeRecords.filter(f => f.AdmissionNo === s.AdmissionNo)
        }));
        feeSummary.sort((a, b) => {
            if (a.AdmissionNo < b.AdmissionNo) return -1;
            if (a.AdmissionNo > b.AdmissionNo) return 1;
            return 0;
        });
        return res.status(200).json({
            feeSummary
        })
    }catch (err) {
        console.log(err)
        return res.status(500).json({
            message :'unable to find fees records'
        })
    }
}


module.exports.feesSummaryHome = function(req, res) {
    try {
        let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
        let classList = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',');
        return res.render('feesSummaryHome',{role:req.user.role, classList});
    }catch(err) {
        console.log(err);
        return res.render('Error_403')
    }
}