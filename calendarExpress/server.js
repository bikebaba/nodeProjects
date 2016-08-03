
var url = require("url");
var authHelper = require("./authHelper");

function hello(response, request){
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write("Hello");
    response.end();
}

function getEmail(response, request){
    var http = require("https");
    //console.log("request.headers");
    //console.log(request.headers.accesstoken);
    var options = {
        "method": "GET",
        "hostname": "outlook.office.com",
        "port": null,
        "path": "/api/v2.0/me/messages",
        "headers": {
            "content-type": "application/json",
            "authorization": "Bearer " + request.headers.accesstoken,
            "cache-control": "no-cache"
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];


        res.on("error", function (err) {
            console.log("Error");
            response.write(err);
            response.end();
        });

        res.on("data", function (chunk) {
            chunks.push(chunk);
            //console.log("chunk");
            //console.log(chunk);
        });

        res.on("end", function () {
            //console.log("chuncks[]");
            //console.log(chunks);
            var body = Buffer.concat(chunks);
            //console.log("body");
            //console.log(body.toString());

            if (body.length > 0) {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.write(body.toString());
                response.end();
            }
            else
            {
                response.writeHead(401, {"Content-Type": "application/json"});
                response.write(JSON.stringify({"Message" : "Error"}));
                response.end();

            }
        });
    });

    req.end();

}

function home(response, request) {
    console.log("Request handler 'home' was called.");
    //response.writeHead(200, {"Content-Type": "text/html"});
    //response.write('<p>Please <a href="' + authHelper.getAuthUrl() +
    //        '">sign in</a> with your Office 365 or Outlook.com account.</p>');
    //response.end();


    response.writeHead(301,
        {Location: authHelper.getAuthUrl()}
    );
    response.end();
}

function authorize(response, request) {
    console.log("Request handler 'authorize' was called.");

    // The authorization code is passed as a query parameter
    var url_parts = url.parse(request.url, true);
    var code = url_parts.query.code;
    console.log("Code: " + code);

    var token = authHelper.getTokenFromCode(code, tokenReceived, response);

}

function mail(response, request) {
    var token = getValueFromCookie('courtsCalendarToken', request.headers.cookie);
    //console.log("Token found in cookie: ", token);
    var email = getValueFromCookie('courtsCalendarEmail', request.headers.cookie);
    //console.log("Email found in cookie: ", email);
    if (token) {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('<div><h1>Your inbox</h1></div>');

        var queryParams = {
            '$select': 'Subject,ReceivedDateTime,From',
            '$orderby': 'ReceivedDateTime desc',
            '$top': 10
        };

        // Set the API endpoint to use the v2.0 endpoint
        outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
        // Set the anchor mailbox to the user's SMTP address
        outlook.base.setAnchorMailbox(email);
        console.log("token********");
        console.log(token);
        outlook.mail.getMessages({token: token, odataParams: queryParams},
            function(error, result){
                if (error) {
                    console.log('getMessages returned an error: ' + error);
                    response.write("<p>ERROR: " + error + "</p>");
                    response.end();
                }
                else if (result) {
                    console.log('getMessages returned ' + result.value.length + ' messages.');
                    response.write('<table><tr><th>From</th><th>Subject</th><th>Received</th></tr>');
                    result.value.forEach(function(message) {
                        console.log('  Subject: ' + message.Subject);
                        var from = message.From ? message.From.EmailAddress.Name : "NONE";
                        response.write('<tr><td>' + from +
                            '</td><td>' + message.Subject +
                            '</td><td>' + message.ReceivedDateTime.toString() + '</td></tr>');
                    });

                    response.write('</table>');
                    response.end();
                }
            });
    }
    else {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('<p> No token found in cookie!</p>');
        response.end();
    }
}

function getCalendar(response, request){

    var token = getValueFromCookie('courtsCalendarToken', request.headers.cookie);
    console.log("Token found in cookie: ", token);
    var email = getValueFromCookie('courtsCalendarEmail', request.headers.cookie);
    console.log("Email found in cookie: ", email);
    if (token) {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('<div><h1>Your calendar</h1></div>');

        var queryParams = {
            '$select': 'Subject,Start,End',
            '$orderby': 'Start/DateTime desc',
            '$top': 10
        };

// Set the API endpoint to use the v2.0 endpoint
        outlook.base.setApiEndpoint('https://outlook.office.com/api/v2.0');
// Set the anchor mailbox to the user's SMTP address
        outlook.base.setAnchorMailbox(email);
// Set the preferred time zone.
// The API will return event date/times in this time zone.
        outlook.base.setPreferredTimeZone('Eastern Standard Time');

        outlook.calendar.getEvents({token: token, odataParams: queryParams},
            function(error, result){
                if (error) {
                    console.log('getEvents1 returned an error: ' + error);
                    response.write("<p>ERROR: " + error + "</p>");
                    response.end();
                }
                else if (result) {
                    //console.log('getEvents returned ' + result.value.length + ' events.');

                    console.log(result);
                    response.write(JSON.stringify(result, undefined, 4));
                    response.end();
                    /*response.write('<table><tr><th>Subject</th><th>Start</th><th>End</th></tr>');
                     result.value.forEach(function(event) {
                     console.log('  Subject: ' + event.Subject);
                     response.write('<tr><td>' + event.Subject +
                     '</td><td>' + event.Start.DateTime.toString() +
                     '</td><td>' + event.End.DateTime.toString() + '</td></tr>');
                     });

                     response.write('</table>');
                     response.end();
                     */
                }
            });
    }
    else {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('<p> No token found in cookie!</p>');
        response.end();
    }
}

function createEvent(response, request){
    var http = require("https");

    var options = {
        "method": "POST",
        "hostname": "outlook.office.com",
        "port": null,
        "path": "/api/v2.0/me/events",
        "headers": {
            "content-type": "application/json",
            "authorization": "Bearer " + request.headers.Authorization
        }
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.write(JSON.stringify({ Subject: 'Discuss the Calendar REST API',
        Body:
        { ContentType: 'HTML',
            Content: 'I think it will meet our requirements!' },
        Start:
        { DateTime: '2016-07-19T10:00:00',
            TimeZone: 'Pacific Standard Time' },
        End:
        { DateTime: '2016-07-19T11:00:00',
            TimeZone: 'Pacific Standard Time' },
        Attendees:
            [ { EmailAddress: { Address: 'shiv_bhuvanapalli@ao.uscourts.gov', Name: 'Shiv Bhuvanapalli' },
                Type: 'Required' } ] }));
    req.end();
}


function getValueFromCookie(valueName, cookie) {
    console.log("valueName");
    console.log(valueName);
    console.log("cookie");
    console.log(cookie);
    if (cookie.indexOf(valueName) !== -1) {
        var start = cookie.indexOf(valueName) + valueName.length + 1;
        var end = cookie.indexOf(';', start);
        end = end === -1 ? cookie.length : end;
        return cookie.substring(start, end);
    }
}

function tokenReceived(response, error, token) {
    if (error) {
        console.log("Access token error: ", error.message);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('<p>ERROR: ' + error + '</p>');
        response.end();
    }
    else {
        //var cookies = ['courtsCalendarToken=' + token.token.access_token + ';Max-Age=3600',
        //    'courtsCalendarEmail=' + authHelper.getEmailFromIdToken(token.token.id_token) + ';Max-Age=3600'];
        //response.setHeader('Set-Cookie', cookies);
        response.writeHead(200, {"Content-Type": "text/html"});
        //response.write('<p>Access token saved in cookie.</p>');
        response.write(JSON.stringify(token));
        response.end();
    }
}


exports.tokenReceived = tokenReceived;
exports.getValueFromCookie = getValueFromCookie;
exports.createEvent = createEvent;
exports.getCalendar = getCalendar;
exports.mail = mail;
exports.authorize = authorize;
exports.home = home;
exports.getEmail = getEmail;
exports.hello = hello;