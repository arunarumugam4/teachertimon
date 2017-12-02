// home router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const isLoggedIn = require('../../customMiddlewares/isLoggedIn');



// export home router
module.exports = (app, responseFormat) => {

     _Router.get('/profile',isLoggedIn, (req, res) => {
              
              let response = responseFormat(false,'entered to your profile',200,req.decoded._id);
              return res.json(response);
     })



	// initialize router as a app level middleware
	app.use('/api', _Router);
}