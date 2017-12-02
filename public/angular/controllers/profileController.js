// profile controller
app.controller('profileController', ['$http','$location', function($http,$location){
	let self = this;
	self.name = "profile";


	$http.get('/api/profile')
	 .then((res) => {
	 	// store the user id in global app object
	 	app.userId = res.data.data;
	 })
	 .catch((err) => {
       if(err){
       	console.log(err);
       	//redirect to login page
       	$location.path('/login');
       }
	 });
}])