const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type: String, required:true},
    date: {type: Date, default: Date.now},
    message: {type: String, required:true},
    user:{type: Schema.Types.ObjectId, ref:'User', required:true}
})

MessageSchema
.virtual('formatted_date')
.get(function(){
    return `${this.date.toLocaleDateString()} | ${this.date.toLocaleTimeString()}`
})

module.exports = mongoose.model('Message', MessageSchema);