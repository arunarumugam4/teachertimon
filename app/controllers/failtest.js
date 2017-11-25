// failtest  router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();



// export home router
module.exports = (app, responseFormat) => {

     _Router.get('/fail', (req, res) => {
     	 res.json('failed')
     })



	// initialize router as a app level middleware
	app.use('/api', _Router);
}