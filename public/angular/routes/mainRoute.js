// main router

app.config(function($routeProvider){
	$routeProvider
      
      .otherwise({
      	redirectTo:'/'
      })

      .when('/', {
      	templateUrl:'../angular/views/home.html',
      	controller :'homeController',
      	controllerAs:'homeCtrl'
      })

      .when('/signup', {
      	templateUrl:'../angular/views/signup.html',
      	controller:'signupController',
      	controllerAs:'signupCtrl'
      })

      .when('/profile', {
            templateUrl:'../angular/views/profile.html',
            controller:'profileController',
            controllerAs:'profileCtrl'
      })

       .when('/login', {
            templateUrl:'../angular/views/login.html',
            controller:'loginController',
            controllerAs:'loginCtrl'
      })

       .when('/createtest',{
            templateUrl:'../angular/views/createTest.html',
            controller:'createTestController',
            controllerAs:'createTestCtrl'
       })

       .when('/alltest', {
            templateUrl:'../angular/views/allTest.html',
            controller:'allTestController',
            controllerAs:'allTestCtrl'
       })

       .when('/newtest', {
            templateUrl:'../angular/views/newTest.html',
            controller:'newTestController',
            controllerAs:'newTestCtrl'
       })

       .when('/publictest', {
            templateUrl:'../angular/views/publicTest.html',
            controller:'publicTestController',
            controllerAs:'publicTestCtrl'
       })

        .when('/livetest', {
            templateUrl:'../angular/views/liveTest.html',
            controller:'liveTestController',
            controllerAs:'liveTestCtrl'
       })

})