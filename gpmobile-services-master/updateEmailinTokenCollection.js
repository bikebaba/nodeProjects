console.log("Start Mongo Connection");

var mongodb = 'post';
var mongo = require('mongodb');

var Db = mongo.Db,
        Connection = mongo.Connection,
        Server = mongo.Server,
        ReplSetServers = mongo.ReplSetServers;

var port = 27017;
nconf = require('nconf');
nconf.argv().env().file({file: './mongo.json'});

var servers = new Array();

IPs = nconf.get('servers');

for (var i = 0; i <= IPs.length - 1; i++) {
    servers[i] = new Server(IPs[i], port, {});
}

//console.log(servers);
var replStat = new ReplSetServers(servers);
//console.log("Connecting to " + host + ":" + port);
var db = new Db(mongodb, replStat, {native_parser: true});


var collection = db.collection("token");

var req1 = require("request");
var req2 = require("request");

//var dbserver = new Server(mongohost, mongoport, {auto_reconnect: true});
//var mongodb = new MongoDb(mongodb, dbserver, {safe: true});
var clientId = require("./clientId");
db.open(function(err, mongodb) {

    console.log("Start Mongo Connection 2");
    //console.log(err);
    db.authenticate('post', 'post', function(err, result) {
        var cursor = collection.find({"email": null, "token" : {$ne : null}});
        cursor.toArray(function(err, docs) {
            //console.log(docs);
            AddAll(docs, 0);
            //process.exit();
        //}
        });

    });

});


var AddAll = function(docs, j) {
    console.log("Doc count  " + docs.length);
    var options2 = {method: 'POST',
                url: 'https://login.microsoftonline.com/common/oauth2/token',
                form: {grant_type: 'refresh_token',
                    //refresh_token: 'AAABAAAAiL9Kn2Z27UubvWFPbm0gLYrVyYqIHJkS-Aq8MnoCdMJQkLyFJRDXOuz-M98HfUATtVAwBO2AG40xZXBrb7jcS1Bq2ZmQoVc-IHtWcJ7TQlrcWqojPwHuKMKrYlE7S3xqZT9x8-LZQ2QxNrcg5ZW5c9Vly1H_4sIYvkVjd8nNBkE7lC8vI89LnhOi44_P-4y-ZBPuAsr8zgccD6bABQQvRAauEE6L_kkuiWw-U-JfwsSTC_CltdyNINbPO7L-uIzJMaj-0Tblt_3kcmMELaaOXjlOf-1xZ8y9NnQRD2ugxZOsrRpo0BopftaxJNl6Aeac9ZQPFvyZK3jNcs5I6rQsZzokjsahRX_uyXqntfqm8ftGaufp2GOa9QD2XdHK8WmJsniUOlFIpWLdAhZv5tHJMAJSZ61fkNRrcf_ayiSp_Ud5rSdW5QBGlmgeYgs8DS-mN-ZpkHi8gqKx_ZRsGNUQnaade3d3u5_T-t71pxZ093uSCwwTeRsAixA0vIxPgj4QMs1aqIghij8ZrYuzo0LkW9nKBYsedIm5FXN1ugr1cDz1OhoJfk220y55-Jhdb55jc4iwDZPzImlfOhivIaKi5MRTUzRuD9lZUMzo69aXvecgAA',
                    refresh_token: docs[j].token.token.refresh_token,
                    client_id: clientId.clientId, //'0aca55fd-3cd9-40a6-aa78-ae6fcd1ab359',
                    client_secret: clientId.clientSecret //'F7dKfSa372ryjyskvxbQS4C9FAJVBNnfRIHwdOQLd2w=' 
                }};

            req2(options2, function(error, response, body2) {
                if (error) {
                    throw new Error(error);
                }
                //console.log(JSON.parse(body2).access_token);
                collection.findAndModify(
                        {"token.token.refresh_token": options2.form.refresh_token}, // query
                        [['sessionID', 'asc']], // sort order
                        {$set: {"token.token.access_token": JSON.parse(body2).access_token}}, // replacement, replaces only the field "email"
                        {}, // options
                        function(err, object) {
                            if (err) {
                                console.log("Error Error Error Error");
                                console.log(err.message);  // returns error if no matching object found
                            } else {
                                //console.log("1");
                                var options1 = {method: 'GET', url: 'https://outlook.office.com/api/v1.0/me',
                                    headers: {authorization: 'Bearer  ' + JSON.parse(body2).access_token, 'content-type': 'application/json'}};

                                req1(options1, function(error, response, body) {
                                    console.log("body");
                                    console.log(body);   
                                    if (!body){console.log("DDD");}
                                    //console.log(JSON.parse(body));
                                    if ( body)
                                    {
                                        if (!body.error){
                                            ret = JSON.parse(body);
                                            //console.log(options1.headers.authorization.replace("Bearer  ", ""));
                                            collection.findAndModify(
                                                    {"token.token.access_token": options1.headers.authorization.replace("Bearer  ", "")}, // query
                                                    [['sessionID', 'asc']], // sort order
                                                    {$set: {"email": ret["Id"]}}, // replacement, replaces only the field "email"
                                                    {}, // options
                                                    function(err, object) {
                                                        if (err) {
                                                            console.log("Error Error Error Error");
                                                            console.log(err.message);  // returns error if no matching object found
                                                        } else {
                                                            //console.log(ret["Id"]);
                                                            //if (j <=3 ){
                                                            //console.log(docs[j]);
                                                            AddAll(docs, j + 1);
                                                        //}
                                                        }
                                                    });
                                                }
                                      } else {AddAll(docs, j + 1);}
                                });

                            }
                        });


            });
    
};

/*
var util = require('util');
function final() {
    console.log('Done and Final');
    process.exit();
}
var addAll = function(obj) {
    console.log("addAll");
    collection.insert(obj, {safe: true}, function(err, result) {
        //console.log("MongoDB returns: %s, %s", err, result);
        //return;
        console.log("Done");
        return final();
        //console.log(result);
    });
};

*/