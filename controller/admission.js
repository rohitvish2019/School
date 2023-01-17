const Student = require('../modals/admissionSchema');
const AdmissionNo = require('../modals/admission_no');
const FeeStructure = require('../modals/feeStructure');
const FeeSchema = require('../modals/FeeSchema');
const Result = require('../modals/Result');
const AdmissionNumber = require('../modals/admission_no');

module.exports.addmission =async function(request, response){
    let last = await AdmissionNo.findOne({});
    if(last){
        let adm = last.LastAdmission + 1
        return response.render('./addmission', {ThisAdmissionNumber:adm});
        
    }else{
        return response.render('startup')
    }
    
}

module.exports.addStudent = async function(request, response){
    let student, lastAdmissionNumber, ADN, fee, newFee, result
    try{
        student = await Student.create(request.body);
        lastAdmissionNumber = await AdmissionNo.findOne({});
        ADN = lastAdmissionNumber.LastAdmission;
        fee = await FeeStructure.findOne({Class:request.body.Class});
        newFee = await FeeSchema.create({
            AdmissionNo:ADN+1,
            Class:request.body.Class,
            Total:fee.Fees,
            Remaining: fee.Fees,
            Paid:0
        })
        await student.updateOne({AdmissionNo:ADN+1});
        
        result = await Result.create({
            AdmissionNo: ADN+1,
            Class:request.body.Class
        })
        await lastAdmissionNumber.updateOne({LastAdmission:ADN+1});
        return response.redirect('back');
    }catch(err){
        if(student){
            Student.remove(student)
        }
        if(fee){
            FeeStructure.remove(fee)
        }
        if(newFee){
            FeeSchema.remove(newFee)
        }
        if(result){
            Result.remove(result);
        }
        console.log(err);
        return response.redirect('back');
    }
}

module.exports.updateLastAdmission = function(req, res){
    console.log(req.body);
    AdmissionNumber.create(req.body)
    return res.redirect('/admissions')
}