const Attendance = require('../modals/attendance');
const Students = require('../modals/admissionSchema');
const propertiesReader = require('properties-reader');
const properties = propertiesReader('../School/config/school.properties');
module.exports.studentHome = function(req, res){
    let classes = properties.get(req.user.SchoolCode+'.CLASSES_LIST').split(',');
    return res.render('AttendanceUI',{classes, role:req.user.role});
}

module.exports.updateAttendance = async function(req, res){
    try{
        let oldRecord = await Attendance.findOne({Class:req.body.Class,SchoolCode:req.user.SchoolCode,Day:req.body.day,Month:req.body.month,Year:req.body.year});
        if(oldRecord){
            await oldRecord.deleteOne();
        }
        presentStudents = req.body.studentsListPresent
        absentStudents = req.body.studentsListAbsent
        if(req.body.studentsListAbsent == '' || req.body.studentsListAbsent == null){
            absentStudents = ''
        }else{
            absentStudents = req.body.studentsListAbsent.join()
        }
        if(req.body.studentsListPresent == '' || req.body.studentsListPresent == null){
            presentStudents=''
        }else{
            presentStudents = req.body.studentsListPresent.join();
        }
        await Attendance.create({
            Class:req.body.Class,
            SchoolCode:req.user.SchoolCode,
            Day:req.body.day,
            Month:req.body.month,
            Year:req.body.year,
            Presents:presentStudents,
            Absents:absentStudents
        });
        return res.status(200).json({
            message:'Updated Attendance'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to update Attendance'
        })
    }
}


module.exports.getAttendance = async function(req, res){
    console.log(req.query);
    try{
        let record = await Attendance.findOne({Class:req.query.Class,SchoolCode:req.user.SchoolCode,Day:req.query.day,Month:req.query.month,Year:req.query.year});
        let students = await Students.find({Class:req.query.Class,SchoolCode:req.user.SchoolCode},'AdmissionNo FirstName LastName FathersName');
        if(record){
            return res.status(200).json({
                record,
                students,
                status:'Updated'
            })
        }else{
            return res.status(200).json({
                students,
                status:'Not Updated'
            })
        }
    }catch(err){
        return res.status(500).json({
            message:'Unable to update Attendance'
        })
    }
}