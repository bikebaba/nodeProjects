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

    var request = require("request");

    var options = { method: 'GET',
        url: 'http://localhost:8000/getnewtoken',
        qs: { refresh_token: 'MCZjpv6VNmQinFNnn1dXdcnLdySvFsg6JXeOPyE3gAwddtCfh6qWC6o*arwE9XCZpPNNFMCf3T1Ou7kHAeELtYogLcdcm8O3jlX4I6LUAf3u4W8l1cvLgR5yyteftduNZCjwbslOt4jXEdkHNpjwdirUHe*OdFdsHehKDy!ieEfrRD6Kg95FKw!9W3!9wT3AGP5SCurZcfxj3U2E9C6aOOd6VhtY8ZwKt!1hz*Zhq1MCJpWodDVfW*QCk82Bzv7p4HahYWMaLfHsxKywROu3cGp6gs5qdX3TeHlwkh*RLQdtuMA2vC*EmIwsgcf0mozEL*PKcm76u!vEqcss90r2CdvBzp6wXlLr9HRqHtzoqlOr7sfCt*AGxIX!JS0qK2Sjtwy*E4EceU*V2psS4rGUiPqiQv5PAyLkH2vbGgs04zb57DWqNCUDgO4yDXLrrCcqSPLoQvOTVSteJJ9ttCEARiUU$' },
        headers:
        { 'postman-token': '18762210-31cc-7954-184e-58f1adf53434',
            'cache-control': 'no-cache',
            'content-type': 'application/json' } };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log("AAAA body");
        console.log(JSON.parse(body));
        console.log("AAAA token type");
        console.log(JSON.parse(body).token_type);
        req.headers.authorization = JSON.parse(body)["access_token"];
        console.log("createEvent");
        server.createEvent(res, req);
    });



    //res.send("GetInfo");
});

app.get('/getnewtoken', function(req, res) {

    server.getNewToken(res, req);
});

app.get('/getNextGenCalendarData', function(req, res) {

    console.log("getNextGenCalendarData");
    server.getNextGenCalendarData(res, req);
});


app.listen(port);

console.log("Server has started. Listening on port: " + port + "...");
