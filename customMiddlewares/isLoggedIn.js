// middleware to check user is logged in or not using passport
const responseFormat = require('../customLib/responseFormat');
const secret = require('../secrets/tokenSecret');
const jwt = require('jsonwebtoken');


// export
module.exports = (req, res, next) => {

   
     // CHECK FOR THE TOKEN IN FBTOKEN
     const fbtoken = req.cookies.fbtoken || req.body.fbtoken || req.query.fbtoken;

     // CHECK FOR THE TOKEN IN GOOGLETOKEN
     const googletoken = req.cookies.googletoken || req.body.googletoken || req.query.googletoken;

     // CHECK FOR THE TOKEN IN LOCALTOKEN
     const token = req.cookies.token || req.body.token || req.query.token;

 
        if (fbtoken) {

         // VERIFY THE TOKEN
         jwt.verify(fbtoken, secret, (err, decoded) => {

             if (err) {
                 let response = responseFormat(true, 'Authentication Failed, invalid fbtoken', 401, null);
                 return res.json(response);
             } else {
                 // SAVE THE DECODED VALUES
                 req.decoded = decoded;
          
                 return next();
             }

         })
     }else if (token){


     	  // VERIFY THE TOKEN
         jwt.verify(token, secret, (err, decoded) => {

             if (err) {
                 let response = responseFormat(true, 'Authentication Failed, invalid fbtoken', 401, null);
                 return res.json(response);
             } else {
                 // SAVE THE DECODED VALUES
                 req.decoded = decoded;
          
                 return next();
             }

         })

     }else if (googletoken){
     	  // VERIFY THE TOKEN
         jwt.verify(googletoken, secret, (err, decoded) => {

             if (err) {
                 let response = responseFormat(true, 'Authentication Failed, invalid fbtoken', 401, null);
                 return res.json(response);
             } else {
                 // SAVE THE DECODED VALUES
                 req.decoded = decoded;
          
                 return next();
             }

         })
     } else {
         // IF TOKEN NOT PRESENT
         let response = responseFormat(true, 'Your are not authenicated to use this', 403, null);
         return res.json(response);
     }

 
   


}