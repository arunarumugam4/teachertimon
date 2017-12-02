// home router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const testModel = mongoose.model('testModel');
const questionModel = mongoose.model('questionModel');
const isLoggedIn = require('../../customMiddlewares/isLoggedIn');
const async = require('async');




// export home router
module.exports = (app, responseFormat) => {

     _Router.get('/getallquestion/:testId',isLoggedIn, (req, res) => {
     	 let testId = req.params.testId;

     	 if(!testId){
     	 	 let response = responseFormat(true, "test id is missing", 400, err);
             res.status(400);
            return res.json(response);
     	 }

     	 // function to get all test questions
     	 function getAllQuestions(){

     	 	let query = testModel.findById({ "_id": testId });

     	 	query.populate({path:'questions',model:'questionModel'})
     	 	.exec((err, allquestions) => {
     	 		if (err) {
                let response = responseFormat(true,"some error occured try again later", 400, null);
                res.status(400);
                return res.json(response);
                
                } 

                if(!allquestions){
                	let response = responseFormat(true,"there is no test available with this testId", 400, null);
                    res.status(400);
                     return res.json(response);
                } else {
                	let response = responseFormat(false,"all questions belongs to the test", 200, allquestions);
                	return res.json(response);
                }

     	 	})
     	 }

        // run get all question function
     	 getAllQuestions();

     	
     });// getallquestion end



	// initialize router as a app level middleware
	app.use('/api', _Router);
}