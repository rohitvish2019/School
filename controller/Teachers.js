const TeachersSchema = require('../modals/TeachersDetails');

module.exports.home = async function(req, res){
    
    if(req.user.role === 'Admin'){
        let teachers = await TeachersSchema.find({isActive:true});
        return res.render('showTeachers', {teachers, role:req.user.role});
    }else{
        return res.render('Error_403')        
    }	
    
}

module.exports.addNewTeacher = async function(req, res){
    if(req.user.role === 'Admin'){
        try{
            await TeachersSchema.create(req.body);
            return res.redirect('back');
        }catch(err){
            return res.redirect('back')
        }
    }else{
        return res.render('Error_403')        
    }	
    
}

module.exports.updateTeacherDetails = async function(req, res){
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
            DOB:req.body.DOB
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

module.exports.updateSalary = function(req, res){
    
}

module.exports.updateSubjects = function(req, res){
    
}

module.exports.updateEducation = function(req, res){
    
}

