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

     _Router.get('/getusertests/:userId',isLoggedIn, (req, res) => {
     	 let userId = req.params.userId;

         let query  = userModel.findById({"_id":userId})

         query.populate({path:'createdTests', model:'testModel', select:{"title":1,"status":1,"startTime":1,"startDate":1}})
         .exec(function(err, tests){
         	if(err){
         		 let response = responseFormat(true, "can't all tests, please try again later", 400, null);
                res.status(400);
                return res.json(response);
         	}
         	if(!tests){
                
                let response = responseFormat(true, "there is no tests availble", 400, null);
                res.status(400);
                return res.json(response);
         	}

         	 let response = responseFormat(false, "all user tests", 200, tests);
             return res.json(response);
         })
     }); // user test end

     // ===============================================================================
     // get all status open tests
     _Router.get('/publictest',isLoggedIn,(req,res)=>{

        let query = testModel.find({"status":"open"});
        query.select("title startDate startTime")

        query.exec((err,tests) => {
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