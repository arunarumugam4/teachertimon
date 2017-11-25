// logout route
// dependencies
const mongoose = require("mongoose");
const express = require("express");
const _Router = express.Router();




module.exports = (app, responseFormat) => {

    _Router.get('/logout', (req, res) => {

        // destroy the cookie
        res.cookie("token", "");
        res.cookie("fbtoken","");
        res.cookie("googletoken","")
        let response = responseFormat(false, "successfully logged out !!!", 200, null);
        res.json(response);


    }) // end


    // mount the router as an app level middleware
    app.use('/api', _Router);

} // end