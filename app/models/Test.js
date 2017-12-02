// test model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// define schema
let testSchema = Schema({
    title : {type:String},
    admin : {type:Schema.ObjectId, ref:"userModel"},
    createdAt : {type:Date, default:Date.now},
    questions : [{type:Schema.ObjectId, ref:"questionModel"}],
    registeredUsers :[{type:Schema.ObjectId, ref:"userModel"}],
    attendedUsers:[{type:Schema.ObjectId, ref:"userModel"}],
    duration: {type:Date},
    startedAt:{type:Date},
    endedAt:{type:Date},
    startDate:{type:Date, default:Date.now()},
    startTime:{type:String},
    totalMarks:{type:Number},
    status:{type:String,default:'open'}
});


// define model
mongoose.model('testModel', testSchema);