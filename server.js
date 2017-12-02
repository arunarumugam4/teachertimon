// dependencies
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const passport = require('passport');
const fs = require('fs');
const responseFormat = require('./customLib/responseFormat');

// initialize app and create server
const app = express();
const _server = http.createServer(app);

// define port number
const _port = process.env.PORT || 3000;


// initialize static folder
app.use(express.static(path.join(__dirname, 'public')));


// initialize mongodb database connection
require('./config/databaseConfig.js');


// initialize all app level middlewares
require('./config/middlewareConfig.js')(app);


// set jwt token secret
let jwtSecret = require('./secrets/tokenSecret')
app.set('tokenSecret', jwtSecret);




// initialize all models

// loop through all the model files and initialize the files
fs.readdirSync(path.join(__dirname, './app/models')).forEach((fileName) => {
    //make sure file is js and then initialize 
    if (fileName.indexOf('.js') !== -1) {
        require(`./app/models/${fileName}`);
    }

});


// initialize passport configuration
require('./config/passportConfig.js')(passport);




// initialize all the routes

// loop through all the controller files and initialize the files
fs.readdirSync(path.join(__dirname, './app/controllers')).forEach((fileName) => {
    //make sure file is js and then initialize 
    if (fileName.indexOf('.js') !== -1) {
        require(`./app/controllers/${fileName}`)(app, responseFormat);
    }
});



// get socket 
const io = require('socket.io').listen(_server);



// initialize socket configuration
require('./config/socketConfig')(io,app);


// initialize fall back route

app.use(function(req,res){
    let response = responseFormat(true, 'This is not a valid api, try a valid one', 400, null);
    res.status(400);
    return res.json(response);
});




// lets kick our server
_server.listen(_port, () => console.log(`\n server is waiting on port ${_port} . . . .`))