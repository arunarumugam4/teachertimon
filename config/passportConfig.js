// dependencies 

const facebookStrategy = require('passport-facebook');
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const mongoose = require('mongoose');
const userModel = mongoose.model('userModel');
const fbAppSecrets = require('../secrets/facebookSecret');
const googleAppSecrets = require('../secrets/googleSecret');



// export passport configuration
module.exports = (passport) => {
    
// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
        done(err, user);
    });
});



// google strategy
passport.use(new googleStrategy({

        clientID        : googleAppSecrets.clientId,
        clientSecret    : googleAppSecrets.clientSecret,
        callbackURL     : googleAppSecrets.callbackURL,
        

    },function(token, refreshToken, profile, done){
        
        process.nextTick(function(){

            userModel.findOne({ 'google.id' : profile.id }, function(err, user) {
                if (err)
                    return done(err);

                if (user) {

                    // if a user is found, log them in
                    return done(null, user);
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser          = new userModel();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email

                    // save the user
                    newUser.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, newUser);
                    });
                }
            });
        })

    }))// google strategy end




// facebook strategy
 passport.use(new facebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : fbAppSecrets.appId,
        clientSecret    : fbAppSecrets.appSecret,
        callbackURL     : fbAppSecrets.callbackURL,
        

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
              
              
        // asynchronous
        process.nextTick(function() {

            // find the user in the database based on their facebook id
            userModel.findOne({ 'facebook.id' : profile.id }, function(err, user) {
           
                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser   = new userModel();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile._json.name //look at the passport user profile to see how names are returned
                   // newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });

    }));

}


