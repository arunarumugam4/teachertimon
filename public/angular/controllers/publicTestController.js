// all publically available tests controller
app.controller('publicTestController',['$http','$location','$cookies',function($http,$location,$cookies,){
	let self = this;
	self.name = "public test";
	self.initialLoader =true;

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


	// get publically available questions
	$http.get('/api/publictest')
	 .then(res =>{
	 	self.initialLoader =false;
	 	console.log(res);
	 	self.allPublicTests = res.data.data;
	 })
	 .catch(err => {
	 	console.log(err);
	 })
}])
