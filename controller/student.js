const Student = require('../modals/admissionSchema');
const Fee = require('../modals/FeeSchema');
const FeeStructure = require('../modals/feeStructure');
const Result = require('../modals/Result');
const Noty = require('noty');
const RegisteredStudent = require('../modals/RegistrationSchema');
module.exports.getStudent = async function(req, res){
    console.log(req.query);
    let student = await Student.findOne({AdmissionNo:req.params.adm_no, Class:req.query.Class});
    try{
        if(req.query.action === 'fee'){
            let feesList = await Fee.find({AdmissionNo:req.params.adm_no});
            return res.render('feeDetails',{feesList, student});
        }
        else if(req.query.action ==='result'){
            let result = await Result.find({AdmissionNo:req.params.adm_no, Class:req.query.Class});
            return res.render('resultDetails',{result, student});
        }
        else if(req.query.action ==='tc'){
            let result = await Result.find({AdmissionNo:req.params.adm_no, Class:req.query.Class});
            return res.render('TCDetails',{student});
        }
        else{
            if(student){
                console.log("Student found");
                return res.render('student_details',{student:student});
            }else{
                console.log('Student not found')
                return res.status(404).json({
                    message:"No student found"
                })
            }
        }
        
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }

    
}

module.exports.search = function(req, res){
    return res.render('student_search');
}

module.exports.getStudentsByClassForm = function(req, res){
    return res.render('studentListByClass',{action:'none'});
}

module.exports.getStudentsByClassFormFee = function(req, res){
    return res.render('studentListByClass', {action:'fee'});
}

module.exports.getStudentsByClassFormResult = function(req, res){
    return res.render('studentListByClass', {action:'result'});
}

module.exports.getStudentsByClassFormTC = function(req, res){
    return res.render('studentListByClass', {action:'tc'});
}

module.exports.getStudentsByClassFormAdmission = function(req, res){
    return res.render('studentListByClass', {action:'admission'});
}

module.exports.getStudentsList = async function(req, res){
    console.log(req.query);
    let studentList;
    if(req.query.Action === 'admission'){
        studentList = await RegisteredStudent.find({Class:req.query.Class})
    }
    else{
        studentList = await Student.find({Class:req.query.Class, isThisCurrentRecord:true})
    }
    
    return res.status(200).json({
        message:"Student list fetched successfully",
        data: {studentList, action:req.query.Action}
    })
}

module.exports.upgradeClassPage = function(req, res){

    return res.render('upgradeClass');
}


async function upgradeClassStudent(studentAdmissionNumber, studentClass){

    let last_class_details, newRecord, newClass, feeAmounttForClass, result_q, result_h, result_f
    last_class_details = await Student.findOne({AdmissionNo:studentAdmissionNumber, Class:studentClass});
    if(last_class_details.Class=='8'){
        return 400;
        /*res.status(400).json({
            message:'Class can not be upgraded from top class 8'
        });
        */
    }
    newClass='';
    if(last_class_details.Class=='kg-1'){
        newClass='kg-2'
    }else if(last_class_details.Class=='kg-2'){
        newClass='1'
    }else{
        newClass=+last_class_details.Class + 1;
    }
    let thisRecordExists = await Student.findOne({AdmissionNo:last_class_details.AdmissionNo, Class:newClass});
    if(thisRecordExists){
        return 409;
        /*res.status(409).json({
            message:'This student is already upgraded to new class'
        })
        */
    }
    newRecord = await Student.create({
        AdmissionNo:last_class_details.AdmissionNo,
        FirstName:last_class_details.FirstName,
        LastName: last_class_details.LastName,
        FathersName:last_class_details.FathersName,
        MothersName: last_class_details.MothersName,
        Class:null,
        AadharNumber:last_class_details.AadharNumber,
        SSSM:last_class_details.SSSM,
        Mob: last_class_details.Mob,
        DOB:last_class_details.DOB,
        Caste:last_class_details.Caste,
        FullAddress:last_class_details.FullAddress,
        BankName:last_class_details.BankName,
        Branch:last_class_details.Branch,
        AccountNo:last_class_details.AccountNo,
        IFSC:last_class_details.IFSC,
        Medium: last_class_details.Medium,
        Category: last_class_details.Category,
        Religion:last_class_details.Religion,
        isHandicapped: last_class_details.isHandicapped,
        Gender: last_class_details.Gender,
        FathersEducation:last_class_details.FathersEducation,
        MothersEducation:last_class_details.MothersEducation, 
        FathersOccupation:last_class_details.FathersOccupation, 
        MothersOccupation:last_class_details.MothersOccupation, 
        FathersWorkPlace:last_class_details.FathersWorkPlace, 
        MothersWorkPlace:last_class_details.MothersWorkPlace, 
        FathersAnnualIncome:last_class_details.FathersAnnualIncome, 
        MothersAnnualIncome:last_class_details.MothersAnnualIncome, 
        LastSchoolName:last_class_details.LastSchoolName, 
        LastPassingClass:last_class_details.LastPassingClass, 
        LastClassPassingYear:last_class_details.LastClassPassingYear, 
        LastClassGrade:last_class_details.LastClassGrade,
        Session:+last_class_details.Session + 1
    })

    

    await newRecord.update({Class:newClass,LastClassPassingYear:+last_class_details.LastClassPassingYear + 1, LastClassGrade:'need to add', LastSchoolName:'this school', LastPassingClass:last_class_details.Class});
    await last_class_details.updateOne({isThisCurrentRecord:false});
    await last_class_details.save();
    await newRecord.save();
 
    feeAmounttForClass = await FeeStructure.findOne({Class:newClass});
    
    
    await Fee.create({
        AdmissionNo: newRecord.AdmissionNo,
        Class: newClass,
        Total: feeAmounttForClass.Fees,
        Remaining:feeAmounttForClass.Fees,
    });

    result_q = await Result.create({
        AdmissionNo: newRecord.AdmissionNo,
        Class:newClass,
        Term: 'Quarterly',
    });

    result_h = await Result.create({
        AdmissionNo: newRecord.AdmissionNo,
        Class:newClass,
        Term: 'Half-Yearly',
    });

    result_f = await Result.create({
        AdmissionNo: newRecord.AdmissionNo,
        Class:newClass,
        Term: 'Final',
    });
    return 200;

}

module.exports.upgradeOneStudent = async function(req, res){

    let status = await upgradeClassStudent(req.params.AdmissionNo, req.query.Class);
    console.log(status);
    if(status==200){
        return res.end('Upgrading class for student');
    }else if(status==400){
        return res.end('Can not upgrade class for top class 8th');
    }else if(status==409){
        return res.end('This student is already upgraded to next class');
    }else{
        return res.end('error upgrading class');
    }
    
}


module.exports.upgradeClassBulk = function(req, res){
    studentList = req.body.studentList;
    studentClass = req.body.Class
    for(let i=0;i<studentList.length;i++){
        upgradeClassStudent(studentList[i],studentClass)
    }
    console.log(req.body);
    return res.redirect('home');
}


module.exports.getMarksheetUI = async function(req, res){
    console.log(req.query);
    console.log(req.params);
    let result_q = await Result.findOne({Class:req.query.Class, AdmissionNo:req.params.AdmissionNo, Term:'Quarterly'});
    let result_h = await Result.findOne({Class:req.query.Class, AdmissionNo:req.params.AdmissionNo, Term:'Half-Yearly'});
    let result_f = await Result.findOne({Class:req.query.Class, AdmissionNo:req.params.AdmissionNo, Term:'Final'});
    let student = await Student.findOne({Class:req.query.Class, AdmissionNo:req.params.AdmissionNo});
    let subjects;
    if(student.Class == '6' || student.Class=='7' || student.Class=='8'){
        subjects=['Hindi', 'English','Math', 'Science', 'Social_Science', 'Sanskrit']
    }
    else{
        subjects=['Hindi', 'English','Math', 'Moral', 'Computer', 'Enviornment']
    }
    
    
    return res.render('getMarksheet',{result_q, result_h, result_f, student, subjects});
}