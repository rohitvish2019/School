const Fee = require('../modals/FeeSchema');
const Student = require('../modals/admissionSchema');
const FeeStructure = require('../modals/feeStructure');

module.exports.getFeeDetails = async function(req, res){
    try{
        let student = await Student.findById(req.params.id);
        feeData = await Fee.findOne({AdmissionNo:student.AdmissionNo});
        return res.render('feeSubmit', {feeData:feeData, student:student});
    }catch(err){
        return res.redirect('back')
    }
    
    
}

module.exports.getFee =async function(req, res){
    try{
        let fee = await Fee.findOne({AdmissionNo:req.query.AdmissionNo,Class:req.query.Class});
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
    try{
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