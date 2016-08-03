
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

console.log(servers);
var replStat = new ReplSetServers(servers);
//console.log("Connecting to " + host + ":" + port);
var db = new Db(mongodb, replStat, {native_parser: true});

//var dbserver = new Server(mongohost, mongoport, {auto_reconnect: true});
//var mongodb = new MongoDb(mongodb, dbserver, {safe: true});
db.open(function(err, mongodb) {

    console.log("Start Mongo Connection 2");
    //console.log(err);
    db.authenticate('post', 'post', function(err, result) {
    });

});

var http = require("https");

var options = {
  "method": "GET",
  "hostname": "wd5-impl-services1.workday.com",
  "port": null,
  "path": "/ccx/service/customreport2/washpost1/twpguidepostINT/GuidePostApp-Export?format=json",
  "headers": {
    "authorization": "Basic dHdwZ3VpZGVwb3N0SU5UOldhc2hwb3N0QDIwMTU=",
    "content-type": "application/json"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    var finaljson = body.toString();
    //console.log(["Report_Entry"]);
    console.log(JSON.parse(finaljson).Report_Entry);
    obj = JSON.parse(finaljson).Report_Entry;
    console.log(obj);
    var collection = db.collection("workdayEmployees");
    console.log("ASDF");
    /*collection.remove();
    console.log("Removed");
    collection.insert(obj, {safe: true}, function(err, result) {
        console.log("MongoDB returns: %s, %s", err, result);
        process.exit() ;
        //next();
        
        //console.log(result);
    });
    */
    
  });
});

req.end();