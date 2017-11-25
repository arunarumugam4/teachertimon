// login router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const passport = require('passport');
const isAllFieldsAvailable = require('../../customMiddlewares/isAllFieldsAvailable');
const userModel = mongoose.model('userModel');
const validator = require('email-validator');
const jwt = require('jsonwebtoken');



// export login router
module.exports = (app, responseFormat) => {

    _Router.post('/login', isAllFieldsAvailable, (req, res) => {


        // check requested email is a valid one
        if (!(validator.validate(req.body.email))) {
            const response = responseFormat(true, 'This is not a valid email address, try a valid one', 400, null);
            return res.json(response);
        }


       

            // find the user
            userModel.findOne({ 'local.email': req.body.email }, (err, user) => {

                if (err) {
                    console.log(err);
                    let response = responseFormat(true, 'some error occured try again later', 400, null);
                    return res.json(response);
                }

                if (!user) {
                    // user not found
                    let response = responseFormat(true, 'No user found with this email id', 400, null);
                    return res.json(response);
                }



                // check the password is valid or not
                user.verifyThePassword(req.body.password).then((isPasswordValid) => {

                    if (!isPasswordValid) {
                        // wrong password
                        let response = responseFormat(true, "provided password is doesn't match with the email id", 400, null);
                        return res.json(response);
                    }

                    let userData = {}
                    userData._id = user._id;
                    userData.userName = user.local.userName;
                    userData.email = user.local.email;


                    // user and password are ok, generate token
                    const token = jwt.sign(userData, app.get('tokenSecret'), { expiresIn: 60 * 60 * 24 }); // ** validity 24 hours only **
                    // assign the token in cookies
                    res.cookie("token", token);

                    let response = responseFormat(false, 'successfully loged into the account !!!', 200, userData);
                    return res.json(response);
                })




            }) // end


       



    }) // login end




    // initialize router as a app level middleware
    app.use('/api', _Router);
}