// home router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');



// export home router
module.exports = (app, responseFormat) => {

    _Router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
           
            failureRedirect: '/#!/login',
            session:false
        }), function(req, res){
        	 let data = { _id : req.user._id};
        	 
        // user and password are ok, generate token
        const token = jwt.sign(data, app.get('tokenSecret'), { expiresIn: 60 * 60 * 24 }); // ** validity 24 hours only **
        // assign the token in cookies
        res.cookie("token", token);
        

        // Successful authentication, redirect profile.
        res.redirect('/#!/publictest');
        });





// initialize router as a app level middleware
app.use('/api', _Router);
}