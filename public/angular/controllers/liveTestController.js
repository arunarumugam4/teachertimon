// live test controller
app.controller('liveTestController', ['$http', '$location', '$localStorage', '$cookies','$timeout','$scope',function($http, $location, $localStorage, $cookies,$timeout,$scope) {
    let self = this;
    self.name = "liveTest";
    self.totalMarks = 0;
    self.availableMark = 0;
    self.usersOnline =0;
    self.notlive = false;
    self.adminMessage = "NUMBER OF STUDENTS WRITING THIS TEST";
    self.endbtn = true;
    self.summary = false;


    let socket = app.socket;




    // check for cookies 
    if (!($cookies.get('token'))) {

        // no token redirect to login page
        $location.path('login');

        return;
    }

    // jwt token parsing
    function parseJwt(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    self.user = parseJwt($cookies.get('token'))
    app.userId = self.user._id;

    // check testid in localstorage
    if (!$localStorage.testId) {
        // redirect to all user tests
        $location.path('public');
    }


 



    // calculate mark
    self.calculateMark = function() {
        for (let i in self.allQuestions) {

            if (parseInt(self.allQuestions[i].value) === self.allQuestions[i].answer) {

                self.totalMarks += self.allQuestions[i].mark;

            }
        }



        let testResult = {
            totalScore: self.totalMarks,
            userId: app.userId,
            testId: $localStorage.testId,
            fixedScore: self.availableMark

        };

        console.log(self.totalMarks);

        socket.emit('testResult', testResult);

    }



    // function to calculate alloted marks
    function availablemark() {
        for (let i in self.allQuestions) {
            self.availableMark += self.allQuestions[i].mark;
        }

    }


    // stop test function
    self.stopTest = function(){

    	socket.emit('stopTest',$localStorage.testId);
    	self.endbtn = false;
    }



    if ($localStorage.start) {

        self.admin = true;
        self.user = false;

        let data = {
            adminId: app.userId,
            testId: $localStorage.testId
        }
        socket.emit('start', data);

        socket.on('onlineUsers', function(usersOnline) {
        	console.log(usersOnline)
         
            self.usersOnline = usersOnline -1 ;

            $scope.$apply();
        });


        socket.on('testResult', function(data) {
            console.log(data);

            self.usersOnline = data-1;
            self.adminMessage = "TOTAL ATTENDED STUDENTS";
            
            $scope.$apply();
        });

    } else {
    	self.admin = false;
    	self.user = true;


    	 // get all questions
         $http.get('/api/livetest/' + $localStorage.testId)
            .then(res => {
                console.log(res)
                self.allQuestions = res.data.data.questions;
                self.testTitle = res.data.data.title;
                console.log(self.allQuestions)

                // get all available mark
                availablemark();

                

            })
            .catch(err => {
                console.log(err);
            });
        
        

        let data = {
            testId: $localStorage.testId,
            userId: app.userId

        }
        socket.emit('attend', data);
        
        socket.on('stopTest', function(data){
             
        	// run the calculation
        	self.calculateMark();
        	self.user = false;
        	self.summary = true;

        	$scope.$apply();

        })


        socket.on('notlive', function(data) {
            if (data) {
                
                console.log('test not started yet');
                self.notlive = true;
                self.user = false;
             
                $scope.$apply();


            } else {
            	
                self.user = true;
            }
        })


    }


}])