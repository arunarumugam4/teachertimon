// create test router
// dependencies
const mongoose = require('mongoose');
const express = require('express');
const _Router = express.Router();
const testModel = mongoose.model('testModel');
const questionModel = mongoose.model('questionModel');
const userModel = mongoose.model('userModel');
const isLoggedIn = require('../../customMiddlewares/isLoggedIn');
const async = require('async');




// export home router
module.exports = (app, responseFormat) => {

    _Router.post('/createtest', isLoggedIn, (req, res) => {

        // get the body from req object
        let body = req.body;

        // function to find the user
        function getUser(clb) {

            userModel.findById({ '_id': req.decoded._id }, (err, user) => {
                if (err) {
                    return clb('error', err)
                }

                return clb(null, user);
            })
        };

        // function to create test
        function createTest(user, clb) {

            // check for missing fields
            if (!body.testTitle) {
                return clb('title of the test is missing')
            }

            // create new test
            let newTest = new testModel({
                title: body.testTitle,
                admin: mongoose.Types.ObjectId(req.decoded._id)
            });

            // save the test 
            newTest.save((err) => {
                if (err) {
                    return clb("can't create test now, try again later")
                }

                return clb(null, user, newTest);

            });

        }

        // savet the test in user created test field
        function updateCreatedTest(user, newTest, clb) {
            user.createdTests = user.createdTests || [];
            user.createdTests.push(newTest);

            // save the updated user
            user.save((err) => {
                if (err) {
                    return clb("something went wrong, try some time");
                }

                return clb(null, newTest);
            })


        };


        // apply async waterfall method 
        async.waterfall([getUser, createTest, updateCreatedTest], function(err, result) {
            if (err) {
                console.log(err);

                let response = responseFormat(true, err, 400, null);
                res.status(400);
                return res.json(response);
            };


            // if everything ok send the id of the created test
            let response = responseFormat(false, "new test successfully created", 200, result._id);
            return res.json(response);
        });

    }); // create test end



    // =========================================================================

    // create questions and put that into respective test fields
    _Router.put('/addquestion/:testId', isLoggedIn, (req, res) => {
        // get the body from req object
        let questionBody = req.body;
        let testId = req.params.testId;

        if (!testId) {

            let response = responseFormat(true, "test id is missing", 400, err);
            res.status(400);
            return res.json(response);
        }

        function getTest(clb) {

            // first check the test model is present or not
            testModel.findById({ "_id": testId }, function(err, test) {
                if (err) {
                    return clb("something went wrong, could find the test field, try again later")
                }

                if (!test) {
                    return clb("no test is present with this test id");
                }

                return clb(null, test);
            })
        };


        function createQuestion(test, clb) {
            // check the question fields
            if (!questionBody.question || !questionBody.options || !questionBody.answer || !questionBody.mark) {
                return clb("some question parameters are missing, please give all the required question fields")
            }
            // create new question
            let newQuestion = new questionModel({
                question: questionBody.question,
                options: questionBody.options,
                answer: questionBody.answer,
                mark: questionBody.mark,
                createdBy: mongoose.Types.ObjectId(req.decoded._id)

            });

            // save the new question 
            newQuestion.save((err) => {
                if (err) {
                    return clb("can't create a new question, try again");
                }

                return clb(null, newQuestion, test)
            })
        }


        // add new question to the test field
        function addNewQuestionToTest(newQuestion, test, clb) {
            test.questions.push(newQuestion);
            test.save((err) => {
                if (err) {
                    return ("question created but can't add to the test")
                }

                return clb(null, newQuestion);
            })
        };


        // run async water fall
        async.waterfall([getTest, createQuestion, addNewQuestionToTest], function(err, newQuestion) {

            if (err) {
                let response = responseFormat(true, err, 400, null);
                res.status(400);
                return res.json(response);
            }

            let response = responseFormat(false, "question added to the test", 200, newQuestion);
            return res.json(response);


        })

    }); // add question end



    // =========================================================================

    // delete particular question from test
    _Router.delete('/deletequestion/:questionId', isLoggedIn, (req, res) => {

        let questionId = req.params.questionId;
        let testId = req.query.testId;
        


        if (!questionId) {

            let response = responseFormat(true, "question id is missing", 400, err);
            res.status(400);
            return res.json(response);
        }

        // get the question and verify the user before delete
        function getQuestion(clb) {
            questionModel.findOne({ "_id": questionId }, function(err, question) {
                if (err) {

                    return clb("cant find the question, try again later");
                }
                if (!question) {
                    return clb("no question available with this question id");
                }

                // check who created this
                if (!(question.createdBy.toString() === req.decoded._id)) {
                    return clb("you can't delete this question, user who created this question only able delete the questions");
                };

                return clb(null, question);
            })
        }

        // remove the question from test field
        function removefromTestField(question, clb) {
            if (!testId) {
                return clb('test id must needed')
            }
            testModel.findByIdAndUpdate({ "_id": testId }, { $pull: { questions: questionId } }, function(err, test) {
                if (err) {
                    return clb("something went wrong can't find the test, try again later");
                }

                if (!test) {
                    return clb("no test available with this test id try valid one");
                }


                return clb(null, question);

            })
        }

        // remove the question completely
        function deleteQuestion(question, clb) {
            question.remove((err) => {
                if (err) {
                    return clb("can't delete the question, try again later");
                }

                return clb(null)
            })
        }


        // run the async water fall for delete question 
        async.waterfall([getQuestion, removefromTestField, deleteQuestion], function(err) {
            if (err) {
                let response = responseFormat(true, err, 400, null);
                res.status(400);
                return res.json(response);
            }

            let response = responseFormat(false, "question successfully deleted", 200, null);
            return res.json(response);

        })


    }) // delete question end

    // =========================================================================  


    // delete the test completly
    _Router.delete('/deletetest/:testId', isLoggedIn, (req, res) => {

        let testId = req.params.testId;

        if (!testId) {

            let response = responseFormat(true, "test id is missing", 400, err);
            res.status(400);
            return res.json(response);
        }

        // check the admin
        function checkAdminAndRemove(clb) {
            testModel.findById({ "_id": testId }, function(err, test) {
                if (err) {
                    return clb("cant get the test, try again later");
                }

                if (!test) {
                    return clb("no test available with this id");
                }

                // verify the admin
                if (!test.admin.toString === req.decoded._id) {
                    return clb("you can't delete this test, only admin of the test able delete the tests");
                }

                test.remove((err) => {
                    if (err) {
                        return clb("can't remove the test, try again later")
                    }

                    return clb(null);
                })
            })
        }


        // run async waterfall for 
        async.waterfall([checkAdminAndRemove], function(err) {
            if (err) {
                let response = responseFormat(true, err, 400, null);
                res.status(400);
                return res.json(response);
            }

            let response = responseFormat(false, "test successfully deleted", 200, null);
            return res.json(response);

        })


    }); // delete test end


    // ========================================================================= 

    // update test title
    _Router.put('/updatetest/:testId', (req, res) => {
        let testTitle = req.body.testTitle;
        let testId = req.params.testId;

        if (!testTitle) {

            let response = responseFormat(true, "testTitle  is missing", 400, null);
            res.status(400);
            return res.json(response);
        }



        if (!testId) {

            let response = responseFormat(true, "testId  is missing", 400, err);
            res.status(400);
            return res.json(response);
        }

        // find and update the test field
        testModel.findByIdAndUpdate({ "_id": testId }, { $set: { title: testTitle } }, { new: true }, (err, test) => {
            if (err) {
                let response = responseFormat(true, "can't find the title with this id", 400, null);
                res.status(400);
                return res.json(response);
            }

            if (!test) {
                let response = responseFormat(true, "there is no test available with this testId", 400, null);
                res.status(400);
                return res.json(response);
            }


            let response = responseFormat(false, "title has been sucessfully updated", 200, test);
            return res.json(response);


        })

    }) // test update end




    // ========================================================================= 

    // update individual question

    _Router.put('/updatequestion/:questionId', isLoggedIn, (req, res) => {
        let questionId = req.params.questionId;
        let updatedQuestion = req.body.question;

        questionModel.findByIdAndUpdate({ "_id": questionId }, { $set: updatedQuestion }, { new: true }, (err, question) => {
            if (err) {

                let response = responseFormat(true, "can't find the question with this id", 400, null);
                res.status(400);
                return res.json(response);
            }

            let response = responseFormat(false, "question has been sucessfully updated", 200, question);
            return res.json(response);
        })


    }) // question update end

    
    // =======================================================================
    // update test date and time
    _Router.put('/startdateandtime/:testId',isLoggedIn, (req,res) =>{
       let startDate = req.body.startDate;
       let startTime = req.body.startTime;
       let testId = req.params.testId


       if(!startDate || !startTime) {
           let response = responseFormat(true, "start date and start time is missing", 400, null);
           res.status(400);
           return res.json(response);
       }
  
      testModel.findByIdAndUpdate({"_id":testId},{$set:{"startDate":startDate,"startTime":startTime}}, function(err){
        if(err){
            console.log(err);
            let response = responseFormat(true, "can't update date and time try again later", 400, null);
            res.status(400);
            return res.json(response);
        }
    
        let response = responseFormat(false, "date and time successfully updated", 200, null);
        return res.json(response);

      })

    }) // update date and time end


    // ================================================================================

    // test status change
    _Router.put('/statuschange/:testId',isLoggedIn, (req, res) => {
      let testId = req.params.testId;
      let status = req.body.status;

      testModel.findById({_id:testId},function(err, test){
        if(err){
             console.log(err);
            let response = responseFormat(true, "can't update the status try again later", 400, null);
            res.status(400);
            return res.json(response);
        }
        if(!test){
             console.log(err);
            let response = responseFormat(true, "sorry!, no test available with this test id", 400, null);
            res.status(400);
            return res.json(response);
        }

        if(!status ==="open" && !status === "closed"){
            let response = responseFormat(true, "status should be closed or opern only any other values are not allowed", 400, null);
            res.status(400);
            return res.json(response);
        }
        
        test.status = status;

        test.save(err => {
            if(err){
                let response = responseFormat(true, "sorry!, can't update the status try again later", 400, null);
                res.status(400);
                return res.json(response);
            }
           
           let response = responseFormat(false, "status successfully updated", 200, null);
            
           return res.json(response);

        })

            
      })

    }) // status change end


    // initialize router as  app level middleware
    app.use('/api', _Router);

}