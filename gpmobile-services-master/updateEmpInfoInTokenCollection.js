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
        var cursor = collection.find({"EmpInfo" : null});
        cursor.toArray(function(err, docs) {
            //console.log(docs);
            AddAll(docs, 0);
            //process.exit();
        //}
        });

    });

});


var AddAll = function(docs, j) { 
    if (!docs[j]) {console.log("AAA   " + j);console.log(docs.length);}
    else
    {
        var cursor =db.collection("ldap").find( {"properties.email" : docs[j].email});//.sort({ "properties.Name" : 1 });
        cursor.toArray(function(err, docsemp){
            if (!docsemp || docsemp === []) {AddAll(docs, j + 1);}
            else {
                //console.log(docsemp);
                if (!docsemp[0] ) {AddAll(docs, j + 1);}
                else {
                    collection.findAndModify(
                    {"email": docsemp[0].properties.email}, // query
                    [['sessionID', 'asc']], // sort order
                    {$set: {"EmpInfo": docsemp[0].properties, "dateCreated" : new Date()}}, // replacement, replaces only the field "email"
                    {}, // options
                    function(err, object) {
                        if (err) {
                            console.log("Error Error Error Error");
                            console.log("AAAA" + err.message);  // returns error if no matching object found
                        } else {
                            console.log("BBBB   " + j);
                            console.log(object.EmpInfo);
                            //console.log("Success");
                            if (j >= 0) {AddAll(docs, j + 1);}
                        }
                    });
                }
            }
        });  
    }
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