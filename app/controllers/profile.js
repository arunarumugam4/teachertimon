// home router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const isLoggedIn = require('../../customMiddlewares/isLoggedIn')



// export home router
module.exports = (app, responseFormat) => {

     _Router.get('/profile',isLoggedIn, (req, res) => {

              res.json('entered to your profile')
     })



	// initialize router as a app level middleware
	app.use('/api', _Router);
}