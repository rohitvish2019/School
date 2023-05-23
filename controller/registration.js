const AdmissionNo = require('../modals/admission_no');
const RegisteredStudent = require('../modals/RegistrationSchema');
const FeeStructure = require('../modals/feeStructure');
const Student = require('../modals/admissionSchema');
const FeeSchema = require('../modals/FeeSchema');
const Result = require('../modals/Result');
module.exports.registrationUI = async function(req, res){
    let last = await AdmissionNo.findOne({});
    if(last){
        let year = +new Date().getFullYear();
        let past_year = year -1;
        let current_year = year;
        let next_year = year + 1;
        let RN = last.LastRegistration + 1
        return res.render('./Registration', {ThisRegNumber:RN,past_year, current_year, next_year });
        
    }else{
        return res.render('startup')
    }
}

module.exports.getPreview = function(req, res){
    console.log(req.body)
    return res.render('RegistrationPreview', {data:req.body})
}

module.exports.register = async function(req, res){
    let student;
    try{
        student = await RegisteredStudent.create(req.body);
        lastRegistrationNumber = await AdmissionNo.findOne({});
        RN = lastRegistrationNumber.LastRegistration;
        await student.updateOne({RegistrationNo:RN+1});
        /*
        fee = await FeeStructure.findOne({Class:request.body.Class});

        fee_record = await FeeSchema.create({
            AdmissionNo:RN+1,
            Class:request.body.Class,
            Total:fee.Fees,
            Remaining: fee.Fees,
            Paid:0
        });

        */
        
    await lastRegistrationNumber.updateOne({LastRegistration:+RN+1});
    }catch(err){
        if(student){
            RegisteredStudent.remove(student)
        }
        console.log(err);
    }
    return res.redirect('/registration/new');
}



module.exports.delete = async function(req, res){
    try{
        await RegisteredStudent.findOneAndDelete(req.params.id);
        return res.status(200).json({
            message:'Student deleted successfully'
        })
    }catch(err){
        console.log(err);
        return res.status(404).json({
            message:'Request failed'
        })
    }
    
}

module.exports.admit = async function(req, res){
    let student,fee, studentData,result_q,result_h,result_f;
    console.log(req.params);
    try{
        student = await RegisteredStudent.findOne({RegistrationNo:req.params.id});
        studentData = JSON.parse(JSON.stringify(student));
        delete studentData._id;
        //await RegisterdStudent.updateOne({student}, {$unset : {_id:1}});
        //student.delete('_id');
        let newStudent = await Student.create(studentData);
        let adm = await AdmissionNo.findOne({});
        let lastAdmissionNo = +adm.LastAdmission;
        await newStudent.update({AdmissionNo: lastAdmissionNo+1});
        await adm.update({LastAdmission:lastAdmissionNo+1});
        adm.save();
        fee = await FeeStructure.findOne({Class:studentData.Class});
        fee_record = await FeeSchema.create({
            AdmissionNo:lastAdmissionNo+1,
            Class:studentData.Class,
            Total:fee.Fees,
            Remaining: fee.Fees,
            Paid:0
        });

        result_q = await Result.create({
            AdmissionNo: lastAdmissionNo+1,
            Class:studentData.Class,
            Term: 'Quarterly',
        });

        result_h = await Result.create({
            AdmissionNo: lastAdmissionNo+1,
            Class:studentData.Class,
            Term: 'Half-Yearly',
        });

        result_f = await Result.create({
            AdmissionNo: lastAdmissionNo+1,
            Class:studentData.Class,
            Term: 'Final',
        });
        await RegisteredStudent.deleteOne(student);

        return res.status(200).json({
            message:'Student admitted'
        });

    }catch(err){
        if(student){
            Student.remove(student)
        }
        if(fee_record){
            FeeStructure.remove(fee_record)
        }
        if(result_q){
            Result.remove(result_q);
        }
        if(result_h){
            Result.remove(result_h);
        }
        if(result_f){
            Result.remove(result_f);
        }
        console.log(err);
        return res.status(503).json({
            message:'Unable to admit, please try again later'
        })
    }
}


module.exports.download = async function(req, res){
    let data = await RegisteredStudent.findOne({RegistrationNo:req.params.id});
    return res.render('RegistrationForm', {data});
}