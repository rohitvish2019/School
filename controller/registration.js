const AdmissionNo = require('../modals/admission_no');
const RegisteredStudent = require('../modals/RegistrationSchema');
const FeeStructure = require('../modals/feeStructure');
const Student = require('../modals/admissionSchema');
const FeeSchema = require('../modals/FeeSchema');
const Result = require('../modals/Result');
const TCRecords = require('../modals/TC_Records');
const propertiesReader = require('properties-reader');
let Schoolproperties = propertiesReader('../School/config/School.properties');

module.exports.registrationUI = async function(req, res){
    let last = await AdmissionNo.findOne({SchoolCode:req.user.SchoolCode});
    let School_name = Schoolproperties.get(req.user.SchoolCode+'_name')
    if(last){
        let year = +new Date().getFullYear();
        let past_year = year -1;
        let current_year = year;
        let next_year = year + 1;
        let RN = last.LastRegistration + 1
        return res.render('./Registration', {ThisRegNumber:RN,past_year, current_year, next_year,role:req.user.role,School_name});
        
    }else{
        if(req.isAuthenticated && req.user.role === 'Admin'){
            return res.render('startup',{role:req.user.role})
        }else{
            return res.render('Error_403')
        }
        
    }
}

module.exports.getPreview = function(req, res){
    return res.render('RegistrationPreview', {data:req.body, role:req.user.role})
}

module.exports.register = async function(req, res){
    let student;
    try{
        student = await RegisteredStudent.create(req.body);
        lastRegistrationNumber = await AdmissionNo.findOne({});
        RN = lastRegistrationNumber.LastRegistration;
        await student.updateOne({RegistrationNo:RN+1,SchoolCode:req.user.SchoolCode,RegisteredBy:req.user.full_name});
        await lastRegistrationNumber.updateOne({LastRegistration:+RN+1});
    }catch(err){
        if(student){
            RegisteredStudent.deleteOne(student)
        }
        console.log(err);
    }
    return res.redirect('/registration/new');
}



module.exports.delete = async function(req, res){
    if(req.user.role === 'Admin'){
        try{
            await RegisteredStudent.findOneAndDelete(req.params.id);
            return res.status(200).json({
                message:'Student deleted successfully'
            })
        }catch(err){
            console.log(err);
            return res.status(404).json({
                message:'request failed'
            })
        }
    }else{
        return res.status(403).json({
            message:"Unautorized"
        })
    }
    
    
}


function getDate(){
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    console.log(currentDate); 
    return currentDate
}


module.exports.admit = async function(req, res){
    if(req.user.role === 'Admin'){
        let student,fee, studentData,result_q,result_h,result_f, fee_record;
        console.log(req.params);
        try{
            student = await RegisteredStudent.findOne({RegistrationNo:req.params.id, SchoolCode:req.user.SchoolCode});
            studentData = JSON.parse(JSON.stringify(student));
            delete studentData._id;
            //await RegisterdStudent.updateOne({student}, {$unset : {_id:1}});
            //student.delete('_id');
            let newStudent = await Student.create(studentData);
            let adm = await AdmissionNo.findOne({SchoolCode:req.user.SchoolCode});
            let lastAdmissionNo = +adm.LastAdmission;
            await newStudent.updateOne({AdmissionNo: lastAdmissionNo+1, SchoolCode:req.user.SchoolCode});
            await adm.updateOne({LastAdmission:lastAdmissionNo+1});
            adm.save();
            fee = await FeeStructure.findOne({Class:studentData.Class,SchoolCode:req.user.SchoolCode});
            fee_record = await FeeSchema.create({
                AdmissionNo:lastAdmissionNo+1,
                Class:studentData.Class,
                Total:fee.Fees,
                Remaining: fee.Fees,
                Paid:0,
                SchoolCode:req.user.SchoolCode
            });

            result_q = await Result.create({
                AdmissionNo: lastAdmissionNo+1,
                Class:studentData.Class,
                Term: 'Quarterly',
                SchoolCode:req.user.SchoolCode
            });

            result_h = await Result.create({
                AdmissionNo: lastAdmissionNo+1,
                Class:studentData.Class,
                Term: 'Half-Yearly',
                SchoolCode:req.user.SchoolCode
            });

            result_f = await Result.create({
                AdmissionNo: lastAdmissionNo+1,
                Class:studentData.Class,
                Term: 'Final',
                SchoolCode:req.user.SchoolCode
            });
            await RegisteredStudent.deleteOne(student);
            await TCRecords.create({
                AdmissionNo:lastAdmissionNo+1,
                AdmissionClass: studentData.Class,
                AdmissionDate: getDate(),
                SchoolCode:req.user.SchoolCode
            })
            return res.status(200).json({
                message:'Student admitted'
            });

        }catch(err){
            if(student){
                Student.deleteOne(student)
            }
            if(fee_record){
                FeeStructure.deleteOne(fee_record)
            }
            if(result_q){
                Result.deleteOne(result_q);
            }
            if(result_h){
                Result.deleteOne(result_h);
            }
            if(result_f){
                Result.deleteOne(result_f);
            }
            console.log(err);
            return res.status(503).json({
                message:'Unable to admit, please try again later'
            })
        }
    }else{
        return res.status(403).json({
            message:"Unautorized"
        })
    }
    
}


module.exports.download = async function(req, res){
    if(req.user.role === 'Admin'){
        let data = await RegisteredStudent.findOne({RegistrationNo:req.params.id});
        return res.render('RegistrationForm', {data, role:req.user.role});
    }else{
        return res.render('Error_403')
    }
    
}