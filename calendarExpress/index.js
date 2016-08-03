/**
 * Created by bhuvanapalli on 6/30/16.
 */
var server = require("./server");
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var path = require('path');
var url = require("url");


var port = 8000;

app.use(bodyParser.json())



app.get('/hello', function(req, res) {
    console.log("hello");
    server.hello(res, req);
    //res.send("GetInfo");
});

app.get('/', function(req, res) {
    console.log("/");
    server.home(res, req);
    //res.send("GetInfo");
});

app.get('/authorize', function(req, res) {
    console.log("authorize");
    server.authorize(res, req);
    //res.send("GetInfo");
});
app.get('/getEmail', function(req, res) {
    console.log("getEmail");
    server.getEmail(res, req);
    //res.send("GetInfo");
});
app.get('/getCalendar', function(req, res) {
    console.log("getCalendar");
    server.getCalendar(res, req);
    //res.send("GetInfo");
});

app.post('/createEvent', function(req, res) {
    console.log("createEvent");
    server.createEvent(res, req);
    //res.send("GetInfo");
});


app.listen(port);

console.log("Server has started. Listening on port: " + port + "...");
