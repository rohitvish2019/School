const Messages = require('../modals/messages')
module.exports.newMessage = function(req, res){
    return res.render('message', {role:req.user.role});
}

module.exports.addMessageSchool = async function(req, res){
    try{
        await Messages.create({
            Heading: req.body.Heading,
            Message: req.body.Message,
            SchoolCode: req.user.SchoolCode,
            Category:req.body.Category,
            Value:req.body.Value,
        });
        return res.status(200).json({
            message:'Message sent'
        })    
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to send message'
        })
    }
}


module.exports.setNotificationsToClass = async function(req, res){
    try{
        await Messages.create({
            Heading: req.body.Heading,
            Message: req.body.Message,
            SchoolCode: req.user.SchoolCode,
            Category:'Class',
            Value:req.params.Class,
        })
        return res.status(200).json({
            message:'Notification sent'
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to create notification'
        })
    }
}


module.exports.deleteMessage = async function(req, res){
    try{
        let message = await Messages.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message:'Message deleted successfully',
            id:message._id
        })
    }catch(err){
        return res.status(500).json({
            message:'Unable to delete'
        })
    }
    
}

module.exports.getNotifications = function(req, res){
    let messages = Messages.find({Class:req.body.Class, SchoolCode: req.user.SchoolCode,})
}

module.exports.deleteMessageSchool = async function(req, res){
    try{
        let message = await Messages.findByIdAndDelete(req.body.id);
        return res.status(200).json({
            message: 'Record deleted'
        })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'Unable to delete'
        })
    }
    
}