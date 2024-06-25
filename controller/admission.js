//const Student = require('../modals/admissionSchema');
const AdmissionNo = require('../modals/admission_no');
//const FeeStructure = require('../modals/feeStructure');
//const FeeSchema = require('../modals/FeeSchema');
//const Result = require('../modals/Result');
const AdmissionNumber = require('../modals/admission_no');
//const RegisterdStudent = require('../modals/RegistrationSchema');
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




//Old code

module.exports.addmission =async function(request, response){
    try{
        if(req.user.role === 'Admin'){
            let last = await AdmissionNo.findOne({SchoolCode:request.user.SchoolCode});
            if(last){
                let year = +new Date().getFullYear();
                let past_year = year -1;
                let current_year = year;
                let next_year = year + 1;
                let adm = last.LastAdmission + 1
                return response.render('./addmission', {ThisAdmissionNumber:adm,past_year, current_year, next_year, role:req.user.role });
                
            }else{
                return response.render('startup',{role:req.user.role})
            }
        }else{
            return res.render('Error_403')
        }
    }catch(err){
        logger.error(err.toString());
        return res.redirect('back')
    }
}


// To updateOne the last admission number in case of first startup of application

module.exports.updateLastAdmission =async function(req, res){
    try{
        await AdmissionNumber.create({
            LastAdmission:req.body.LastAdmission,
            SchoolCode:req.user.SchoolCode
        });
        return res.redirect('/registration/new')
    }catch(err){
        logger.error(err.toString());
        return res.redirect('back')
    }
}


// To render the preview before submitting the adission form
/*
module.exports.getPreview = function(req, res){
    console.log(req.body)
    return res.render('AdmissionPreview', {data:req.body, role:req.user.role})
}
*/
// To get the student profile details/n form download
/*
module.exports.getProfile = async function(req, res){
    let student = await Student.findOne({AdmissionNo:req.params.id,SchoolCode:request.user.SchoolCode});
    console.log(req.params.id);
    return res.render('StudentProfile', {data:student, role:req.user.role})
}
*/