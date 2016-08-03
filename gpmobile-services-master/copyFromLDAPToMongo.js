console.log("Start Mongo Connection");

config = require('./config.json');
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


var collection = db.collection("ldap");
//var dbserver = new Server(mongohost, mongoport, {auto_reconnect: true});
//var mongodb = new MongoDb(mongodb, dbserver, {safe: true});
db.open(function(err, mongodb) {

    console.log("Start Mongo Connection 2");
    //console.log(err);
    db.authenticate('post', 'post', function(err, result) {
        var ldap = require('ldapjs');
        var client = ldap.createClient({
        //url: 'ldap://twpndc07nw.twpn.root.washpost.com/',
        url: 'ldap://10.10.92.11/',
          timeout: 300000
        });

          client.bind('svcGuidepost','4&CZCCNi7xDL',function(err){
            console.log("svcGuidepost Error:(if null its good   " + err);
            //assert.ifError(err);
          });

        var opts = {
         // filter: '(&(objectClass=person)(memberOf=cn=IT Publishing Systems,ou=GROUPS,ou=TWPN,dc=twpn,dc=root,dc=washpost,dc=com))',
         // filter: '(&(objectclass=person)(memberOf=cn=SP_Mailroom_Employees,ou=Security,ou=Groups,dc=twpn,dc=root,dc=washpost,dc=com))',
         //filter: '&(objectClass=user)(employeeid=*)(!(userAccountControl:1.2.840.113556.1.4.803:=2))',
          scope: 'sub'
        };

          opts.scope = 'sub';
          //opts.sizeLimit = 50;
          //if (req.query.size){opts.sizeLimit = parseInt(req.query.size);}
          //opts.filter = "&(objectClass=user)(employeeid=*)(!(userAccountControl:1.2.840.113556.1.4.803:=2))(displayName=*)";
          opts.filter = "&(objectClass=user)(employeeid=*)(!(sn=API))(displayName=*)(!(userAccountControl:1.2.840.113556.1.4.803:=2))";
          opts.attributes = [ "displayName", "department", "employeeID", "telephoneNumber",
              "title", "roomNumber", "mail", "employeeType", "extensionAttribute3",
              "wpoCompanyCode", "description", "givenName", "sn", "memberOf", "division"];
          //console.log("client:    " + util.inspect(client, false, null));

          client.search('ou=twpn,dc=twpn,dc=root,dc=washpost,dc=com', opts, function(err, result) {
            //assert.ifError(err);
            if (err) {res.send(err);}
            else {
                var pList = [];
                var i = 0, j = 0;
                result.on('searchEntry', function(entry) {
                    //console.log(entry.connection.ldap.getNextMessageID);
                    //if( entry.object.sn === "API"){console.log(entry.object);}


                  if (entry.object.wpoCompanyCode === '500' || entry.object.wpoCompanyCode === '106' 
                          || entry.object.wpoCompanyCode === '107'){
                    //if(JSON.stringify(entry.object.displayName) !== null)
                      pList[i] = {};
                      pList[i]["type"] = "People";
                      pList[i]["properties"] = {};
                      pList[i].properties.Name = entry.object.displayName;
                      pList[i].properties.searchField = entry.object.givenName + " " 
                                        + entry.object.displayName.replace(',', '') + " " + entry.object.extensionAttribute3 + 
                                        " " + entry.object.title + " " + entry.object.roomNumber + "  " + entry.object.mail;

                      pList[i].properties.searchSlack = entry.object.givenName + " "
                          + entry.object.displayName.replace(',', '') + " " + entry.object.roomNumber;
                      //console.log("Dept:  " + entry.object.extensionAttribute3);
                      pList[i].properties.department = entry.object.extensionAttribute3;
                      pList[i].properties.subdepartment = entry.object.department;
                      pList[i].properties.division = entry.object.division;
                      pList[i].properties.Employee_ID = entry.object.employeeID;
                      //pList[i].properties.workerPhotos = "https://guidepost.washpost.com/photoDropBox/thumbs/thumbnail." + entry.object.employeeID +".JPG";
                      pList[i].properties.workerPhotos = "http://" + config.elb + "/getEmployeePic?empID=" + entry.object.employeeID;
                      pList[i].properties.telephoneNumber = entry.object.telephoneNumber;
                      pList[i].properties.title = entry.object.title;
                      pList[i].properties.email = entry.object.mail;
                      pList[i].properties.employeeType = entry.object.employeeType;
                      pList[i].properties.memberOf = entry.object.memberOf;
                      var r = require("random-js")();
                      //if(entry.object.givenName === "Trina") {
                      //console.log("entry.object.division");
                      //console.log(entry.object.division);
                      //console.log("entry.object.department");
                      //console.log(entry.object.department);
                      //}

                      //var clipboard = require("nativescript-clipboard");
                      //if(! entry.object.roomNumber) {pList[i].properties.seat = r.pick(["5N27", "5P77", "5W42", "5W40", "4P24B", "5N25", "5P79"]);}
                      //else {pList[i].properties.seat = entry.object.roomNumber;};
                      
                      pList[i].properties.seat = entry.object.roomNumber;
                      //console.log(pList[i].properties.searchField);
                      //console.log(entry.object.givenName);
                          //if (entry.object.wpoJobCode) {console.log(entry.object.wpoJobCode);console.log(entry.object.mail);};
                          j++;
                      //}
                   i++;
                  }
                });
                result.on('searchReference', function(referral) {
                  console.log('referral: ' + referral.uris.join());
                });
                result.on('error', function(err) {
                  console.error('error Shiv: ' + err.message);
                  //console.log('end status: ' + util.inspect(pList, false, null));
                  //res.send(pList);
                    console.log("Total number: " || i);
                  addAll(pList); 
                });
                result.on('end', function(results) {
                  console.log('end status: ' + results);
                  //res.send(pList);

                  addAll(pList); 

                });
            }
          });

    });

});
var util = require('util');
function final() { console.log('Done and Final'); process.exit() ; }
var addAll = function(obj) {
    console.log("addAll");
    //console.log(obj);

    console.log("Total number: " + obj.length);
    collection.remove();
    console.log("Removed");
    collection.insert(obj, {safe: true}, function(err, result) {
        //console.log("MongoDB returns: %s, %s", err, result);
        //return;
        console.log("Done");
        return final();
        //console.log(result);
    });
};
 
