const Student = require('../modals/admissionSchema');
const Fee = require('../modals/FeeSchema');
const FeeStructure = require('../modals/feeStructure');
const Result = require('../modals/Result');
const Noty = require('noty');
const AdmissionTracker = require('../modals/admission_no')
const path = require('path');
const RegisteredStudent = require('../modals/RegistrationSchema');
const propertiesReader = require('properties-reader');

const TCRecords = require('../modals/TC_Records');
const winston = require("winston");
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


function numberToWordsInRange(number1) {
    try{
        let number = parseInt(number1.toString());
        const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
        const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        if (number < 0 || number > 99) {
            return 'Number out of range';
        }

        if (number < 10) {
            return units[number];
        } else if (number < 20) {
            return teens[number - 10];
        } else {
            const tensDigit = Math.floor(number / 10);
            console.log("Tens")
            const unitsDigit = number % 10;
            console.log("Units"+unitsDigit)
            return tens[tensDigit] + (unitsDigit !== 0 ? ' ' + units[unitsDigit] : '');
        }
    }catch(err){
        logger.error(err.toString());
        return "";
    } 
}

function getDOBInWords(thisDate){
    try{
        let year = parseInt(thisDate.toString().slice(0,4));
        let month= parseInt(thisDate.toString().slice(5,7));
        let date = parseInt(thisDate.toString().slice(8,10));
        console.log(date+"%"+month+"%"+year)
        const numbersInWords = [
            "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
            "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
            "Twenty", "Twenty One", "Twenty Two", "Twenty Three", "Twenty Four", "Twenty Five", "Twenty Six", "Twenty Seven", "Twenty Eight", "Twenty Nine",
            "Thirty", "Thirty One"
        ];
        
        const monthsInWords = [
            "", "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        let dateInWords  = numbersInWords[date];
        let monthInWords = monthsInWords[month]
        let year1 = numberToWordsInRange(year.toString().substring(2));
        return dateInWords +" "+monthInWords+" two thousands "+year1;
        }catch(err){
            logger.error(err.toString());
            return ""
        }
    
    
}

function convertDateFormat(thisDate){
    thisDate = thisDate.toString().trim();
    let seperator = '-'
    let partitionIndex = 0;
    if(thisDate.toString().indexOf('/') != -1){
        seperator = '/'
        partitionIndex = thisDate.toString().indexOf('/')
    } else if (thisDate.toString().indexOf('\\') != -1){
        seperator = '\\'
        partitionIndex = thisDate.toString().indexOf('//')
    } else {
        partitionIndex = thisDate.toString().indexOf('-')
    }
    let year
    let month
    let day
    if(partitionIndex < 3) {
        console.log("Partition char is "+ seperator+ " & partition index is "+ partitionIndex)
        day = thisDate.toString().slice(0,2);
        month= thisDate.toString().slice(3,5);
        year = thisDate.toString().slice(6,10);
    } else {
        year = thisDate.toString().slice(0,4);
        month= thisDate.toString().slice(5,7);
        day = thisDate.toString().slice(8,10);
    }
    let finaldate = day+"-"+month+"-"+year;
    console.log(finaldate)
    return finaldate;
}

module.exports.getActiveStudents = async function(req, res){
    logger.info('Collecting active students report')
    try{
        let students = await Student.find({SchoolCode:req.user.SchoolCode, isThisCurrentRecord:true},'AdmissionNo FirstName LastName Class FathersName');
        if(students.length > 0){
            logger.info('Returning list of '+students.length+ ' students')
            return res.status(200).json({
                students,
                message:'Students list fetched'
            })
            
        }else{
            logger.info('Returning empty list')
            return res. status(200).json({
                message:'Server returned empty set'
            })
        }
    }catch(err){
        console.log(err)
        logger.error(err.toString())
        return res.status(500).json({
            message:'Internal server error'
        })
    }

}

module.exports.getStudent = async function(req, res){
    let imgdir = '/schools/'+req.user.SchoolCode
    let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    try{
        let student = await Student.findOne({AdmissionNo:req.params.adm_no, Class:req.query.Class,SchoolCode:req.user.SchoolCode});
        if(req.query.action === 'fee'){
            if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
                let feesList = await Fee.find({AdmissionNo:req.params.adm_no, SchoolCode:req.user.SchoolCode});
                logger.info('Get student request received from fee module')
                return res.render('feeDetails',{feesList, student,role:req.user.role, imgdir});
            }else if(req.user.role === 'Student'){
                let student = await Student.findOne({AdmissionNo:req.params.adm_no, isThisCurrentRecord:true, Mob:req.user.email, SchoolCode:req.user.SchoolCode});
                if(student){
                    logger.info('Get student request received from fee module')
                    let feesList = await Fee.find({AdmissionNo:req.params.adm_no, SchoolCode:req.user.SchoolCode});
                    return res.render('feeDetails',{feesList, student,role:req.user.role, imgdir});
                }else{
                    logger.error('Unautorized request, User '+req.user.email+' is not authorized')
                    return res.render('Error_403')
                }
            }
        }else if(req.query.action ==='result'){
            logger.info('Get student request received from Result module');
            
            if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
                
                let result = await Result.find({AdmissionNo:req.params.adm_no, Class:req.query.Class, SchoolCode:req.user.SchoolCode});
                console.log(result);
                return res.render('resultDetails',{imgdir,role:req.user.role, result, student, quarterlyTotalMarks:properties.get(req.user.SchoolCode+'_quarterly-total'), halfYearlyTotalMarks:properties.get(req.user.SchoolCode+'_half-yearly-total'), finalTotalMarks:properties.get(req.user.SchoolCode+'_final-total')});
            }
            else if(req.user.role === 'Student'){
                let student = await Student.findOne({AdmissionNo:req.params.adm_no, isThisCurrentRecord:true, Mob:req.user.email, SchoolCode:req.user.SchoolCode});
                if(student){
                    let result = await Result.find({AdmissionNo:req.params.adm_no, Class:req.query.Class, SchoolCode:req.user.SchoolCode});
                    return res.render('resultDetails',{imgdir, role:req.user.role, result, student, quarterlyTotalMarks:properties.get(req.user.SchoolCode+'_quarterly-total'), halfYearlyTotalMarks:properties.get(req.user.SchoolCode+'_half-yearly-total'), finalTotalMarks:properties.get(req.user.SchoolCode+'_final-total')});
                }else{
                    logger.error('Unautorized request, User '+req.user.email+' is not authorized')
                    return res.render('Error_403')
                }
            }
        }else if(req.query.action ==='tc'){
            logger.info('Get student request received from Result module')
            if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
                let tcData = await TCRecords.findOne({AdmissionNo:req.params.adm_no, SchoolCode:req.user.SchoolCode});
                let TrackerRecord = await AdmissionTracker.findOne({SchoolCode:req.user.SchoolCode});
                let fees = await Fee.findOne({SchoolCode:req.user.SchoolCode,AdmissionNo:req.params.adm_no, Class:req.query.Class});
                let err=''
                tcNo = TrackerRecord.LastTCNo;
                let DOBInWords=getDOBInWords(student.DOB);
                let DOBDate = convertDateFormat(student.DOB);

                if( !tcData || !tcData.ReleivingClass || !tcData.RelievingDate){
                    err = "TC not generated yet, Please discharge the student first and try again"
                    logger.info(err)
                    return res.render('TCDetails',{student,err,DOBInWords,DOBDate,});            
                }
                if(req.user.SchoolCode == 'NCCAS') {
                    return res.render('TCDetails_english',{role:req.user.role,student,err ,tcData,DOBInWords,DOBDate, tcNo, fees});
                }
                return res.render('TCDetails',{role:req.user.role,student,err ,tcData,DOBInWords,DOBDate, tcNo, fees});
            }else if(req.user.role === 'Student'){
                let student = await Student.findOne({AdmissionNo:req.params.adm_no, isThisCurrentRecord:true, Mob:req.user.email, SchoolCode:req.user.SchoolCode});
                if(student){
                    let tcData = await TCRecords.findOne({AdmissionNo:req.params.adm_no, SchoolCode:req.user.SchoolCode});
                    let err=''
                    let DOBInWords=getDOBInWords(student.DOB);
                    let DOBDate = convertDateFormat(student.DOB);

                    if(!tcData.ReleivingClass || !tcData.RelievingDate){
                        
                        err = "TC not generated yet, Please discharge the student first and try again"
                        logger.info(err)
                        return res.render('TCDetails',{student,err,DOBInWords,DOBDate});
                    }
                }
            }
            else{
                if(student){
                    return res.render('student_details',{imgdir, role:req.user.role,student:student});
                }else{
                    console.log('Student not found')
                    return res.status(404).json({
                        message:"No student found"
                    })
                }
            }
        }
    }catch(err){
        logger.error('Error while fetching student details');
        logger.error(err.toString());
        console.log(err)
        return res.status(500).json({
            message:"Internal Server Error23"
        })
    }
}
    

module.exports.getProfile = async function(req, res){
    try{
        let imgdir = '/schools/'+req.user.SchoolCode
        let isOld = req.query.isOld
        let student = await Student.findById(req.params.id);
        return res.render('StudentProfile',{data:student, role:req.user.role, isOld, imgdir})
    }catch(err){
        logger.error('Error fetching student profile : ')
        logger.error(err.toString());
        return res.redirect('back')
    }
    
}


module.exports.getProfileBySamagra = async function(req, res){
    console.log("Outer connection");
    console.log(req.query);
    try{
        let student = await Student.findOne({SSSM:req.query.SSSM, SchoolCode:req.user.SchoolCode});
        console.log(student);
        if(student){
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            return res.status(200).json({
                student,
                message:'Success'
            })
        }else{
            return res.status(401).json({
                message:'No data found'
            })
        }
        
    }catch(err){
        return res.status(500).json({
            message:'Internal server error'
        })
    }
}
    
module.exports.getMe = async function(req, res){
    try{
        let studentList = await Student.find({Mob:req.user.email,SchoolCode:req.user.SchoolCode, isThisCurrentRecord:true});
        logger.info('fetching students ...')
        logger.info('Returning students list');
        logger.info(studentList);
        return res.status(200).json({
            message:"Student list fetched successfully",
            data: {studentList, action:req.query.Action}
        })
    }catch(err){
        logger.error('Error received while fetching students list')
        logger.error(err.toString())
        return res.status(403).json({
            message:"Unauthorized"
        }) 
    }
}

module.exports.search = function(req, res){
    try{
        return res.render('student_search',{admin:req.user.isAdmin,role:req.user.role});
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back')
    }
}

module.exports.getStudentsByClassForm = function(req, res){
    try{
        if(req.user.role == 'Admin'){
            return res.render('studentListByClass',{action:'none',admin:req.user.isAdmin,role:req.user.role});
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        logger.error(err.toString());
        return res.redirect('back')
    }
    
    
}

module.exports.getStudentsByClassFormFee = function(req, res){
    try{
        if(req.user.role === 'Admin' || req.user.role === 'Teacher' || req.user.role === 'Student'){
            return res.render('studentListByClass', {action:'fee',admin:req.user.isAdmin,role:req.user.role});
        }else{
            return res.render("Error_403")
        }
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back')
    }
}

module.exports.getStudentsByClassFormResult = function(req, res){
    try{
        if(req.user.role === 'Admin' || req.user.role === 'Teacher' || req.user.role === 'Student'){
            return res.render('studentListByClass', {action:'result',admin:req.user.isAdmin,role:req.user.role});
        }else{
            return res.render('Error_403')    
        }
    }catch(err){
        logger.error(err.toString());
        return res.redirect('back')
    }
}

module.exports.getStudentsByClassFormTC = function(req, res){
    try{
        if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
            return res.render('studentListByClass', {action:'tc',admin:req.user.isAdmin,role:req.user.role});
        }else{
            return res.render('Error_403')        
        }
    }catch(err){
        logger.error(err.toString());
        return res.redirect('back')
    }
}

module.exports.getStudentsByClassFormAdmission = function(req, res){
    try{
        if(req.user.role == 'Admin'){
            return res.render('studentListByClass', {action:'admission',admin:req.user.isAdmin,role:req.user.role});
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back')
    }
    
}

module.exports.getStudentsList = async function(req, res){
    let studentList;
    console.log(req.query);
    logger.info('request received for getting students list');
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        if(req.query.Action === 'admission'){
            logger.info('Finding registered students')
            studentList = await RegisteredStudent.find({Class:req.query.Class,SchoolCode:req.user.SchoolCode,isAdmitted:false, isRejected:false})
        }
        else{
            logger.info('Finding admitted students')
            studentList = await Student.find({Class:req.query.Class, isThisCurrentRecord:true,SchoolCode:req.user.SchoolCode}).collation({locale: "en" }).sort('FirstName')
        }
        return res.status(200).json({
            message:"Student list fetched successfully",
            data: {studentList, action:req.query.Action}
        })
    }else{
        return res.status(403).json({
            message:"Unauthorized"
        })        
    }  
}

module.exports.upgradeClassPage = function(req, res){
    let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
    try{
        let classList = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',')
        if(req.user.role === 'Admin'){
            return res.render('upgradeClass', {admin:req.user.isAdmin,role:req.user.role,classList});
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        logger.error(err.toString())
        return res.redirect('back')
    }
}


let AdmissionNumber = '';
async function upgradeClassStudent(studentAdmissionNumber, studentClass, SchoolCode){
    let properties = propertiesReader('../School/config/properties/'+SchoolCode+'.properties');
    let last_class_details, lastResultStatus,finalClass
    last_class_details = await Student.findOne({AdmissionNo:studentAdmissionNumber,isThisCurrentRecord:true,SchoolCode:SchoolCode});
    //console.log("Last Class result "+last_class_details.TotalGrade.toString())
    if(last_class_details.TotalGrade == '' || last_class_details.TotalGrade == null || last_class_details.TotalGrade === 'NA' ||last_class_details.TotalGrade.toLowerCase() == 'Invalid'.toLowerCase()){
        console.log("Last class result is "+ last_class_details);
        lastResultStatus = false
    }else{
        lastResultStatus = true
    }
    AdmissionNumber = last_class_details.AdmissionNo;
    if(!lastResultStatus && last_class_details.Class != '5'){
        return 424;
    }
    if(last_class_details.TotalGrade =='F' ){
        return 414;
    }
    finalClass = properties.get(SchoolCode+'.CLASSES_LIST').split(',');
    console.log("Last Class is for school is"+finalClass);
    console.log("Student Class is "+last_class_details.Class);

    if(last_class_details.Class == finalClass[finalClass.length-1]){
        console.log("Condition is matching");
        return 400;
        /*res.status(400).json({
            message:'Class can not be upgraded from top class 8'
        });
        */
    }
    newClass='';
    if(last_class_details.Class=='kg-1'){
        newClass='kg-2'
    }else if(last_class_details.Class == 'lkg'){
        newClass='ukg'
    }
    else if(last_class_details.Class=='kg-2' || last_class_details.Class == 'ukg'){
        newClass='1'
    }else{
        newClass=+last_class_details.Class + 1;
    }
    let thisRecordExists = await Student.findOne({AdmissionNo:last_class_details.AdmissionNo, Class:newClass, SchoolCode:SchoolCode});
    if(thisRecordExists){
        return 409;
        /*res.status(409).json({
            message:'This student is already upgraded to new class'
        })
        */
        
    }
    feeAmounttForClass = await FeeStructure.findOne({Class:newClass,SchoolCode:SchoolCode});
    if(!feeAmounttForClass){
        return 404
    }

    let upgradedStudent = await Student.create({
        RegistrationNo:last_class_details.RegistrationNo,
        AdmissionNo:last_class_details.AdmissionNo,
        AdmissionDate:last_class_details.AdmissionDate,
        AdmissionClass:last_class_details.AdmissionClass,
        Session:+last_class_details.Session + 1,
        SiblingsCount:last_class_details.SiblingsCount,
        FirstName:last_class_details.FirstName,
        LastName:last_class_details.LastName,
        FathersName:last_class_details.FathersName,
        MothersName:last_class_details.MothersName,
        Class:newClass,
        AadharNumber:last_class_details.AadharNumber,
        SSSM:last_class_details.SSSM,
        Mob:last_class_details.Mob,
        DOB:last_class_details.DOB,
        Caste:last_class_details.Caste,
        FullAddress:last_class_details.FullAddress,
        BankName:last_class_details.BankName,
        Branch:last_class_details.Branch,
        AccountNo:last_class_details.AccountNo,
        IFSC:last_class_details.IFSC,
        Medium:last_class_details.Medium,
        Category:last_class_details.Category,
        Religion:last_class_details.Religion,
        isHandicapped:last_class_details.isHandicapped,
        Gender:last_class_details.Gender,
        FathersEducation:last_class_details.FathersEducation,
        MothersEducation:last_class_details.MothersEducation, 
        FathersOccupation:last_class_details.FathersOccupation, 
        MothersOccupation:last_class_details.MothersOccupation, 
        FathersWorkPlace:last_class_details.FathersWorkPlace, 
        MothersWorkPlace:last_class_details.MothersWorkPlace, 
        FathersAnnualIncome:last_class_details.FathersAnnualIncome, 
        MothersAnnualIncome:last_class_details.MothersAnnualIncome, 
        LastSchoolName:last_class_details.LastSchoolName, 
        LastPassingClass:last_class_details.Session,
        LastClassPassingYear:last_class_details.LastClassPassingYear, 
        LastClassGrade:last_class_details.TotalGrade,
        quarterlyGrade:'NA',
        halfYearlyGrade:'NA',
        finalGrade:'NA',
        TotalGrade:'NA',
        loginEmail:last_class_details.loginEmail,
        SchoolCode:last_class_details.SchoolCode,
        isThisCurrentRecord:true,
    });

    await last_class_details.updateOne({isThisCurrentRecord:false});
    await last_class_details.save();
    await Fee.create({
        AdmissionNo: upgradedStudent.AdmissionNo,
        Class: newClass,
        Total: feeAmounttForClass.Fees,
        Remaining:feeAmounttForClass.Fees,
        SchoolCode:SchoolCode
    });
    //add addtional sessions also
    let terms = properties.get(SchoolCode+'.EXAM_SESSIONS').split(',');
    let addTerms = properties.get(SchoolCode+'.EXAM_SESSIONS_Add').split(',');
    terms = terms.concat(addTerms);
    for(let i=0;i<terms.length;i++){
        await Result.create({
            AdmissionNo: AdmissionNumber,
            Class:newClass,
            Term: terms[i],
            SchoolCode:SchoolCode
        });
    }
    await Result.updateMany({AdmissionNo:last_class_details.AdmissionNo,Class:last_class_details.Class, isThisCurrentRecord:true, SchoolCode:SchoolCode},{$set:{isThisCurrentRecord:false}})
    return 200;

}

module.exports.upgradeOneStudent = async function(req, res){
    console.log('Upgrading Student')
    logger.info("Request received to upgrade student : ");
    logger.info(req.user)
    logger.info(req.body)
    logger.info(req.query)
    logger.info(req.params)
    try{
        if(req.user.role === 'Admin'){
            let status = await upgradeClassStudent(req.params.AdmissionNo, req.query.Class, req.user.SchoolCode);
            console.log(status);
            if(status==200){
                return res.status(200).json({
                    message:'Student upgraded successfully'
                });
            }else if(status==400){
                return res.status(400).json({
                    message:'Student can not be upgraded from final Class as per school policy'
                });
            }else if(status==409){
                return res.end('This student is already upgraded to next class');
            }
            else if(status == 424){
                return res.status(424).json({
                    message:"Result is not updated correctly, kindly update and try again"
                })
            }
            else if(status == 404){
                return res.status(424).json({
                    message:"Annual fees not updated"
                })
            }
            else if(status == 414){
                return res.status(400).json({
                    message:'Student final grade is F, Can not upgrade'
                })
            }
            else{
                return res.end('error upgrading class');
            }
        }else{
            return res.status(403).json({
                message:"Unauthorized"
            })        
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Internal server error'
        })
    }
    
}


module.exports.upgradeClassBulk = function(req, res){
    logger.info("Request received to upgrade class bulk : ");
    logger.info(req.user)
    logger.info(req.body)
    logger.info(req.query)
    logger.info(req.params)
    if(req.user.role === 'Admin'){
        try{
            if(req.body.Class==='8'){
                return res.status(400).json({
                    message:'8th class can not be upgraded'
                })
            }
            studentList = req.body.studentList;
            studentClass = req.body.Class
            for(let i=0;i<studentList.length;i++){
                upgradeClassStudent(studentList[i],studentClass,req.user.SchoolCode)
            }
            return res.status(200).json({
                message:'Marked students are updgraded to new class successfully.'
            });
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:'Internal server error'
            })
        }
    }else{
        return res.status(403).json({
            message:"Unauthorized"
        })        
    }
    
}

function calculateGrade(value){
    if(value > 100){
        return "Invalid"
    }
    if(value <= -1){
        return 'NA'
    }else if( value <= 100 && value > 90){
        return 'A+'
    }else if(value <= 90 && value > 74){
        return 'A'
    }else if( value <= 75 && value > 59){
        return 'B'
    }else if(value <= 60 && value > 44){
        return 'C'
    }else if(value <= 45 && value > 33){
        return 'D'
    }else{
        return 'F'
    }
}

function getPercentage(marks, total){
    return marks*100/total
}

function getDate(){
    try{
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        // This arrangement can be altered based on how we want the date's format to appear.
        let currentDate = `${day}-${month}-${year}`;
        console.log(currentDate); 
        return currentDate
    }catch(err){
        logger.error(err.toString())
        return "";
    }
    
}


module.exports.getMarksheetUI = async function(req, res){
    try{
        let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
        let student = await Student.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class, SchoolCode:req.user.SchoolCode})
        let classValue = req.query.Class;
        let updatedClassValue = classValue;
        if(classValue == 'kg-1'){
            updatedClassValue = 'KG1'
        }
        if(classValue == 'kg-2'){
            updatedClassValue = 'KG2'
        }
        let subjects = properties.get(req.user.SchoolCode+'.SUBJECTS_'+updatedClassValue);
        let sub_list = subjects.split(',');
        let terms = properties.get(req.user.SchoolCode+'.EXAM_SESSIONS').split(',');
        let marks = new Object();
        let total_marks = new Array();
        for(let i=0;i<terms.length;i++){
            console.log(req.user.SchoolCode+'.'+terms[i]+'_TOTAL')
            total_marks.push(properties.get(req.user.SchoolCode+'.'+terms[i]+'_TOTAL'))
        }
        console.log(total_marks);
        for(let i=0;i<terms.length;i++){
            marks[terms[i]] = await Result.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class,Term:terms[i], SchoolCode:req.user.SchoolCode},subjects.replaceAll(',',' ')+' Term')
        }
        
        return res.render('getMarksheet',{student, marks, sub_list, terms, total_marks,SchoolCode:req.user.SchoolCode})
    }catch(err){
        logger.error(err)
        return res.redirect('back')
    }
}

module.exports.dischargeStudent = async function(req, res){
    logger.info("Request received to discharge student : ");
    logger.info(req.user)
    logger.info(req.body)
    logger.info(req.query)
    logger.info(req.params)
    if(req.user.role === 'Admin'){
        try{
            
            let student = await Student.findOne({AdmissionNo:req.params.AdmissionNo,isThisCurrentRecord:true,SchoolCode:req.user.SchoolCode})
            let trackerRecord = await AdmissionTracker.findOne({SchoolCode:req.user.SchoolCode});
            /*
            if(!student.TotalGrade){
                console.log("Result not updated")
                return res.status(500).json({
                    message:"Result not updated correctly"
                })
            }
            */
            let newTcNo = Number(trackerRecord.LastTCNo)+1;
            await TCRecords.findOneAndUpdate({AdmissionNo:req.params.AdmissionNo, SchoolCode:req.user.SchoolCode}, {RelievingDate:getDate(), ReleivingClass:student.Class, TCNo:newTcNo})
            await Result.updateMany({AdmissionNo:req.params.AdmissionNo,Class:student.Class, SchoolCode:req.user.SchoolCode, isThisCurrentRecord:true}, {$set:{isThisCurrentRecord:false}})
            await Student.findOneAndUpdate({AdmissionNo:req.params.AdmissionNo,isThisCurrentRecord:true, SchoolCode:req.user.SchoolCode }, {isThisCurrentRecord:false});
            await trackerRecord.updateOne({LastTCNo:newTcNo})
            return res.status(200).json({
                message:"Student is updated as alumini now"
            })
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:"Error discharging student, please try again later"
            })
        }
    }else{
        return res.status(403).json({
            message:"Unauthorized"
        })        
    }  
}

module.exports.updateProfile = async function(req, res){
    logger.info("Request received to update profile : ");
    logger.info(req.user)
    logger.info(req.body)
    logger.info(req.query)
    logger.info(req.params)
    try{
        let student = await Student.findById(req.body.id);
        let AdmissionDate = student.AdmissionDate;
        let isThisCurrentRecord = student.isThisCurrentRecord;
        await student.deleteOne();
        let newStudent = await Student.create(req.body);
        if(req.body.AdmissionDate == '' || req.body.AdmissionDate == null){
            await newStudent.updateOne({AdmissionDate:AdmissionDate});
        }
        await newStudent.updateOne({SchoolCode:req.user.SchoolCode,isThisCurrentRecord:isThisCurrentRecord});
    }catch(err){
        console.log(err)
    }
    
    return res.redirect('back')
}



module.exports.getMarksheetUINew = async function(req, res){
    try{
        let subjectsMapping = {
            "Hindi":"हिन्दी",
            "English" : "अंग्रेज़ी",
            "Math" : "गणित",
            "Social_Science" :"सामाजिक विज्ञान",
            "Science" : "विज्ञान",
            "Enviornment":"पर्यावरण",
            "Sanskrit":"संस्कृत",
            "Computer":"कंप्यूटर",
            "Moral":"नैतिक शिक्षा",
            "Drawing":"चित्रकला",
            "Literary":"साहित्यिक",
            "Cultural":"सांस्कृतिक",
            "Scientific":"वैज्ञानिक",
            "Creativity":"सृजनात्मक",
            "Sports":"खेलकूद",
            "PUNCTUALITY":"नियमितता/समयबद्धता",
            "HYGIENE":"स्वच्छता",
            "CONSCIENTIOUSNESS":"कर्तव्यनिष्ठा",
            "HELPFULNESS":"सहयोग की भावना",
            "HONESTY":"सत्यवादिता/ईमानदारी",
            "EnvironmentallySensitive":"पर्यावरण संवेदनशील",
        }
        let properties = propertiesReader('../School/config/properties/'+req.user.SchoolCode+'.properties');
        let student = await Student.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class, SchoolCode:req.user.SchoolCode});
        let classValue = req.query.Class;
        let updatedClassValue = classValue;
        if(classValue == 'kg-1'){
            updatedClassValue = 'KG1'
        }
        if(classValue == 'kg-2'){
            updatedClassValue = 'KG2'
        }
        let subjects = properties.get(req.user.SchoolCode+'.SUBJECTS_'+updatedClassValue);
        let subjectsArray = subjects.split(',');
        let terms = properties.get(req.user.SchoolCode+'.EXAM_SESSIONS').split(',');
        let addtionalTerms = properties.get(req.user.SchoolCode+'.EXAM_SESSIONS_Add').split(',');
        let addtionalMarks = new Object();
        for(let i=0;i<addtionalTerms.length;i++){
            let subjects = properties.get(req.user.SchoolCode+'.'+addtionalTerms[i]+'.SUBJECTS').replaceAll(',',' ');
            addtionalMarks[addtionalTerms[i]] = await Result.findOne({SchoolCode:req.user.SchoolCode,Term:addtionalTerms[i], Class:classValue, AdmissionNo:req.params.AdmissionNo}, subjects);
        };
        
        let termMarks;
        let grandTotal = new Object();
        let resultSet = new Object();
        for(let i=0;i<terms.length;i++){
            termMarks = new Object();
            let weightage = 0;
            
            let result = await Result.findOne({AdmissionNo:req.params.AdmissionNo, Class:req.query.Class,Term:terms[i], SchoolCode:req.user.SchoolCode},subjects.replaceAll(',',' ')+' Term Total Weight');
            weightage = result.Weight;
            let termSum = 0;
            for(let j=0;j<subjectsArray.length;j++){
                termMarks[subjectsArray[j]] = Math.round((Number(result['_doc'][subjectsArray[j]])*100/ Number(result.Total)) * Number(result.Weight)/100);
                termSum = termSum + Math.round((Number(result['_doc'][subjectsArray[j]])*100/ Number(result.Total)) * Number(result.Weight)/100);
            }
            termMarks['Total'] = result.Total;
            grandTotal[terms[i]] = termSum;
            console.log(typeof(terms[i]))
            resultSet[terms[i]] = termMarks;
            console.log("Grand total")
            console.log(grandTotal)
        }
        if(req.user.SchoolCode == 'SVVN') {
            return res.render('getMarksheet',{student, marks:resultSet, grandTotal, addtionalMarks, subjectsMapping, sub_list:subjectsArray, terms,SchoolCode:req.user.SchoolCode})
        } else {
            return res.render('getMarksheet_english',{student, marks:resultSet, grandTotal, addtionalMarks, subjectsMapping, sub_list:subjectsArray, terms,SchoolCode:req.user.SchoolCode})
        }
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Unable to fetch marksheet'
        });
    }
}

module.exports.printClassList = function(req, res){
    console.log("coming soon...")
    
}