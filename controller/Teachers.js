const TeachersSchema = require('../modals/TeachersDetails');

module.exports.home = async function(req, res){
    let teachers = await TeachersSchema.find({});
    return res.render('showTeachers', {teachers});
}

module.exports.addNewTeacher = async function(req, res){
    try{
        await TeachersSchema.create(req.body);
        return res.redirect('back');
    }catch(err){
        return res.redirect('back')
    }
}

module.exports.updateTeacherDetails = async function(req, res){
    console.log(req.body.id)
    let record = await TeachersSchema.findById(req.body.id);
    await record.updateOne({
        Name:req.body.Name,
        Address: req.body.Address,
        Salary: req.body.Salary,
        Education: req.body.Education,
        Aadhar:req.body.Aadhar,
        Mobile:req.body.Mobile,
        Samagra:req.body.Samagra,
        DOB:req.body.DOB
    });

    await record.save();
    return res.status(200).json({
        message:'Record updated successfully'
    })
}

module.exports.removeTeacher = function(req, res){

}

module.exports.updateSalary = function(req, res){
    
}

module.exports.updateSubjects = function(req, res){
    
}

module.exports.updateEducation = function(req, res){
    
}

