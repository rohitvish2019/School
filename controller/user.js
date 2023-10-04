const UserSchema = require('../modals/userSchema');
const fs = require('fs')
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('../School/config/school.properties');
const Messages = require('../modals/messages');


module.exports.mainHome = function(req,res){
    return res.redirect('/user/login');
}

module.exports.login = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/user/home')
    }
    return res.render('login');
}

module.exports.signUp = function(req, res){
    return res.render('sign-up');
}

module.exports.home = async function(req, res){
    let messages = await Messages.find({SchoolCode:req.user.SchoolCode, Category:'School'})
    console.log(req.user.messages);
    const pathToDirectory = '../School/assets/carousel-photos';
    fs.readdir(pathToDirectory, (error, files) => {
    if (error) {
        console.log(error);
    } else {
        if(req.isAuthenticated){
            console.log(req.user.School_Code+'_name');
            let School_name = properties.get(req.user.SchoolCode+'_name');
            return res.render('admin_home', {files,role:req.user.role, School_name, messages});
        }else{
            return re.redirect('/user/login')
        }
    }
    });
    
}

module.exports.createSession = function(req, res){
    return res.redirect('/user/home')
}

module.exports.logout = function(req, res){
    try{
        req.logout(function(err){
            if(err){
                console.log("failed Logging out");
                return res.redirect('/home');
            }
            req.flash('success', 'Logged out successfully')
            return res.redirect('/user/login');
        });
    }catch(err){
        console.log(err);
        return res.redirect('back')
    }
}

module.exports.addNewUser = async function(req, res){
    console.log(req.body)
    if(req.user.role === 'Admin'){
        let user  = await UserSchema.create(
            req.body
        );
        if(req.user.isAdmin == true){
            if(req.body.makesuperadmin === 'on'){
                await user.updateOne({isAdmin:true});
                await user.save();
            }
            return res.redirect('back');
        }
        await user.updateOne({SchoolCode:req.user.SchoolCode});
        await user.save();
        return res.redirect('back');   
    }else{
        return res.render('Error_403');        
    }
}

module.exports.addUserPage = function(req, res){
    if(req.user.role === 'Admin'){
        return res.render('addUser',{role:req.user.role, isAdmin:req.user.isAdmin});
    }else{
        return res.render('Error_403')
    }
}