var express = require('express'),
        connect = require('connect'),
        auth = require('./auth');
config = require('./config.json');
var mongoLog = require('./mongoose');
var http = require('http');
var querystring = require('querystring');
xmlparser = require('express-xml-bodyparser');
var util = require('util');
authHelper = require("./authHelper");
var app = express();
url = require("url");
outlook = require("node-outlook");
var multer = require('multer');
var cb = require('cb');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

var aws = require('aws-sdk');
aws.config.loadFromPath('../gp-config.json');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var storagePath = __dirname + '/tmpFiles';
        cb(null, storagePath)
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({'storage': storage}).single('file');

//mongoLog.insertMDB({"type":"FeatureCollection","features":[{"type":"Feature","properties":{"name":"Shiv Bhuvanapalli","id":"4N19-A"},"geometry":{"type":"Polygon","coordinates":[[[-71.9384765625,78.07107600956168],[-71.9384765625,80.19369416640632],[-63.45703124999999,80.19369416640632],[-63.45703124999999,78.07107600956168],[-71.9384765625,78.07107600956168]]]}},{"type":"Feature","properties":{"name":"Bob Testman","id":"4N19-B"},"geometry":{"type":"Polygon","coordinates":[[[-71.5869140625,76.45520341078415],[-71.5869140625,78.02557363284087],[-63.45703124999999,78.02557363284087],[-63.45703124999999,76.45520341078415],[-71.5869140625,76.45520341078415]]]}},{"type":"Feature","properties":{"name":"Steve Jobs","id":"4N19-C"},"geometry":{"type":"Polygon","coordinates":[[[-71.7626953125,74.66001636880338],[-71.7626953125,76.45520341078415],[-63.4130859375,76.45520341078415],[-63.4130859375,74.66001636880338],[-71.7626953125,74.66001636880338]]]}},{"type":"Feature","properties":{"name":"Bill Gates","id":"4N19-D"},"geometry":{"type":"Polygon","coordinates":[[[-71.279296875,72.64648585149378],[-71.279296875,74.64838650735716],[-63.45703124999999,74.64838650735716],[-63.45703124999999,72.64648585149378],[-71.279296875,72.64648585149378]]]}},{"type":"Feature","properties":{"name":"Frank West","id":"4N19-E"},"geometry":{"type":"Polygon","coordinates":[[[-71.4111328125,70.48089578887483],[-71.4111328125,72.62025182357989],[-63.4130859375,72.62025182357989],[-63.4130859375,70.48089578887483],[-71.4111328125,70.48089578887483]]]}},{"type":"Feature","properties":{"name":"Solaire of Astora","id":"4N19-F"},"geometry":{"type":"Polygon","coordinates":[[[-63.5009765625,71.21607526596131],[-63.5009765625,74.67163763123041],[-54.7998046875,74.67163763123041],[-54.7998046875,71.21607526596131],[-63.5009765625,71.21607526596131]]]}},{"type":"Feature","properties":{"name":"Rebecca Chambers","id":"4N19-G"},"geometry":{"type":"Polygon","coordinates":[[[-63.369140625,74.69485438254536],[-63.369140625,76.47577254009317],[-54.88769531249999,76.47577254009317],[-54.88769531249999,74.69485438254536],[-63.369140625,74.69485438254536]]]}},{"type":"Feature","properties":{"name":"Matt Arnold","id":"4N19-H"},"geometry":{"type":"Polygon","coordinates":[[[-63.32519531249999,76.50656876964399],[-63.32519531249999,78.02557363284087],[-54.7998046875,78.02557363284087],[-54.7998046875,76.50656876964399],[-63.32519531249999,76.50656876964399]]]}},{"type":"Feature","properties":{"name":"Arthur Pendragon","id":"4N19-I"},"geometry":{"type":"Polygon","coordinates":[[[-63.1494140625,78.07107600956168],[-63.1494140625,79.37580587107902],[-54.9755859375,79.37580587107902],[-54.9755859375,78.07107600956168],[-63.1494140625,78.07107600956168]]]}},{"type":"Feature","properties":{"name":"Bootsy Collins","id":"4N19-J"},"geometry":{"type":"Polygon","coordinates":[[[-63.28125,79.40008452319316],[-63.28125,80.61842419685506],[-54.7998046875,80.61842419685506],[-54.7998046875,79.40008452319316],[-63.28125,79.40008452319316]]]}}]});

app.use(express.urlencoded());
app.use(xmlparser());

app.configure(function() {
    app.use(express.logger());
    app.use(connect.compress());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({secret: "won't tell because it's secret"}));
    app.use(auth.initialize());
    app.use(auth.session());
});
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization, email');
    next();
});
app.get('/', function(req, res) {
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&111111&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    console.log("I just opened the browser");
    console.log(req.query);
    console.log(req.sessionID);
    var js = {"sessionID": req.sessionID, "uuid": req.query.uuid};
    console.log("req.query in  /");
    console.log(req.query);
    mongoLog.deleteAndInsertToken(js, res);
    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    //res.redirect(authHelper.getAuthUrl());
    //res.send({"AuthUrl": authHelper.getAuthUrl()});


});
var Logger = require('bunyan');
var rightNow = new Date();
aToday = rightNow.toISOString().slice(0, 10).replace(/-/g, "");
console.log(aToday);
var aPath = "../logs/" + aToday + "gpapplogging.log";

var applogger = new Logger({
    name: 'GP Mobile API',
    streams: [
        {
            level: "info",
            //path: "C:\Projects\\github\\applogging.log"
            path: aPath
                    //path: "s3.amazonaws.com/TWP-SHIV-IT//applogging.log"
        }
    ]
});
// simple logger

app.get('/authorize', function(req, res) {
    console.log("Request handler 'authorize' was called.");

    applogger.info("authorize", req.headers);
    // The authorization code is passed as a query parameter
    churl = "http://localhost:80" + req.url;

    //console.log("churl   " + churl);
    var url_parts = url.parse(churl, true);
    var code = url_parts.query.code;
    //console.log("Code: " + code);

    if (code && code !== "") {
        var result = authHelper.getTokenFromCode(code, "https://outlook.office365.com", res, req);
        console.log("***************result***************");
        console.log(result);
        //console.log("res:    " + util.inspect(res, false, null));
    }
    else {
        console.log("Bad code.");
    }
});
app.get('/hello', function(req, res) {

    res.end("Hello World!");
});


app.get('/gpSearchForSlack', function(req, res) {
    console.log(req.query);

    applogger.info("gpSearchForSlack", req.headers);
    applogger.info("gpSearchForSlack", req.query);
    if (req.query.text) {
        strsplit = require('strsplit');

        ls = strsplit(req.query.text, /\s+/, 3);

        console.log(ls);

        req.query.term = ls[2];

        returnString = [];
        j = 0;
        if(ls[0].toUpperCase() == 'WHO' || ls[0].toUpperCase() == 'WHERE') {
            //returnString = ;
            mongoLog.getEmpForSlack(req.query, function (cursor) {
                if (cursor) {
                    //console.log(cursor[0].properties);
                    for (var i = 0; i <= cursor.length - 1; i++) {
                        //console.log("Thisis");
                        returnString[j] = {};
                        if (ls[0].toUpperCase() == 'WHO') {
                            returnString[j]["text"] = "\n Name: " + cursor[i].properties.Name;
                            returnString[j]["text"] = returnString[j]["text"] + "\n Phone: " + cursor[i].properties.telephoneNumber;
                            returnString[j]["text"] = returnString[j]["text"] + "  Seat: " + cursor[i].properties.seat;
                            returnString[j]["text"] = returnString[j]["text"] + "\n Department: " + cursor[i].properties.department;
                            returnString[j]["text"] = returnString[j]["text"] + "  Title: " + cursor[i].properties.title;
                            returnString[j]["thumb_url"] = "https://guidepost.washpost.com/photoDropBox/thumbs/thumbnail." + cursor[i].properties.Employee_ID + ".JPG";
                        }
                        else {
                            returnString[j]["text"] = "\n Name: " + cursor[i].properties.Name;
                            returnString[j]["text"] = returnString[j]["text"] + "  Seat: " + cursor[i].properties.seat;}
                        j++;
                        console.log("This 1");
                    }

                    mongoLog.getConfForSlack(req.query, function (cursor2) {
                        cursor2.toArray(function(err, docs) {


                            if (docs) {
                                console.log(docs[0]);
                                for (var i = 0; i <= docs.length - 1; i++) {
                                    returnString[j] = {};
                                    returnString[j]["text"] = "\n Name: " + docs[i].Name;
                                    returnString[j]["text"] = returnString[j]["text"] + "\n Address: " + docs[i].Address;
                                    returnString[j]["text"] = returnString[j]["text"] + "\n Capacity: " + docs[i].Capacity;
                                    returnString[j]["text"] = returnString[j]["text"] + "\n Type: " + docs[i].Type;
                                    j++;
                                    console.log("This 2");
                                }
                                res.send(
                                    {   "text": "You searched for " + req.query.text,
                                        "attachments": returnString
                                    }
                                );
                                //res.send(returnString);
                            }

                        });

                    });

                    //res.send(returnString);
                }
            });
        }
        //else if (ls[0].toUpperCase() == 'WHERE'){{
            //returnString = "You searched for " + req.query.text;
        //    console.log(req.query);

        //}}
        else {res.send("No Idea What you want!");}
    console.log(returnString);


    }
    else {
        res.end("Nothing in it");
    }
    //res.end("Hello World!");

});

app.post('/login/callback', auth.authenticate('saml', {failureRedirect: '/', failureFlash: true}), function(req, res) {
    var ls = "http://" + config.auth.redirectSite + ":" + config.auth.port;
    ls = '/';
    //ls = 'http://localhost:8100/#/mainHeader/mainMenu';
    //console.log(config.auth.redirectSite);
    //console.log(config.auth.port);
    //console.log(ls);
    //console.log("res   " + res.header);
    //console.log("QQQQ");
    res.redirect(ls);
});
app.get('/login', auth.authenticate('saml', {failureRedirect: '/', failureFlash: true}), function(req, res) {
    applogger.info("login", req.headers);
    res.redirect('/');
});


app.get('/getToken', function(req, res) {
    applogger.info("getToken", req.headers);
    console.log("About to INsert into gp Logs");
    mongoLog.insertIntoMongo(req.headers, "GpAppLogs");
    mongoLog.getToken(req.query["uuid"], function(cursor) {

        res.send(cursor);
    });

});
app.get('/deleteToken', function(req, res) {
    mongoLog.deleteToken(req.query["uuid"], function(cursor) {
        res.send(cursor);
    });
});

app.get('/getversion', function(req, res) {
    mongoLog.getVersion(function(cursor) {
        res.send(cursor[0]);
    });
});

app.post('/setversion', function(req, res) {
    mongoLog.setVersion(req.body);
    res.send({"Message": "Success"});
});

/*
app.post('/insertToken', function(req, res) {
    mongoLog.insertToken(req.body);
    res.send({"Message": "Success"});
});

*/
app.get('/getnewtoken', function(req, res) {

    var request = require("request");
    var clientId = require("./clientId");
    console.log("IN getnewtoken");
    var options = {method: 'POST',
        url: 'https://login.microsoftonline.com/common/oauth2/token',
        form:
                {grant_type: 'refresh_token',
                    //refresh_token: 'AAABAAAAiL9Kn2Z27UubvWFPbm0gLYrVyYqIHJkS-Aq8MnoCdMJQkLyFJRDXOuz-M98HfUATtVAwBO2AG40xZXBrb7jcS1Bq2ZmQoVc-IHtWcJ7TQlrcWqojPwHuKMKrYlE7S3xqZT9x8-LZQ2QxNrcg5ZW5c9Vly1H_4sIYvkVjd8nNBkE7lC8vI89LnhOi44_P-4y-ZBPuAsr8zgccD6bABQQvRAauEE6L_kkuiWw-U-JfwsSTC_CltdyNINbPO7L-uIzJMaj-0Tblt_3kcmMELaaOXjlOf-1xZ8y9NnQRD2ugxZOsrRpo0BopftaxJNl6Aeac9ZQPFvyZK3jNcs5I6rQsZzokjsahRX_uyXqntfqm8ftGaufp2GOa9QD2XdHK8WmJsniUOlFIpWLdAhZv5tHJMAJSZ61fkNRrcf_ayiSp_Ud5rSdW5QBGlmgeYgs8DS-mN-ZpkHi8gqKx_ZRsGNUQnaade3d3u5_T-t71pxZ093uSCwwTeRsAixA0vIxPgj4QMs1aqIghij8ZrYuzo0LkW9nKBYsedIm5FXN1ugr1cDz1OhoJfk220y55-Jhdb55jc4iwDZPzImlfOhivIaKi5MRTUzRuD9lZUMzo69aXvecgAA',
                    refresh_token: req.query.refresh_token,
                    client_id: clientId.clientId, //'0aca55fd-3cd9-40a6-aa78-ae6fcd1ab359',
                    client_secret: clientId.clientSecret //'F7dKfSa372ryjyskvxbQS4C9FAJVBNnfRIHwdOQLd2w=' 
                }};

    console.log("Req:   " + util.inspect(req.headers["x-forwarded-for"], false, null));
    //console.log("Res:   " + JSON.stringify(res));
    request(options, function(error, response, body) {
        if (error)
            throw new Error(error);

        res.send(body);
    });

});


app.post('/updateGeoJSON', function(req, res) {
    console.log(req.query);
    mongoLog.updateGeoJSON(req.body, req.query.id);
    res.send({"Message": "Success"});
});
app.post('/deleteGeoJSON', function(req, res) {
    console.log(req.query);
    mongoLog.deleteGeoJSON(req.query.id);
    res.send({"Message": "Success"});
});
app.post('/addGeoJSON', function(req, res) {
    console.log(req.body);
    mongoLog.addGeoJSON(req.body);

    res.send({"Message": "Success"});
});
app.get('/getAllGeoJSON', function(req, res) {
    mongoLog.getAllGeoJSON(function(cursor) {
        cursor.toArray(function(err, docs) {
            console.log("retrieved records:");
            //console.log(docs);
            res.send(docs);
        });
    });
});

app.post('/publishMessagetoAndroid', function(req, res) {
    //console.log(req.body.message);

   //console.log(mess1);
    //mess1 = message.toString();
    //console.log(JSON.stringify(req.body.message));
    var sns = new aws.SNS();
    var aToken;
    var params = {
        PlatformApplicationArn: config.SNS.PlatformApplicationArnAndroid
    };

    mess = JSON.stringify({ message: { GCM: '{ "data": { "message": "' + req.body.message + '", "title":"Notification" }, "notification": {"body": "", "title":"" } }' } });

    publishToTarget(aToken, params, sns, mess, res, function(data) {
        console.log("Start");
    })
    //res.send({"Message": "The message is being sent."});
});

function publishToTarget(aToken, params, sns, mess, res, func){


    params.NextToken = aToken;
    var pubparams = {
        //Message: mess1,
        Message: mess,
        TargetArn: "",
        MessageStructure: "json"
    };
    TargetArnArray = [];
    //do {

    sns.listEndpointsByPlatformApplication(params, function (err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {
            // console.log("listEndpointsByPlatformApplicationlistEndpointsByPlatformApplicationlistEndpointsByPlatformApplicationlistEndpointsByPlatformApplication");

            TargetArnArray = data.Endpoints;
            console.log("data.NextToken");
            console.log(data.NextToken);
            aToken = data.NextToken;
            console.log("TargetArnArray.length");
            console.log(TargetArnArray.length);

            //console.log("TargetArnArray");
            //console.log(TargetArnArray);
            for (var i = 0; i <= TargetArnArray.length - 1; i++) {
                pubparams.TargetArn = TargetArnArray[i].EndpointArn;
                if (TargetArnArray[i].Attributes.Enabled === 'true') {
                    sns.publish(pubparams, function(err, data) {
                     //console.log("pubparams");
                     //console.log(pubparams);
                     if (err)
                     console.log(err, err.stack); // an error occurred
                     else
                     console.log(data);           // successful response
                     });
                }
            }

            if(aToken)
            {publishToTarget(aToken, params, sns, mess, res, function(data) {
                console.log("XXX");
            })}
            else {console.log("Done");res.send({"Message": "The message is being sent."});};

        }

    });

    //}
    //while (nToken);

}


app.post('/listofIOS', function(req, res) {
    //console.log(req.body);
    var sns = new aws.SNS();
    var pubparams = {
        Message: req.body.message,
        TargetArn: ""
    };
    TargetArnArray = [];
    var params = {
        PlatformApplicationArn: config.SNS.PlatformApplicationArnIOS//, /* required */
        //NextToken: 'STRING_VALUE'
      };
      sns.listEndpointsByPlatformApplication(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else {    
            //console.log("listEndpointsByPlatformApplicationlistEndpointsByPlatformApplicationlistEndpointsByPlatformApplicationlistEndpointsByPlatformApplication");
            
            TargetArnArray = data.Endpoints;    
            //console.log("TargetArnArray");   
            //console.log(TargetArnArray);
            for (var i = 0; i <= TargetArnArray.length - 1; i++) {
                pubparams.TargetArn = TargetArnArray[i].EndpointArn;
                //console.log("pubparams.TargetArn");
                //console.log(pubparams);
                ls = TargetArnArray[i].Attributes.Enabled;
                //console.log(ls);
                //console.log(TargetArnArray[i].Attributes.Enabled);
                if (TargetArnArray[i].Attributes.Enabled === 'true'){  
                        //console.log("*******");   
                        console.log(JSON.parse(TargetArnArray[i].Attributes.CustomUserData).email);
                    
                }
            }
          }  
        
      });

    res.send({"Message": "The message is being sent."});
});

app.post('/publishMessagetoIOS', function(req, res) {
    //console.log(req.body);
    var sns = new aws.SNS();
    var params = {
        PlatformApplicationArn: config.SNS.PlatformApplicationArnIOS//, /* required */
        //NextToken: 'STRING_VALUE'
      };


    var aToken;
    //mess = JSON.stringify({message : });


    mess = JSON.stringify({
                    default: req.body.message,
                APNS_SANDBOX: JSON.stringify({aps:{alert:req.body.message}})
            });
    publishToTarget(aToken, params, sns, mess, res, function(data) {
        console.log("Start");
    })
});

app.post('/logdeviceid', function(req, res) {
    applogger.info("DeviceId", req.headers);
    var aBody = req.body;
    console.log(aBody);
    var sns = new aws.SNS();
    
    var params = {
        PlatformApplicationArn: '', /* required */
        Token: 'STRING_VALUE', /* required */
        //Attributes: {
        //  someKey: 'STRING_VALUE'
        //},
        CustomUserData: 'user data'
    };
    if (aBody.deviceType === 'IOS') {
        params.PlatformApplicationArn = config.SNS.PlatformApplicationArnIOS;
        params.Token = aBody.deviceToken;
        //aBody.email = "Shiv.Bhuvanapalli@washpost.com";
        params.CustomUserData = "{\"email\" : \"" + aBody.email +  "\"}";
    }
    else {
        params.PlatformApplicationArn = config.SNS.PlatformApplicationArnAndroid;
        params.Token = aBody.deviceToken;
    }
    console.log("SNSSNSSNSSNSSNSSNSSNSSNSSNSSNSSNSSNSSNSSNSSNSSNS");
    console.log(params);
    sns.createPlatformEndpoint(params, function(err, data) {
        if (err)
            console.log(err, err.stack); // an error occurred
        else
            console.log(data);           // successful response
    });

    mongoLog.getDeviceInfo(aBody["deviceToken"], function(cursor) {
        console.log(cursor);
        if (cursor.length === 0) {
            mongoLog.insertIntoMongo(aBody, "DeviceId");
        }
        //else {
        //    mongoLog.updateMongoCollection(cursor[0], cursor[0]._id, "DeviceId");
        //}
    });
    //mongoLog.insertIntoMongo(req.body, "DeviceId");

    res.send({"Message": "Success"});
});

app.post('/putTeachAClass', function(req, res) {
    applogger.info("putTeachAClass", req.headers);
    console.log(req.body);
    mongoLog.insertIntoMongo(req.body, "TeachAClass");

    res.send({"Message": "Success"});
});
app.get('/getTeachAClass', function(req, res) {
    console.log("In Teach a Class");
    mongoLog.getFromMongo("TeachAClass", function(cursor) {
        myDate = new Date();
        var myjson = {"MyDate": myDate};
        console.log(myjson);
        cursor.toArray(function(err, docs) {
            console.log("retrieved records:");
            //console.log(docs);
            res.send(docs);
        });
    });
});
app.post('/updateTeachAClass', function(req, res) {
    console.log(req.query);
    console.log(req.body);
    mongoLog.updateMongoCollection(req.body, req.query.id, "TeachAClass");
    res.send({"Message": "Success"});
});


app.put('/addProfilePic', function(req, res) {
    applogger.info("addProfilePic", req.headers);
    var ID = req.body.employeeId;
    var Email = req.body.employeeEmail;
    upload(req, res, function(err) {
        if (err) {
            console.log('multer error');
            return;
        }
        var file = req.files.file;
        console.log(file);
        var path = file.path;
        var body = fs.createReadStream(path);
        aws.config.loadFromPath('../gp-config.json');
        var s3 = new aws.S3();
        var S3_BUCKET = config.photos["gp-emp-pics"];
        var s3_params = {
            Bucket: S3_BUCKET,
            Key: file.originalFilename,
            Body: body,
            CacheControl: "private",
            ACL: 'public-read'
        };
        s3.putObject(s3_params, function(err, data) {
            if (err) {
                console.log(err);
                res.status(500).send('problem occured');
            }
            else {
                        // 	
                //https://s3.amazonaws.com/twp-gp-emp-pics/profilePhoto000003582.jpg
                var url = 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + file.originalFilename;
                console.log("url");
                console.log(url);
                var userObject = {'ID': ID, 'URL': url, 'Email': Email};
                var test = mongoLog.getEmpProfilePicsFromID(ID, function(response) {
                    console.log("response");
                    console.log(response);
                    if (response[0] === undefined) {
                        
                        console.log("Made it to Insert");
                        console.log(userObject);
                        mongoLog.insertIntoEmpProfilePics(userObject);
                    }
                    var filename = path.replace(/^.*[\\\/]/, '');
                    exec('cd /tmp && rm ' + filename, function(error, stdout, stdin) {
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                        else {
                            console.log('deleted');
                        }
                    });
                    res.status(200).send(url);
                })
            }
        });
    });
});

app.put('/kudoPhoto', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.log('multer error');
            return;
        }
        var file = req.files.file;
        console.log(file);
        var path = file.path;
        var body = fs.createReadStream(path);
        aws.config.loadFromPath('../gp-config.json');
        var s3 = new aws.S3();
        var S3_BUCKET = config.photos["gp-kudos-pics"];
        var s3_params = {
            Bucket: S3_BUCKET,
            Key: file.originalFilename,
            Body: body,
            ACL: 'public-read'
        };
        s3.putObject
                (s3_params, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('problem occured');
                    } else {
                        var url = 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + file.originalFilename;
                        var filename = path.replace(/^.*[\\\/]/, '');
                        exec('cd /tmp && rm ' + filename, function(error, stdout, stdin) {
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                            else {
                                console.log('deleted');
                            }
                        });
                        res.status(200).send(url);
                    }
                });

    })

});
/*****************************************************************************/
app.post('/postKudos', function(req, res) {
    applogger.info("postKudos", req.headers);
    kudos = req.body;
    //console.log(kudos);
    //console.log(kudos.description);
    //console.log(kudos.kudosPeople.length);
    mongoLog.insertIntoMongo(req.body, "kudos");
    
    var nodemailer = require("nodemailer");
    
    var smtpTransport = nodemailer.createTransport("SMTP",{
       service: "gmail",
       auth: {
           user: "guidepost.mobile",
           pass: "mobileguidepost"
       }
    });
    
    //smtpTransport.use('compile', htmlToText());

    var desc = kudos.description;
    console.log(desc);
    //kudospeople = [];
    for (var i = 0; i <= kudos.kudosPeople.length - 1; i++) {
        console.log(kudos.kudosPeople[i].properties.email);
        if (kudos.kudosPeople[i] && kudos.giverName)
        {
            
            options = {
               from: "Guidepost <guidepost.mobile@gmail.com>", // sender address
               to: kudos.kudosPeople[i].properties.email, // comma separated list of receivers
               subject: "You Have a Kudos✔ from " + kudos.giverName // Subject line
               //replyTo : kudos.giverEmail,
               //text: desc // plaintext body
               //text: "Hello world222!",
               
            };
            
            if (kudos.imageUrl){
                options.html = desc + "<br><br><br><img src='cid:unique@node.ee' />";
                options.attachments = [{
                    filename: "8.jpg",
                    filePath: kudos.imageUrl,
                    cid: "unique@node.ee" //same cid value as in the html img src
                }];
                options.generateTextFromHTML = true;
            } 
            else {options.text = desc;}
            
            smtpTransport.sendMail(options, function(error, response){
               if(error){
                   console.log(error);
               }else{
                   console.log("Message sent: " + response.message);
               }
            });
        }
    }

    

    res.send({"Message": "Success"});
});


app.post('/postKudos2', function(req, res) {
    applogger.info("postKudos", req.headers);
    kudos = req.body;
    //console.log(kudos);
    //console.log(kudos.description);
    //console.log(kudos.kudosPeople.length);
    mongoLog.insertIntoMongo(req.body, "kudos");
    
    var nodemailer = require("nodemailer");
    var sesTransport = require('nodemailer-ses-transport');
    var ses = new aws.SES();
    
    var transport = nodemailer.createTransport(sesTransport({
        ses: ses
    }));
    
    console.log(transport.transportType);
    /*
    var smtpTransport = nodemailer.createTransport("SMTP",{
       service: "gmail",
       auth: {
           user: "guidepost.mobile",
           pass: "mobileguidepost"
       }
    });
    */
   
   var smtpTransport = nodemailer.createTransport("SMTP",{
       service: "email-smtp.us-east-1.amazonaws.com",
       port: 25,
       auth: {
           user: "AKIAIBO5ODLD3ZAP43KQ",
           pass: "AqSGE1DMlErM/2z96s55ZIRehpNiyg1TC7Oq7Wdp6Ej8"
       }
    });
    //smtpTransport.use('compile', htmlToText());

    var desc = kudos.description;
    console.log("AAAAAAAAAAA");
    //kudospeople = [];
    for (var i = 0; i <= kudos.kudosPeople.length - 1; i++) {
        console.log(kudos.kudosPeople[i].properties.email);
        if (kudos.kudosPeople[i] && kudos.giverName)
        {
            options = {
               //from: "donotreply@washpost.com", // sender address
               to: kudos.kudosPeople[i].properties.email, // comma separated list of receivers
               subject: "You Have a Kudos✔ from " + kudos.giverName // Subject line
               //replyTo : kudos.giverEmail,
               //text: desc // plaintext body
               //text: "Hello world222!",
               
            };
            
            if (kudos.imageUrl){
                options.html = desc + "<br><br><br><img src='cid:unique@node.ee' />";
                options.attachments = [{
                    filename: "8.jpg",
                    filePath: kudos.imageUrl,
                    cid: "unique@node.ee" //same cid value as in the html img src
                }];
                options.generateTextFromHTML = true;
            } 
            else {options.text = desc;}
            
            transport.sendMail(options, function(error, response){
               if(error){
                   console.log(error);
               }else{
                   console.log("Message sent: " + response.message);
               }
            });
        }
    }

    

    res.send({"Message": "Success"});
});

app.get('/getKudos', function(req, res) {
    mongoLog.getFromMongo("kudos", function(cursor) {
    console.log(cursor);
        cursor.toArray(function(err, docs) {
            console.log("retrieved records:");
            //console.log(docs);
            res.send(docs);
        });
    });
});
app.post('/updateKudos', function(req, res) {
    console.log(req.query);
    console.log(req.body);
    mongoLog.updateMongoCollection(req.body, req.query.id, "kudos");
    res.send({"Message": "Success"});
});

app.post('/addCommentToKudo', function(req, res) {
    console.log("req.body");
    console.log(req.body);
    mongoLog.addCommentToKudo(req.body, req.query["id"]);

    res.send({"Message": "Success"});
});

app.get('/getCountOnKudoComments', function(req, res) {

    mongoLog.getCountOnKudoComments(req.query["id"], function(cursor) {
        console.log(cursor);
        res.send({"NumberOfComments" : cursor});
    });

    //res.send({"Message": "Success"});
});

app.post('/addLikeToKudo', function(req, res) {
    console.log("req.body");
    //console.log(req.body);
    mongoLog.addLikeToKudo(req.body, req.query["id"]);

    res.send({"Message": "Success"});
});
app.get('/getCountOnKudoLikes', function(req, res) {

    mongoLog.getCountOnKudoLikes(req.query["id"], function(cursor) {
            console.log(cursor);
            res.send({"NumberOfLikes" : cursor});
        });

    //res.send({"Message": "Success"});
});


/*****************************************************************************/
app.post('/addAllGeoJSON', function(req, res) {
    console.log(req.body);
    mongoLog.addAllGeoJSON(req.body);

    res.send({"Message": "Success"});
});


app.get('/getGeoJSONforFloor', function(req, res) {
    mongoLog.getGeoJSONforFloor(req.query["floor"], function(cursor) {
        res.send(cursor);
    });
});
app.get('/getGeoJSONforSeat', function(req, res) {
    applogger.info("getGeoJSONforSeat", req.headers);
    console.log("----  getGeoJSONforSeat Headers -------------------------");
    console.log(req.headers);
    if (req.query) {
        applogger.info("ldapsearch", req.query);
    }
    mongoLog.getGeoJSONforSeat(req.query["seat"], function(cursor) {
        res.send(cursor);
    });
});

app.get('/loaderio-a26cead6b048bb8b4cbcb1ced6f62e7f', function(req, res) {
    res.send("loaderio-a26cead6b048bb8b4cbcb1ced6f62e7f");
});

/*****************************************************************************/
app.get('/ldapsearch', function(req, res) {
    applogger.info("ldapsearch", req.headers);
    console.log("----   Headers -------------------------");
    console.log(req.headers);
    if (req.query) {
        applogger.info("ldapsearch", req.query);
    }
    mongoLog.getListofEmployees(req.query, function(cursor) {
        if (cursor) {
            console.log("cursor");
            res.send(cursor);
        }
        else
            res.send({"Message": "No Data"});
    });
});
app.get('/getListofConfRooms', function(req, res) {
    applogger.info("getlistofconfRooms", req.headers);
    mongoLog.getListofConfRooms(req.query, function(cursor) {
        cursor.toArray(function(err, docs) {
            console.log("retrieved records:");
            //console.log(docs);
            res.send(docs);
        });
    });
});
app.get('/getProfileInfoforEmployee', function(req, res) {
    mongoLog.getProfileInfoforEmployee(req.query["empID"], function(cursor) {
        res.send(cursor);
    });
});

/*****************************************************************************/
app.get('/getEmployeeforSeat', function(req, res) {
    mongoLog.getEmployeeforSeat(req.query["seat"], function(cursor) {
        res.send(cursor);
    });
});
app.get('/getEmployeeFromEmail', function(req, res) {
    mongoLog.getEmployeeFromEmail(req.query["email"], function(cursor) {
        res.send(cursor);
    });
});
app.get('/getEmployeePic', function(req, res) {
    console.log(req.query.empID);
    var URL = "https://guidepost.washpost.com/photoDropBox/thumbs/thumbnail." +
            req.query.empID + ".JPG";
    mongoLog.getEmpProfilePicsFromID(req.query["empID"], function(cursor) {
        if (cursor[0]) {
            res.redirect(cursor[0].URL);
        }
        else {
            res.redirect(URL);
        }
        ;
    });

    //res.redirect(URL);
});

//

app.post('/getavailability', function(request, response) {


    applogger.info("getavailability", request.headers);
    var parseString = require('xml2js').parseString;
    var util = require('util');
    console.log("Request handler 'getavailability' was called.");

    //console.log("Authorization: " + util.inspect(request.headers.authorization, false, null));
    console.log("Body: " + util.inspect(request.rawBody, false, null));
    Oxml = request.rawBody;
    // We have a token, get availability info
    //console.log("Token:            " + request.headers.authorization);
    var http = require("https");

    var options = {
        "method": "POST",
        "hostname": "outlook.office365.com",
        "port": null,
        "path": "/ews/exchange.asmx",
        "headers": {
            "content-type": "application/xml",
            "authorization": request.headers.authorization
        }
    };

    console.log("options.headers.authorization    " + options.headers.authorization);
    var req = http.request(options, function(res) {
        var chunks = [];

        res.on("data", function(chunk) {
            chunks.push(chunk);
        });

        res.on('error', function(err) {
            console.log("Error in res   " + err);
            ;
        });
        res.on("end", function() {
            var body = Buffer.concat(chunks);
            //console.log(body.toString());
            console.log("body   " + body.toString());

            if (body.toString() === null || (!body.toString()) || body.toString() === "") {
                //response.writeHead(200, {"Content-Type": "application/json"});
                console.log("Bad Token Message");
                ret = {"Status": "Bad Token"};
                //response.write(JSON.stringify(ret));
                //response.end();
                response.redirect(authHelper.getAuthUrl());
            }
            else {
                var xml = body.toString();
                parseString(xml, {ignoreAttrs: true}, function(err, result) {
                    console.log("A");
                    console.log("err   " + err);
                    //json1 = util.inspect(result, false, null);
                    json1 = JSON.stringify(result);
                    response.writeHead(200, {"Content-Type": "application/json"});
                    //response.write('<p>Please <a href="' + authHelper.getAuthUrl() + '">sign in</a> with your Office 365 account.</p>');

                    console.log("result   " + result);
                    console.log("json1    " + json1);
                    response.write(json1);
                    //writeSession(response, session);
                    response.end();

                    //console.log("3");
                    //console.log(json1);
                });
            }
        });
    });

    request.on('error', function(err) {
        console.log("Error in request   " + err);
        ;
    });

    req.on('error', function(err) {
        console.log("Error in req   " + err);
        ;
    });

    req.write(Oxml);
    req.end();
});
app.post('/createevent', function(req, res) {
    var request = require("request");
    applogger.info("createevent", req.headers);

    console.log(JSON.stringify(req.body));
    var options = {method: 'POST',
        url: 'https://outlook.office365.com/api/v1.0/me/events',
        headers:
                {'content-type': 'application/json',
                    authorization: req.headers.authorization},
        body: req.body,
        json: true};

    request(options, function(error, response, body) {
        if (error)
            throw new Error(error);
        else {
            console.log("Body:   " + JSON.stringify(response));
            res.send({"Status": "Success", "Response": response});
        }
    });

});


app.post('/createEventRecurring', function(req, res) {
    var request = require("request");
    console.log(req.headers.authorization);
    console.log("req.headers.auth");
    console.log("req.body");
    console.log(req.rawBody);
    var options = { method: 'POST',
        url: 'https://outlook.office365.com/ews/exchange.asmx',
        headers:
        { 'content-type': 'application/xml',
            authorization: req.headers.authorization },
        body: req.rawBody };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        else {
            console.log("Body:   " + response);
            res.send({"Status": "Success", "Response": response});
        }
    });

});

app.post('/sendmail', function(req, res) {
    var request = require("request");

    console.log(JSON.stringify(req.body));
    var options = {method: 'POST',
        url: 'https://outlook.office.com/api/v1.0/me/sendmail',
        headers:
                {'content-type': 'application/json',
                    authorization: req.headers.authorization},
        body: req.body,
        json: true};

    request(options, function(error, response, body) {
        if (error)
            throw new Error(error);
        else {
            console.log("Body:   " + JSON.stringify(response));
            res.send({"Status": "Success", "Response": response});
        }
    });

});


app.get('/getrss', function(req, res) {
    var request = require("request");
    var host = "10.128.139.182:9209";
    var options = {method: 'GET',
        url: 'http://' + host + '/twp/_search',
        qs: {q: 'tags:"companynews"', sort: 'sysPublishDate:desc'}};

    applogger.info("getrss", req.headers);
    request(options, function(error, response, body) {
        if (error)
            throw new Error(error);

        ret = JSON.parse(body);
        ret["host"] = host;
        console.log(ret.host);
        res.send(ret);
    });
}
);


app.get('/getrss1', function(req, res) {
    var request = require("request");

    var options = { method: 'GET',
        url: "http://10.128.139.144:8080/api/content/render/false/type/json/query/+structureName:Blog%20+(conhost:a0db78ce-fe47-457f-84f5-a5a5c7aa1ccd%20conhost:SYSTEM_HOST)%20+Blog.tags:companynews%20+languageId:1*%20+deleted:false%20%20+working:true/orderby/modDate%20desc",
        headers:
        { 'postman-token': '8318ed88-6480-7059-b7e4-7ae03ed7ec30',
            'cache-control': 'no-cache' } };

    applogger.info("getrss", req.headers);
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);

        res.writeHead(200, {"Content-Type": "application/json"});
        res.write(body);
        res.end();
    });

    }
);


//app.set('views', __dirname + '/views');
//app.engine('html', require('ejs').renderFile);
//app.set('port', process.env.PORT || 3000);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/sign_s3', function(req, res) {

    var s3 = new aws.S3();
    var S3_BUCKET = "twp-gp-emp-pics";
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data) {
        if (err) {
            console.log(err);
        }
        else {
            var return_data = {
                signed_request: data,
                url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});

app.get('/getEmailAddressFromToken', function(req, res) {
    
    
        var req1 = require("request");

var options = {method: 'GET',
            url: 'https://outlook.office.com/api/v1.0/me',
            headers:
                    {authorization: 'Bearer  ' + req.headers.access_token,
                        'content-type': 'application/json'}};
            req1(options, function(error, response, body) {
                console.log("----------------getEmailAddressFromToken----------------------------------------");
                ret = JSON.parse(body);
                //console.log(ret.error.code);
                if(ret.error){res.send(503, "Bad Email");}
                else{
                    mongoLog.getEmployeeFromEmail(ret["Id"], function(cursor) {

                        if (cursor && cursor[0] && cursor[0].properties) {
                            console.log(cursor[0].properties);                    
                            console.log(req.headers.access_token);
                            mongoLog.updateTokenWithEmpInfo(cursor[0].properties, req.headers.access_token);
                        }
                        res.send(ret["Id"]);
                    });
                }
                
            });
 });           
            
app.listen(3000);
console.log("Server started on 3000");
console.log("config is:");
console.log(config);

