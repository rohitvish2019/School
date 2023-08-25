const UserSchema = require('../modals/userSchema');
module.exports.login = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/user/home')
    }
    return res.render('login');
}

module.exports.signUp = function(req, res){
    return res.render('sign-up');
}

module.exports.home = function(req, res){
    if(req.isAuthenticated){
        return res.render('admin_home');
    }else{
        return re.redirect('/user/login')
    }
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
    await UserSchema.create(
        req.body
    );

    return res.redirect('back');
}

module.exports.addUserPage = function(req, res){
    return res.render('addUser');
}