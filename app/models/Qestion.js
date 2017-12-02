// define question model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define question schema
let questionSchema = Schema({
	question : {type:String},
	options :[{type:String}],
	answer : {type:Number},
	mark : {type:Number},
	createdBy:{type:Schema.ObjectId, ref:'userModel'}
})

// define question model
mongoose.model('questionModel', questionSchema);