// all available tests
app.controller('allTestController', ['$http','$cookies','$location','$localStorage', function($http,$cookies,$location,$localStorage){
    let self = this;
    self.allUserTests = null;
    self.initialLoader = true;

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


    // get all the user tests
    $http.get('/api/getusertests/'+app.userId)
     .then((res) => {
     	console.log(res);
        self.allUserTests = res.data.data.createdTests;
        self.initialLoader = false;

     })
     .catch((err)=> {
     	console.log(err);
     });


     // got to edit handler
     self.goToEdit = function(index){
        
        $localStorage.testId = self.allUserTests[index]._id;
        
        // redirect test edit page
        $location.path('createtest')
        
     }

  
  // delete test
  self.deleteTest = function(index){
     
     let testId =  self.allUserTests[index]._id;
     
     
    

      if (confirm('Are you sure you want to delete this test completly?')) {
        self.allUserTests.splice(index,1)
            $http.delete('/api/deletetest/'+testId)
      .then((res)=> {
        console.log(res);

      })
      .catch((err) => {
        console.log(err);
      })

      } else {
            // Do nothing!
        }
     
     
  }
 

  // go live handler
  self.golive = function(index){

     let testId =  self.allUserTests[index]._id;

     // storeit in local storage and redirect to live test page
     $localStorage.testId = testId;
     $localStorage.start = true;
     $location.path('/livetest');
  }


}])