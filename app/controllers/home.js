// home router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();



// export home router
module.exports = (app, responseFormat) => {

     _Router.get('/', (req, res) => {
     	 res.json('cool')
     })



	// initialize router as a app level middleware
	app.use('/api', _Router);
}