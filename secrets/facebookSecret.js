// facebook app secret
let appId = 1251034234996355;
let appSecret = "479c0719e5c4947d87981bc652c82782";
let callbackURL= "https://teachertimon.herokuapp.com/auth/facebook/callback";
let profileURL = 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email';
let profileFields = ['id', 'email', 'name']; // For requesting permissions from Facebook API

let fbAppSecrets = {
	appId,
	appSecret,
	callbackURL,
	profileURL,
	profileFields
}


// export fbapp secrets
module.exports = fbAppSecrets;