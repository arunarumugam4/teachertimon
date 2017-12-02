// create test controller
app.controller('createTestController', ['$http', '$location','$localStorage', function($http, $location,$localStorage) {
    let self = this;
    
   
   // check testid in localstorage
   if(!$localStorage.testId){
      // redirect to all user tests
      $location.path('alltest');
   }

    self.dateBar = false;
    self.data = {};
    self.errorMessage = "";
    self.testId = $localStorage.testId;
    self.testTitle = null;
    self.error = false;
    self.preloader = false;
    self.questionPreloader = false;
    self.initialLoader = true;
    self.questionData = {
        options: []
    };
    self.datemissing = false;

    self.addNew = false;


    self.addedQuestions = [];



    // get all questions belong to this test
    $http.get('/api/getallquestion/' + self.testId)
        .then((res) => {
            self.addedQuestions = res.data.data.questions;
            self.initialLoader = false;
            let date = new Date(res.data.data.startDate);
            self.startDates = date.toDateString();
            self.alldata = res.data.data
            self.testTitle = res.data.data.title;
            self.startTimes = res.data.data.startTime;
            console.log(res.data);


            // change the status of the toggle button based on the question status
            if (self.alldata.status === "closed") {
                $(".switch").find("input[type=checkbox]").prop('checked', false)
            } else {
                $(".switch").find("input[type=checkbox]").prop('checked', true);
            }

            console.log(document.getElementById("check"))
        })
        .catch((err) => {
            console.log(err);
            $location.path('/login');
        });



    // status change 
    $(".switch").find("input[type=checkbox]").on("change", function() {


        let status = $(this).prop('checked');


        let data = {};
        data.questionId = self.questionId;
        if (status) {
            data.status = "open"

        } else {
            data.status = "closed";

        }

        // make a status chang request
        $http.put('/api/statuschange/' + self.testId, data)
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })


    });










    // edit title handler
    self.editTitleHandler = function() {
        let data = { testTitle: self.testTitle };

        $http.put('/api/updatetest/' + self.testId, data)
            .then((res) => {
                console.log(res);
                self.testTitle = res.data.data.title;
            })
    };

    self.titEdit = function() {
        self.editTestTitle = self.testTitle;
    }

    self.canceltitEdit = function() {
        self.testTitle = self.editTestTitle;

    }


    // update date and time
    self.updateDateAndTime = function() {
        if (!self.startDate) {
            self.datemissing = true;
            return
        }

        let startDate = new Date(self.startDate);
        let startTime = self.startTime;


        let data = {
            startDate,
            startTime
        }

        $http.put('/api/startdateandtime/' + self.testId, data)
            .then((res) => {
                console.log(res);
                self.dateBar = false;
                self.datemissing = false;
                self.startDates = self.startDate;
                self.startTimes = self.startTime;
            })
            .catch((err) => {
                console.log(err);
            })
    }

   

    // add question handler
    self.addQuestionHandler = function() {
        self.preloader = true;
        if (!(self.questionData.answer)) {
            self.error = true;
            self.preloader = false;
        } else {



            self.questionData.answer = parseInt(self.questionData.answer);
            console.log(self.questionData)
            $http.put('api/addquestion/' + self.testId, self.questionData)
                .then((res) => {

                    self.preloader = false;
                    console.log(res);
                    self.questionData = {
                        options: []
                    };
                    self.addedQuestions.push(res.data.data);
                    self.addNew = false;
                })
                .catch((err) => {
                    self.preloader = false;
                    console.log(err)
                })
        }


    }


    // edit the question
    self.questionEditHandler = function(questionIndex) {
        self.addNew = false;
        self.questionPreloader = true;
        let questionId = self.addedQuestions[questionIndex]._id;
        let data = {
            question: self.addedQuestions[questionIndex]
        }

        $http.put('/api/updatequestion/' + questionId, data)
            .then(res => {
                self.questionPreloader = false;
                console.log(self.addedQuestions[questionIndex])
                console.log(res);
                self.editmodeOn = false;

            })
            .catch(err => {
                self.questionPreloader = false;
                console.log(err);
            })


    }


    // edit mode hander
    self.editModeHandler = function(index) {
        self.addNew = false;
        self.temp = Object.assign({}, self.addedQuestions[index]);
        self.temp.options = [...self.addedQuestions[index].options];

    }

    // edit cancel handler
    self.editCancelHandler = function(index) {

        self.addedQuestions[index] = self.temp;
    }

    // delete question handler 
    self.deleteQuestionHandler = function(index) {

        let questionId = self.addedQuestions[index]._id;
        let testId = self.testId;


        $http.delete('api/deletequestion/' + questionId + '?testId=' + testId)
            .then((res) => {
                console.log(res);
                self.addedQuestions.splice(index, 1);
            })
            .catch((err) => {
                console.log(err)
            })

    }


}])