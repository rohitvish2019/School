const Fee = require('../modals/FeeSchema');
const Student = require('../modals/admissionSchema');
const FeeStructure = require('../modals/feeStructure');
const FeeHistory = require('../modals/feeHistory');
const admissionNoSchema = require('../modals/admission_no')


function convertDateFormat(thisDate){

    let year = thisDate.toString().slice(0,4);
    let month= thisDate.toString().slice(5,7);
    let day = thisDate.toString().slice(8,10);
    console.log( day+"-"+month+"-"+year)
    return day+"-"+month+"-"+year;
}
// To get the fee details of individual student
module.exports.getFeeDetails = async function(req, res){
    try{
        let student = await Student.findById(req.params.id);
        feeData = await Fee.findOne({AdmissionNo:student.AdmissionNo,SchoolCode:req.user.SchoolCode});
        return res.render('feeSubmit', {feeData:feeData, student:student});
    }catch(err){
        return res.redirect('back')
    }
    
    
}

//
module.exports.getFee =async function(req, res){
    try{
        let fee = await Fee.find({AdmissionNo:req.query.AdmissionNo,SchoolCode:req.user.SchoolCode});
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
        let fee = await Fee.findOne({AdmissionNo:req.body.AdmissionNo, Class:req.body.Class,SchoolCode:req.user.SchoolCode});
        let paidFee = fee.Paid;
        let remainingFee = fee.Remaining;
        if(paidFee == null){
            paidFee = 0
        }

        if(remainingFee == null){
            remainingFee = 0
        }
        await fee.update({Paid:fee.Paid + +req.body.Amount, Remaining: fee.Remaining - +req.body.Amount });
        let lastFeeReceiptNumber = await admissionNoSchema.findOne({SchoolCode:req.user.SchoolCode});
        await lastFeeReceiptNumber.update({LastFeeReceiptNo:lastFeeReceiptNumber.LastFeeReceiptNo+1});
        lastFeeReceiptNumber.save();
        console.log(lastFeeReceiptNumber);
        await FeeHistory.create({
            AdmissionNo:fee.AdmissionNo,
            Class: fee.Class,
            SchoolCode:req.user.SchoolCode,
            Amount: req.body.Amount,
            Payment_Date: convertDateFormat(req.body.Date.slice(0,10)),
            Comment: req.body.Comment,
            type:'Fees',
            Receipt_No:lastFeeReceiptNumber.LastFeeReceiptNo,
        });
        return res.status(200).json({
            message:'Fees record updated successfully'
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:'Internal server error'
        })
    }
}

module.exports.cancelFees = async function(req, res){
    try{
        let feeRecord = await FeeHistory.findById(req.params.id);
        await feeRecord.update({isCancelled:true});
        await feeRecord.save();

        let oldFee = await Fee.findOne({AdmissionNo:feeRecord.AdmissionNo, Class:feeRecord.Class,SchoolCode:req.user.SchoolCode});
        await Fee.findOneAndUpdate({AdmissionNo:feeRecord.AdmissionNo, Class:feeRecord.Class,SchoolCode:req.user.SchoolCode},{Paid:oldFee.Paid - feeRecord.Amount, Remaining:oldFee.Remaining + feeRecord.Amount});
        return res.redirect('back');
    }catch(err){
        return res.redirect('back');
    }
}

module.exports.updateFeeForm = async function(req, res){
    let feesData = [];
    try{
        feesData = await FeeStructure.find({SchoolCode:req.user.SchoolCode});
        console.log(feesData);
    }catch(err){
        console.log(err);
    }
    return res.render('updateFeeForm', {feesData});
}

module.exports.updateFee = async function(req, res){
    try{
        let currentFee = await FeeStructure.findOne({Class:req.body.Class,SchoolCode:req.user.SchoolCode});
        if(currentFee){
            await currentFee.update({Fees: req.body.Fees});
            currentFee.save();
        }
        else{
            await FeeStructure.create({
                Class:req.body.Class,
                Fees: req.body.Fees,
                SchoolCode:req.user.SchoolCode
            });
        }   
        
        return res.redirect('back');
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.addConsession = async function(req, res){
    try{
        let fee = await Fee.findOne({AdmissionNo:req.body.AdmissionNo, Class:req.body.Class,SchoolCode:req.user.SchoolCode});
        if(fee){
            console.log("Entered in method");
            let cnc = fee.Concession;
            console.log(cnc);
            await fee.update({Concession: fee.Concession + +req.body.Amount, Remaining: fee.Remaining - req.body.Amount});
            fee.save();
            await FeeHistory.create({
                AdmissionNo:fee.AdmissionNo,
                Class: fee.Class,
                Amount: req.body.Amount,
                Payment_Date: convertDateFormat(req.body.Date.slice(0,10)),
                Comment: req.body.Comment,
                type:'Concession',
                SchoolCode:req.user.SchoolCode
            });
        }
        return res.status(200).json({
            message:'Successfully added concession record'
        })
    }catch(err){
        return res.status(500).json({
            message:'Error adding concession :: Internal server error'
        })
    }
}


module.exports.getFeeHistory = async function(req, res){
    let feeList = await FeeHistory.find({AdmissionNo:req.params.AdmissionNo,type:'Fees',isCancelled:false,SchoolCode:req.user.SchoolCode}).sort({Payment_Date:'descending'});
    return res.status(200).json({
        message:'History fetched successfully',
        data: feeList
    })
}


module.exports.getConcessionHistory = async function(req, res){
    let feeList = await FeeHistory.find({AdmissionNo:req.params.AdmissionNo, type:'Concession',SchoolCode:req.user.SchoolCode}).sort({Payment_Date:'descending'});
    return res.status(200).json({
        message:'History fetched successfully',
        data: feeList
    })
}

module.exports.getFeeReceipt = async function(req, res){
    let feeReport = await FeeHistory.findById(req.params.id);
    let student = await Student.findOne({AdmissionNo:feeReport.AdmissionNo, Class:feeReport.Class, SchoolCode:req.user.SchoolCode})
    console.log(feeReport);
    return res.render('fee_receipt',{feeReport, student});
}