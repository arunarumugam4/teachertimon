// dependencies
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const passport = require('passport');
const logger = require('morgan');
const flash = require('connect-flash');




// session secret
const sessionSecret = require('../secrets/sessionSecret');


// export the app level middleware configurations
module.exports = (app) => {

	// initialize all middlewares
	app.use(logger('dev'));
	app.use(bodyParser.urlencoded({extended:true}));
	app.use(bodyParser.json());
	app.use(cookieParser());
	//app.use(expressSession({ secret: sessionSecret, resave: true, saveUninitialized: false }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(flash());
}