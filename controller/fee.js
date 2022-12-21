const Fee = require('../modals/FeeSchema');
const Student = require('../modals/admissionSchema');
module.exports.getFeeDetails = async function(req, res){
    let student = await Student.findById(req.params.id);
    console.log(student.AdmissionNo);
    feeData = await Fee.findOne({AdmissionNo:student.AdmissionNo});
    return res.render('feeSubmit', {feeData:feeData, student:student});
    
}

module.exports.feeSubmission =async function(req, res){
    let fee = await Fee.findOne({AdmissionNo:req.body.adm_no});
    console.log(fee);
    await fee.update({Paid: fee.Paid + +req.body.feeAmount, Remaining: fee.Remaining-req.body.feeAmount});
    return res.redirect('back')
}