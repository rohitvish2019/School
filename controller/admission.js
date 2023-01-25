const Student = require('../modals/admissionSchema');
const AdmissionNo = require('../modals/admission_no');
const FeeStructure = require('../modals/feeStructure');
const FeeSchema = require('../modals/FeeSchema');
const Result = require('../modals/Result');
const AdmissionNumber = require('../modals/admission_no');

// To render the admission form page
module.exports.addmission =async function(request, response){
    let last = await AdmissionNo.findOne({});
    if(last){
        let adm = last.LastAdmission + 1
        return response.render('./addmission', {ThisAdmissionNumber:adm});
        
    }else{
        return response.render('startup')
    }
    
}

//To add new student in record with dependencies 
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
        
        return response.redirect('/admissions')
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
        return response.redirect('/admissions')
    }
}

// To update the last admission nuber in case of first startup of application

module.exports.updateLastAdmission =async function(req, res){
    console.log(req.body);
    await AdmissionNumber.create(req.body);
    return res.redirect('/admissions')
}

/*
let createFormPDF = async function(){
    try{
        const puppeteer = require('puppeteer');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const website_url = 'http://localhost:8000/admissions';
        await page.setViewport({ width: 1280, height: 720 });
        
        await page.emulateMediaType('screen');
        await page.screenshot({
            path: 'E:\\Projects\\School\\screenshot.jpg'
          });
        
        const pdf = await page.pdf({
            path: 'E:\\Projects\\School\\result.pdf',
            margin: { top: '100px', right: '50px', bottom: '100px', left: '50px' },
            printBackground: true,
            format: 'A4',
        });
        
    }catch(err){
        console.log(err);
    }
    
} 
*/

// To render the preview before submitting the adission form
module.exports.getPreview = function(req, res){
    console.log(req.body)
    return res.render('AdmissionPreview', {data:req.body})
}

// To get the student profile details/n form download
module.exports.getProfile = async function(req, res){
    let student = await Student.findOne({AdmissionNo:req.params.id});
    
    console.log(req.params.id);
    return res.render('StudentProfile', {data:student})
}