// google login api secrets
let clientId = "864724408801-6c76b6k889frrthk1d6fcq3meq70vas1.apps.googleusercontent.com";
let clientSecret = "bZxj2-hox6hJ5b9czojtVdWu";
let callbackURL = "http://localhost:3000/auth/google/callback"


let googleAppSecrets = {
	clientId,
	clientSecret,
	callbackURL
}

// epxport
module.exports = googleAppSecrets;