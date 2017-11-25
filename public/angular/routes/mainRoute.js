// main router

app.config(function($routeProvider){
	$routeProvider
      
      .otherwise({
      	redirect:'/'
      })

      .when('/', {
      	templateUrl:'../angular/views/home.html',
      	controller :'homeController',
      	controllerAs:'homeCtrl'
      })

})