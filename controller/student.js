const Student = require('../modals/admissionSchema');
const Fee = require('../modals/FeeSchema');
const FeeStructure = require('../modals/feeStructure');
const Result = require('../modals/Result');
const Noty = require('noty');
const path = require('path');
const RegisteredStudent = require('../modals/RegistrationSchema');
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('../School/config/school.properties');
const quarterlyTotalMarks = properties.get('quarterly-total');
const halfYearlyTotalMarks = properties.get('half-yearly-total');
const finalTotalMarks = properties.get('final-total');
const TCRecords = require('../modals/TC_Records');




function numberToWordsInRange(number1) {
    let number = parseInt(number1.toString());
    
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (number < 0 || number > 99) {
        return 'Number out of range';
    }

    if (number < 10) {
        return units[number];
    } else if (number < 20) {
        return teens[number - 10];
    } else {
        const tensDigit = Math.floor(number / 10);
        console.log("Tens")
        const unitsDigit = number % 10;
        console.log("Units"+unitsDigit)
        return tens[tensDigit] + (unitsDigit !== 0 ? ' ' + units[unitsDigit] : '');
    }
}

function getDOBInWords(thisDate){
    
    let year = parseInt(thisDate.toString().slice(0,4));
    let month= parseInt(thisDate.toString().slice(5,7));
    let date = parseInt(thisDate.toString().slice(8,10));
    console.log(date+"%"+month+"%"+year)
    const numbersInWords = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
        "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
        "Twenty", "Twenty One", "Twenty Two", "Twenty Three", "Twenty Four", "Twenty Five", "Twenty Six", "Twenty Seven", "Twenty Eight", "Twenty Nine",
        "Thirty", "Thirty One"
    ];
    
    const monthsInWords = [
        "", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let dateInWords  = numbersInWords[date];
    let monthInWords = monthsInWords[month]
    let year1 = numberToWordsInRange(year.toString().substring(2));
    console.log(numberToWordsInRange(year.toString().substring(2)))
    return dateInWords +" "+monthInWords+" two thousands "+year1;
    
}

function convertDateFormat(thisDate){

    let year = thisDate.toString().slice(0,4);
    let month= thisDate.toString().slice(5,7);
    let day = thisDate.toString().slice(8,10);
    console.log( day+"-"+month+"-"+year)
    return day+"-"+month+"-"+year;
}

module.exports.getStudent = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        let student = await Student.findOne({AdmissionNo:req.params.adm_no, Class:req.query.Class});
        try{
            if(req.query.action === 'fee'){
                let feesList = await Fee.find({AdmissionNo:req.params.adm_no});
                return res.render('feeDetails',{feesList, student,role:req.user.role});
            }
            else if(req.query.action ==='result'){
                let result = await Result.find({AdmissionNo:req.params.adm_no, Class:req.query.Class});
                return res.render('resultDetails',{role:req.user.role, result, student, quarterlyTotalMarks:properties.get(req.user.SchoolCode+'_quarterly-total'), halfYearlyTotalMarks:properties.get(req.user.SchoolCode+'_half-yearly-total'), finalTotalMarks:properties.get(req.user.SchoolCode+'_final-total')});
            }
            else if(req.query.action ==='tc'){
                let tcData = await TCRecords.findOne({AdmissionNo:req.params.adm_no});
                console.log("TC Data")
                console.log(tcData);
                let err=''
                let DOBInWords=getDOBInWords(student.DOB);
                let DOBDate = convertDateFormat(student.DOB);

                if(!tcData.ReleivingClass || !tcData.RelievingDate){
                    err = "TC not generated yet, Please discharge the student first and try again"
                    return res.render('TCDetails',{student,err,DOBInWords,DOBDate});            }
                return res.render('TCDetails',{role:req.user.role,student,err ,tcData,DOBInWords,DOBDate});
            }
            else{
                if(student){
                    console.log("Student found");
                    return res.render('student_details',{role:req.user.role,student:student});
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
    }else{
        return res.status(403).json({
            message:'Unauthorized'
        })   
    }
}

module.exports.search = function(req, res){
    return res.render('student_search',{admin:req.user.isAdmin,role:req.user.role});
}

module.exports.getStudentsByClassForm = function(req, res){
    if(req.user.role == 'Admin'){
        return res.render('studentListByClass',{action:'none',admin:req.user.isAdmin,role:req.user.role});
    }else{
        return res.render('Error_403')
    }
    
}

module.exports.getStudentsByClassFormFee = function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        return res.render('studentListByClass', {action:'fee',admin:req.user.isAdmin,role:req.user.role});
    }else{
        return res.render("Error_403")
    }
    
}

module.exports.getStudentsByClassFormResult = function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        return res.render('studentListByClass', {action:'result',admin:req.user.isAdmin,role:req.user.role});
    }else{
        return res.render('Error_403')    
    }
    
}

module.exports.getStudentsByClassFormTC = function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        return res.render('studentListByClass', {action:'tc',admin:req.user.isAdmin,role:req.user.role});
    }else{
        return res.render('Error_403')        
    }
    
}

module.exports.getStudentsByClassFormAdmission = function(req, res){
    if(req.user.role == 'Admin'){
        return res.render('studentListByClass', {action:'admission',admin:req.user.isAdmin,role:req.user.role});
    }else{
        return res.render('Error_403')
    }
}

module.exports.getStudentsList = async function(req, res){
    let studentList;
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        if(req.query.Action === 'admission'){
            studentList = await RegisteredStudent.find({Class:req.query.Class,SchoolCode:req.user.SchoolCode})
        }
        else{
            studentList = await Student.find({Class:req.query.Class, isThisCurrentRecord:true,SchoolCode:req.user.SchoolCode})
        }
        return res.status(200).json({
            message:"Student list fetched successfully",
            data: {studentList, action:req.query.Action}
        })
    }else{
        return res.status(403).json({
            message:"Unauthorized"
        })        
    }  
}

module.exports.upgradeClassPage = function(req, res){
    if(req.user.role === 'Admin'){
        return res.render('upgradeClass', {admin:req.user.isAdmin,role:req.user.role});
    }else{
        return res.render('Error_403')
    }
    
}


function validateResultStatus(resultData, SchoolCode){
    let student_Class = resultData[0].Class;
    if(student_Class == '6' || student_Class=='7' || student_Class=='8'){
        subjects=['Hindi', 'English','Math', 'Science', 'Social_Science', 'Sanskrit']
    }
    else{
        subjects=['Hindi', 'English','Math', 'Moral', 'Computer', 'Enviornment']
    }

    
    let maxMarks=0;
    for(let i=0;i<resultData.length;i++){
        if(i==0){
            maxMarks = properties.get(SchoolCode+'_quarterly-total')
        }else if(i==1){
            maxMarks = properties.get(SchoolCode+'_half-yearly-total')
        }else if(i==2){
            maxMarks = properties.get(SchoolCode+'_final-total')
        }else{
            maxMarks=100
        }
        for(let j=0;j<subjects.length;j++){
            if(resultData[i][subjects[j]] == -1 || resultData[i][subjects[j]] > maxMarks){
                return false;
            }
        }
    }
    console.log(subjects);
    return true;
}

async function upgradeClassStudent(studentAdmissionNumber, studentClass, SchoolCode){
    console.log(SchoolCode);
    let last_class_details, newRecord, newClass, feeAmounttForClass, result_q, result_h, result_f
    last_class_details = await Student.findOne({AdmissionNo:studentAdmissionNumber, Class:studentClass,SchoolCode:SchoolCode});
    let lastResult = await Result.find({AdmissionNo:studentAdmissionNumber, Class:studentClass, SchoolCode:SchoolCode});
    let lastResultStatus = validateResultStatus(lastResult, SchoolCode);
    if(!lastResultStatus){
       return 424;
    }

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
    let thisRecordExists = await Student.findOne({AdmissionNo:last_class_details.AdmissionNo, Class:newClass, SchoolCode:SchoolCode});
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
        Session:+last_class_details.Session + 1,
        SchoolCode:SchoolCode
    })


    await newRecord.updateOne({Class:newClass,LastClassPassingYear:+last_class_details.LastClassPassingYear + 1, LastClassGrade:'need to add', LastSchoolName:'this school', LastPassingClass:last_class_details.Class});
    await last_class_details.updateOne({isThisCurrentRecord:false});
    await last_class_details.save();
    await newRecord.save();
    console.log(newClass);
    feeAmounttForClass = await FeeStructure.findOne({Class:newClass,SchoolCode:SchoolCode});
    console.log(feeAmounttForClass);
    
    await Fee.create({
        AdmissionNo: newRecord.AdmissionNo,
        Class: newClass,
        Total: feeAmounttForClass.Fees,
        Remaining:feeAmounttForClass.Fees,
        SchoolCode:SchoolCode
    });

    result_q = await Result.create({
        AdmissionNo: newRecord.AdmissionNo,
        Class:newClass,
        SchoolCode:SchoolCode,
        Term: 'Quarterly',
    });

    result_h = await Result.create({
        AdmissionNo: newRecord.AdmissionNo,
        Class:newClass,
        SchoolCode:SchoolCode,
        Term: 'Half-Yearly',
    });

    result_f = await Result.create({
        AdmissionNo: newRecord.AdmissionNo,
        Class:newClass,
        Term: 'Final',
        SchoolCode:SchoolCode,
    });
    return 200;

}

module.exports.upgradeOneStudent = async function(req, res){
    if(req.user.role === 'Admin'){
        let status = await upgradeClassStudent(req.params.AdmissionNo, req.query.Class, req.user.SchoolCode);
        console.log(status);
        if(status==200){
            return res.status(200).json({
                message:'Student upgraded successfully'
            });
        }else if(status==400){
            return res.status(400).json({
                message:'Student can not be upgraded from class 8th as per school policy'
            });
        }else if(status==409){
            return res.end('This student is already upgraded to next class');
        }
        else if(status == 424){
            return res.status(424).json({
                message:"Result is not updated correctly, kindly updateOne and try again"
            })
        }
        else{
            return res.end('error upgrading class');
        }
    }else{
        return res.status(403).json({
            message:"Unauthorized"
        })        
    }
}


module.exports.upgradeClassBulk = function(req, res){
    if(req.user.role === 'Admin'){
        try{
            if(req.body.Class==='8'){
                return res.status(400).json({
                    message:'8th class can not be upgraded'
                })
            }
            studentList = req.body.studentList;
            studentClass = req.body.Class
            for(let i=0;i<studentList.length;i++){
                upgradeClassStudent(studentList[i],studentClass,req.user.SchoolCode)
            }
            return res.status(200).json({
                message:'Markes students are updgraded to new class successfully.'
            });
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:'Internal server error'
            })
        }
    }else{
        return res.status(403).json({
            message:"Unauthorized"
        })        
    }
    
}

function calculateGrade(value){
    if(value > 100){
        return "Invalid"
    }
    if(value <= -1){
        return 'NA'
    }else if( value <= 100 && value > 90){
        return 'A+'
    }else if(value <= 90 && value > 74){
        return 'A'
    }else if( value <= 75 && value > 59){
        return 'B'
    }else if(value <= 60 && value > 44){
        return 'C'
    }else if(value <= 45 && value > 33){
        return 'D'
    }else{
        return 'F'
    }
}

function getPercentage(marks, total){
    return marks*100/total
}

function getDate(){
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;
    console.log(currentDate); 
    return currentDate
}


module.exports.getMarksheetUI = async function(req, res){
    if(req.user.role === 'Admin' || req.user.role === 'Teacher'){
        let result_q = await Result.findOne({Class:req.query.Class, AdmissionNo:req.params.AdmissionNo, Term:'Quarterly'});
        let result_h = await Result.findOne({Class:req.query.Class, AdmissionNo:req.params.AdmissionNo, Term:'Half-Yearly'});
        let result_f = await Result.findOne({Class:req.query.Class, AdmissionNo:req.params.AdmissionNo, Term:'Final'});
        let student = await Student.findOne({Class:req.query.Class, AdmissionNo:req.params.AdmissionNo});
        let subjects;
        console.log(result_q['Hindi']);
        let result = [];
        result.push(result_q);
        result.push(result_h);
        result.push(result_f);
        let resultStatus = validateResultStatus(result, req.user.SchoolCode);
        let error_message='';
        if(!resultStatus){
            error_message='Result is not updated correctly, kindly updateOne the result and try again';
        }
        console.log(result[0].Hindi);
        let q_grades={};
        let h_grades={};
        let f_grades={};
        let grades = [];
        let totals = [];
        grades.push(q_grades);
        grades.push(h_grades);
        grades.push(f_grades);
        
        
        if(student.Class == '6' || student.Class=='7' || student.Class=='8'){
            subjects=['Hindi', 'English','Math', 'Science', 'Social_Science', 'Sanskrit']
        }
        else{
            subjects=['Hindi', 'English','Math', 'Moral', 'Computer', 'Enviornment']
        }
        for(let i=0;i<grades.length;i++){
            let t= 0;
            if(i==0){
                totalsToTerm = properties.get(req.user.SchoolCode+'_quarterly-total')
            }else if(i==1){
                totalsToTerm = properties.get(req.user.SchoolCode+'_half-yearly-total')
            }
            else if(i=2){
                totalsToTerm = properties.get(req.user.SchoolCode+'_final-total')
            }
            else{
                totalsToTerm=100
            }
            for(let j=0;j<subjects.length;j++){
                let grade = calculateGrade(getPercentage(result[i][subjects[j]],totalsToTerm))
                t = t+result[i][subjects[j]];
                grades[i][subjects[j]] = grade;
            }
            totals.push(t);
        }
        let Terms = ['Quarterly','Half-Yearly','Final'];
        let overAllMarks = 0;
        for(let i=0;i<3;i++){
            let fullMarks=0;
            if(i===0){
                fullMarks = properties.get(req.user.SchoolCode+'_quarterly-total')
            }else if(i===1){
                fullMarks = properties.get(req.user.SchoolCode+'_half-yearly-total')
            }else if(i==2){
                fullMarks = properties.get(req.user.SchoolCode+'_final-total')
            }else{
                fullMarks = 600
            }
            overAllMarks = overAllMarks + totals[i];
            totals.push(calculateGrade(getPercentage(totals[i], fullMarks*6)));
        } 
        await Student.findOneAndUpdate({Class:student.Class, AdmissionNo:student.AdmissionNo},{quarterlyGrade:totals[3]});
        await Student.findOneAndUpdate({Class:student.Class, AdmissionNo:student.AdmissionNo},{halfYearlyGrade:totals[4]});
        await Student.findOneAndUpdate({Class:student.Class, AdmissionNo:student.AdmissionNo},{finalGrade:totals[5]});   
        await Student.findOneAndUpdate({Class:student.Class, AdmissionNo:student.AdmissionNo},{TotalGrade:calculateGrade(getPercentage(overAllMarks, (properties.get(req.user.SchoolCode+'_quarterly-total')+properties.get(req.user.SchoolCode+'_half-yearly-total')+properties.get(req.user.SchoolCode+'_final-total'))*6))});   
        return res.render('getMarksheet',{role:req.user.role,admin:req.user.isAdmin,error_message, result_q, result_h, result_f, student, subjects, grades, totals});
    }else{
        return res.render('Error_403')        
    }	
    
}

module.exports.dischargeStudent = async function(req, res){
    if(req.user.role === 'Admin'){
        try{
            let student = await Student.findOne({AdmissionNo:req.params.AdmissionNo,isThisCurrentRecord:true})
            console.log(student.TotalGrade)
            if(!student.TotalGrade){
                console.log("Result not updated")
                return res.status(500).json({
                    message:"Result not updated correctly"
                })
            }
            await Student.findOneAndUpdate({AdmissionNo:req.params.AdmissionNo,isThisCurrentRecord:true }, {isThisCurrentRecord:'false'});
            await TCRecords.findOneAndUpdate({AdmissionNo:req.params.AdmissionNo}, {RelievingDate:getDate(), ReleivingClass:student.Class})
            
            return res.status(200).json({
                message:"Student is updated as alumini now"
            })
        }catch(err){
            console.log(err);
            return res.status(500).json({
                message:"Error discharging student, please try again later"
            })
        }
    }else{
        return res.status(403).json({
            message:"Unauthorized"
        })        
    }  
}