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
    let students =await Student.find({Class:req.body.Class});
    for(let i=0;i<students.length;i++){
        let record = await Fee.findOne({AdmissionNo:students[0].AdmissionNo});
        if(record){
            await record.update({Total:req.body.Amount})
        }else{
            await Fee.create({
                Total:req.body.Amount
            })
        }
    }
    return res.status(200).json({
        message:"Success"
    })
}