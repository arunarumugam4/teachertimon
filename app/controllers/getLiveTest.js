// get all user test router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const testModel = mongoose.model('testModel')
const questionModel = mongoose.model('questionModel')
const userModel = mongoose.model('userModel');
const isLoggedIn = require('../../customMiddlewares/isLoggedIn');
const async = require('async');



// export home router
module.exports = (app, responseFormat) => {

    

     // ===============================================================================
     // get live test
     _Router.get('/livetest/:testId',isLoggedIn,(req,res)=>{
        
        let testId = req.params.testId;

        let query = testModel.findById({"_id":testId});
        query.select("title startDate startTime")

        query
        .populate({path:'questions', model:'questionModel'})
        .exec((err,tests) => {
            if(err){
                let response = responseFormat(true, "sorry!, try again later", 400, null);
                res.status(400);
                return res.json(response);
            };

            
             let response = responseFormat(false, "all user tests", 200, tests);
             return res.json(response);
        })
        
       
     })



	// initialize router as a app level middleware
	app.use('/api', _Router);
}