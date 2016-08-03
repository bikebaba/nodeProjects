/**
 * Created by bhuvanapalli on 6/30/16.
 */
var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
        var pathName = url.parse(request.url).pathname;
        console.log("Request for " + pathName + " received.");

        route(handle, pathName, response, request);
    }

    var port = 8000;
    http.createServer(onRequest).listen(port);
/*
    http.createServer(function(request, response) {
        var headers = request.headers;
        var method = request.method;
        var url = request.url;
        var body = [];
        request.on('error', function(err) {
            console.error(err);
        }).on('data', function(chunk) {
            body.push(chunk);
        }).on('end', function() {
            body = Buffer.concat(body).toString();
            // BEGINNING OF NEW STUFF

            response.on('error', function(err) {
                console.error(err);
            });


            request.body = body;
            onRequest(request, response);
        });
    }).listen(port);
*/
    console.log("Server has started. Listening on port: " + port + "...");
}

exports.start = start;