// new test controller
app.controller('newTestController',['$http','$localStorage','$cookies','$location', function($http,$localStorage,$cookies,$location){
	let self = this;
	self.name = "newTest";
	self.preloader = false;

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


     // create test handler
    self.createTestHandler = function() {
        self.preloader = true;

        $http.post('/api/createtest', self.data)
            .then((res) => {
                self.preloader = false;
               
                if (res.data.error) {
                    self.errorMessage = res.data.message;
                }
                self.testId = res.data.data;

                $localStorage.testId = self.testId;

                // redirect edit page
                $location.path('createtest');
            })
            .catch((err) => {
                console.log(err);
                self.preloader = false;
                self.errorMessage = "something went wrong try again later"
            })
    }



}])