// user attended test model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define schema
let attendedTestSchema = Schema({
	test : {type:Schema.ObjectId, ref:'testModel'},
	score : {type:Number},
	rank : {type:Number}

});


// define model
mongoose.model('attendedTestModel', attendedTestSchema);