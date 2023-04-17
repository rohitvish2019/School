const Fee = require('../modals/FeeSchema');
const Student = require('../modals/admissionSchema');
const FeeStructure = require('../modals/feeStructure');
const FeeHistory = require('../modals/feeHistory');

// To get the fee details of individual student
module.exports.getFeeDetails = async function(req, res){
    try{
        let student = await Student.findById(req.params.id);
        feeData = await Fee.findOne({AdmissionNo:student.AdmissionNo});
        return res.render('feeSubmit', {feeData:feeData, student:student});
    }catch(err){
        return res.redirect('back')
    }
    
    
}

//
module.exports.getFee =async function(req, res){
    try{
        let fee = await Fee.find({AdmissionNo:req.query.AdmissionNo});
        if(fee){
            return res.status(200).json({
                message:'Success',
                data:fee
            })
        }else{
            return res.status(404).json({
                message:'No data found'
            })
        }
    }catch(err){
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
    
    
}

module.exports.feeSubmission =async function(req, res){
    console.log(req.body);
    try{
        let fee = await Fee.findOne({AdmissionNo:req.body.AdmissionNo, Class:req.body.Class});
        let paidFee = fee.Paid;
        let remainingFee = fee.Remaining;
        if(paidFee == null){
            paidFee = 0
        }

        if(remainingFee == null){
            remainingFee = 0
        }
        await fee.update({Paid:fee.Paid + +req.body.Amount, Remaining: fee.Remaining - +req.body.Amount });
        await FeeHistory.create({
            AdmissionNo:fee.AdmissionNo,
            Class: fee.Class,
            Amount: req.body.Amount,
            Payment_Date: req.body.date
        })
        return res.redirect('back')
    }catch(err){
        console.log(err)
        return res.redirect('back')
    }
    
}

module.exports.updateFeeForm = async function(req, res){
    return res.render('updateFeeForm')
}

module.exports.updateFee = async function(req, res){
    try{
        let currentFee = await FeeStructure.findOne({Class:req.body.Class});
        if(currentFee){
            await currentFee.update({Fees: req.body.Fees});
            currentFee.save();
        }
        else{
            await FeeStructure.create({
                Class:req.body.Class,
                Fees: req.body.Fees
            });
        }   
        
        return res.redirect('back');
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
    
}

module.exports.addConsession = async function(req, res){
    let fee = await Fee.findOne({AdmissionNo:req.body.AdmissionNo, Class:req.body.Class});
    if(fee){
        console.log("Entered in method");
        let cnc = fee.Concession;
        console.log(cnc);
        await fee.update({Concession: fee.Concession + +req.body.Amount, Remaining: fee.Remaining - req.body.Amount});
        fee.save();
    }
    return res.redirect('back');
}


module.exports.getFeeHistory = async function(req, res){
    let feeList = await FeeHistory.find({AdmissionNo:req.params.AdmissionNo});
    return res.status(200).json({
        message:'History fetched successfully',
        data: feeList
    })
}