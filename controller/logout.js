module.exports.logout = function(request, response){
    response.clearCookie('id');
    return response.redirect('back');
}