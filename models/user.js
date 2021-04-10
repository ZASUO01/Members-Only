const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type:String, required:true, minlength: 1, maxlength:100},
    last_name: {type:String, required:true, minlength: 1, maxlength:100},
    username: {type:String, required:true},
    password:{type:String, required:true},
    membership_status: {type: String, default:'Visitant', enum:['Visitant', 'Member', 'Admin']},
    admin: {type: Boolean, default: false}
})



module.exports = mongoose.model('User', UserSchema);