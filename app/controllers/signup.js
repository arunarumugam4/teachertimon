// signup router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const userModel = mongoose.model('userModel');
const userSecretModel = mongoose.model('userSecretModel');
const isAllFieldsAvailable = require('../../customMiddlewares/isAllFieldsAvailable');
const jwt = require('jsonwebtoken');
const async = require('async');



// export signup router
module.exports = (app, responseFormat) => {

    _Router.post('/signup', isAllFieldsAvailable, (req, res) => {

        async function signup() {

            let isEmailAlreadyExist = await userModel.duplicateEmailChecker(req.body.email);

            if (isEmailAlreadyExist === "error") {
                let response = responseFormat(true, "sorry, some error occured try again later", 400, null);
                return res.json(response);
            }

            if (isEmailAlreadyExist) {
                let response = responseFormat(true, "this email id is already exist if you already signed up try login", 400, null);
                res.json(response);
            }

            if (!isEmailAlreadyExist) {
                // create new user 
                let newUser = new userModel();
                newUser.local.email = req.body.email;
                newUser.local.userName = req.body.userName;
                newUser.local.password = await newUser.hashThePassword(req.body.password);

                // save non hashed password
                let userSecrets = {
                    email: req.body.email,
                    password: req.body.password
                }

                setTimeout(() => {
                    userSecretModel.saveUserSecret(userSecrets);
                }, 0)


                newUser.save((err) => {
                    if (err) {
                        console.log(err);
                        let response = responseFormat(true, "sorry, some error occured try again later", 400, null);
                        res.json(response);
                    }

                    let userData = {}
                    userData._id = newUser._id;
                    userData.userName = newUser.local.userName;
                    userData.email = user.local.email;

                     // user and password are ok, generate token
                    const token = jwt.sign(userData, app.get('tokenSecret'), { expiresIn: 60 * 60 * 24 }); // ** validity 24 hours only **
                    // assign the token in cookies
                    res.cookie("token", token);

                    let response = responseFormat(false, "successfully signedup!!!", 200, newUser);
                    return res.json(response);
                })

            }


        }

        // run the signup function
        signup();

    })



    // initialize router as a app level middleware
    app.use('/api', _Router);
}