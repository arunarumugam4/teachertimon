// define angular app
const app = angular.module('myApp',['ngRoute','ngMessages','ngCookies','ngStorage']);

// socket handlers
app.socket = io("http://localhost:3000");