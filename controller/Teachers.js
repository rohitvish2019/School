const TeachersSchema = require('../modals/TeachersDetails');

module.exports.home = async function(req, res){
    
    if(req.user.role === 'Admin'){
        let teachers = await TeachersSchema.find({isActive:true, SchoolCode:req.user.SchoolCode});
        console.log(teachers.length);
        return res.render('showTeachers', {teachers, role:req.user.role});
    }else{
        return res.render('Error_403')        
    }	
    
}

module.exports.getInActiveTeachers = async function(req, res){
    try{
        let inActives = await TeachersSchema.find({SchoolCode:req.user.SchoolCode, isActive:false});
        return res.status(200).json({
            inActives
        })
    }catch(err){
        return res.status(500).json({
            message:'Internal server error'
        })
    }
}

module.exports.addNewTeacher = async function(req, res){
    if(req.user.role === 'Admin'){
        try{
            let newTeacher = await TeachersSchema.create(req.body);
            await newTeacher.updateOne({SchoolCode:req.user.SchoolCode});
            return res.redirect('back');
        }catch(err){
            console.log(err);
            return res.redirect('back')
        }
    }else{
        return res.render('Error_403')        
    }	
    
}

module.exports.updateTeacherDetails = async function(req, res){
    console.log(req.body);
    if(req.user.role === 'Admin'){
        let record = await TeachersSchema.findById(req.body.id);
        await record.updateOne({
            Name:req.body.Name,
            Address: req.body.Address,
            Salary: req.body.Salary,
            Education: req.body.Education,
            Aadhar:req.body.Aadhar,
            Mobile:req.body.Mobile,
            Samagra:req.body.Samagra,
            DOB:req.body.DOB,
            DOJ:req.body.DOJ,
            AccountNo:req.body.AccountNo
        });

        await record.save();
        return res.status(200).json({
            message:'Record updated successfully'
        })
    }else{
        return res.status(403).json({
            message:"Unauthorized"
        })     
    }	
    
    
}

module.exports.removeTeacher = async function(req, res){
    if(req.user.role === 'Admin'){
        try{
            let record = await TeachersSchema.findByIdAndUpdate(req.body.id, {isActive:false});
            record.save();
            return res.status(200).json({
                message:"Removed successfully"
            })
        }catch(err){
            return res.statu(500).json({
                message:"Internal server error"
            })
        }
    }else{
        return res.status(403).json({
            message:'Unauthorized'
        })
    }
}


module.exports.markActive = async function(req, res){
    
    try{
        await TeachersSchema.findByIdAndUpdate(req.params.id, {isActive:true});
    }catch(err){
        console.log(err)
    }
    return res.redirect('back')
}

module.exports.markInActive = async function(req, res){
    
    try{
        await TeachersSchema.findByIdAndUpdate(req.params.id, {isActive:false})
       
    }catch(err){
        console.log(err)
    }
    return res.redirect('back')
}

module.exports.updateSalary = function(req, res){
    
}

module.exports.updateSubjects = function(req, res){
    
}

module.exports.updateEducation = function(req, res){
    
}

