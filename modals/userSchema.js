const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    email:{
        type: String,
        required : true,
        unique : true
    },
    password:{
        type: String,
        required: true
    },

    isAdmin:{
        type: Boolean,
        default : false
    }
},
{
    timestamps: true
});


let User = mongoose.model('User', userSchema);
module.exports = User;