// dependencies 
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// define bcrypt salt rounds
const saltRounds = 10;


// define user schema
const userSchema = Schema({
    

        email: { type: String,lowercase:true },
        password: { type: String },
        userName: { type: String },
        token: {type:String},
        id:{type:String},
        attendedtests :[{type:Schema.ObjectId, ref:'attendedTestModel'}],
        createdTests : [{type:Schema.ObjectId, ref:'testModel'}]

});


// define schema methods
userSchema.methods.hashThePassword = function(password) {

   return bcrypt.hash(password, saltRounds)
        .then((hash) => {

            return hash;
        });

}

userSchema.methods.verifyThePassword = function(password) {

   return bcrypt.compare(password, this.password)
        .then((res) => {

            return res;
        });

}


// define static methods
userSchema.statics.duplicateEmailChecker = function(email) {

   return this.findOne({"email": email }).exec((err, user) => {
        if (err) {
            console.log(err);
            return 'error';
        }

        if (!user) {
            return true;
        }

        return false;
    })

}

// define user model
mongoose.model("userModel", userSchema);