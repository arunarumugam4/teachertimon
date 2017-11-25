// home router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');




// export home router
module.exports = (app, responseFormat) => {

     // route for facebook authentication and login
    _Router.get('/auth/facebook', passport.authenticate('facebook', { 
      scope : ['public_profile', 'email']
    }));

	app.get('/auth/facebook/callback',
      passport.authenticate('facebook', { failureRedirect: '/api/fail', session:false }),
      function(req, res) {
        
        let data = { fbId : req.user.facebook.id};
        // user and password are ok, generate token
        const token = jwt.sign(data, app.get('tokenSecret'), { expiresIn: 60 * 60 * 24 }); // ** validity 24 hours only **
        // assign the token in cookies
        res.cookie("fbtoken", token);
        res.cookie("googletoken", "");
        res.cookie("token", "");


        // Successful authentication, redirect profile.
        res.redirect('/api/profile');
      });

  
	// initialize router as a app level middleware
	app.use('/api', _Router);
}