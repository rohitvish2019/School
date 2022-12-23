const Fee = require('../modals/FeeSchema');
const Student = require('../modals/admissionSchema');
const FeeStructure = require('../modals/feeStructure');
module.exports.getFeeDetails = async function(req, res){
    let student = await Student.findById(req.params.id);
    console.log(student.AdmissionNo);
    feeData = await Fee.findOne({AdmissionNo:student.AdmissionNo});
    return res.render('feeSubmit', {feeData:feeData, student:student});
    
}

module.exports.getFee =async function(req, res){
    let fee = await Fee.find({AdmissionNo:req.query.AdmissionNo,Class:req.query.Class});
    if(fee){
        return res.status(200).json({
            message:'ok',
            data:fee
        })
    }else{
        return res.status(404).json({
            message:'No data'
        })
    }
    
}

module.exports.feeSubmission =async function(req, res){
    let fee = await Fee.findOne({AdmissionNo:req.body.AdmissionNo, Class:req.body.Class});
    let paidFee = fee.Paid;
    let remainingFee = fee.Remaining
    if(paidFee == null){
        paidFee = 0
    }

    if(remainingFee == null){
        remainingFee = 0
    }
    await fee.update({Paid: paidFee + +req.body.feeAmount, Remaining: remainingFee-req.body.feeAmount});
    return res.redirect('back')
}

module.exports.updateFeeForm = async function(req, res){
    return res.render('updateFeeForm')
}

module.exports.updateFee = async function(req, res){
    await FeeStructure.findOneAndUpdate({Class:req.body.Class}, {Fees: req.body.Fees});
    return res.redirect('back');
}