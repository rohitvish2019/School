module.exports.login = function(req, res){
    if(req.isAuthenticated()){
        return res.render('admin_home')
    }
    return res.render('login');
}

module.exports.signUp = function(req, res){
    return res.render('sign-up');
}

module.exports.createSession = function(req, res){
    return res.render('admin_home');
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