// dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// user secret schema
const userSecretSchema = Schema({
	email: {type:String},
	password: {type:String}
});

// define static methods
userSecretSchema.statics.saveUserSecret = function(userSecrets){
    
    let newUserSecrets = new this(userSecrets);
    newUserSecrets.save((err)=>{
    	if(err){
    		console.log(err)
    	}
    })
}

// define user secret model
mongoose.model('userSecretModel', userSecretSchema);


