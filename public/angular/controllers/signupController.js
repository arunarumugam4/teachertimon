// signup controller 
app.controller('signupController', ['$http', '$location', function($http, $location) {
    let self = this;
    self.data = {};
    self.preloader = false;
    self.errorMessage = "";

    self.signupHandler = function() {
        self.preloader = true;
        self.errorMessage = "";
        $http.post('/api/signup', self.data)
            .then((res) => {

                self.preloader = false
                console.log(res);
                if (res.data.error) {
                    self.errorMessage = res.data.message;
                } else if (!res.data.error) {
                    //redirect to the profile page
                    $location.path('/publictest');
                }

            })
            .catch((err) => {
                self.preloader = false;
                console.log(err);
            })
    }






}])