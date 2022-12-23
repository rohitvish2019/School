const Student = require('../modals/admissionSchema');
const AdmissionNo = require('../modals/admission_no');
const FeeStructure = require('../modals/feeStructure');
const FeeSchema = require('../modals/FeeSchema');
const Result = require('../modals/Result');
module.exports.addmission =async function(request, response){
    return response.render('./addmission');
}

module.exports.addStudent = async function(request, response){
    let student = await Student.create(request.body);
    let lastAdmissionNumber = await AdmissionNo.findOne({});
    let ADN = lastAdmissionNumber.LastAdmission;

    let fee =await FeeStructure.findOne({Class:request.body.Class});
    await FeeSchema.create({
        AdmissionNo:ADN+1,
        Total:fee.Fees,
        Remaining: fee.Fees,
        Paid:0
    })
    await student.updateOne({AdmissionNo:ADN+1});
    await lastAdmissionNumber.updateOne({LastAdmission:ADN+1});
    await Result.create({
        AdmissionNo: ADN+1,
        Class:request.body.Class
    })
    return response.redirect('back');
}