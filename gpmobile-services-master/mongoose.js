
console.log("Start Mongo Connection");

var mongodb = 'post';
var mongo = require('mongodb');
userinfo = {}

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

//console.log("servers");
//console.log(servers);
var replStat = new ReplSetServers(servers);
//console.log("Connecting to " + host + ":" + port);
var db = new Db(mongodb, replStat, {native_parser: true});

//var dbserver = new Server(mongohost, mongoport, {auto_reconnect: true});
//var mongodb = new MongoDb(mongodb, dbserver, {safe: true});
db.open(function(err, mongodb) {

    console.log("Start Mongo Connection on " + IPs);
    //console.log(err);
    db.authenticate('post', 'post', function(err, result) {
    });

});
var addGeoJSON = function(obj) {
    var collection = db.collection("geojson");
    console.log("addGeoJSON");
    collection.insert([obj], {safe: true}, function(err, result) {
        console.log("MongoDB returns: %s, %s", err, result);
        //console.log(result);
    });
};

var addAllGeoJSON = function(obj) {
    var collection = db.collection("geojson");
    console.log("addAllGeoJSON");
    collection.insert(obj, {safe: true}, function(err, result) {
        console.log("MongoDB returns: %s, %s", err, result);
        //console.log(result);
    });
};

var updateGeoJSON = function(obj, id) {
    var collection = db.collection("geojson");
    console.log("ASDF");
    var ObjectId = require('mongodb').ObjectID;
    
    var idObject = new ObjectId(id);
    console.log("******************");
    console.log(idObject);
    console.log(obj);
    console.log("******************");
    //collection.update({ "_id": idObject} , {$set: obj,$currentDate: { lastModified: true } }
    collection.update({ "_id": idObject} , obj );
};

var deleteGeoJSON = function(id, callback) {
    
   var collection = db.collection("geojson");
   var ObjectId = require('mongodb').ObjectID;    
   var idObject = new ObjectId(id);
   
   console.log(idObject);
   collection.remove(
      { "_id": idObject}
   );
};


var addCommentToKudo = function(obj, id) {
    var collection = db.collection("kudos");


    var ObjectId = require('mongodb').ObjectID;
    var idObject = new ObjectId(id);
    console.log(obj);
    //console.log();

    var cursor =collection.find({"_id" : idObject, "comments.email" : obj.email});
    cursor.toArray(function(err, docs){
        console.log("docs");
        console.log(docs.length);
        //if (docs.length === 0){
            collection.update(
                {"_id": idObject}, // query
                { $push: { "comments" : obj } },
                function(err, object) {
                    if (err) {
                        console.log("Error Error Error Error");
                        console.log(err.message);  // returns error if no matching object found
                    } else {
                        console.log("Success adding Comments");
                        console.log(object);

                        //}
                    }
                });
        //}
    });

};

var getCountOnKudoComments = function(id, callback) {
    var collection = db.collection("kudos");


    var ObjectId = require('mongodb').ObjectID;
    var idObject = new ObjectId(id);

    var cursor =collection.find({"_id" : idObject});
    cursor.toArray(function(err, docs){
        console.log("likes length");
        console.log(docs[0].likes.length);
        callback(docs[0].likes.length);
    });

};



var addLikeToKudo = function(obj, id) {
    var collection = db.collection("kudos");


    var ObjectId = require('mongodb').ObjectID;
    var idObject = new ObjectId(id);
    console.log(obj);
    //console.log();

    var cursor =collection.find({"_id" : idObject, "likes.email" : obj.email});
    cursor.toArray(function(err, docs){
        console.log("docs");
        console.log(docs.length);
        if (docs.length === 0){
            collection.update(
                {"_id": idObject}, // query
                { $push: { "likes" : obj } },
                function(err, object) {
                    if (err) {
                        console.log("Error Error Error Error");
                        console.log(err.message);  // returns error if no matching object found
                    } else {
                        console.log("Success adding Kudo");
                        console.log(object);

                        //}
                    }
                });
        }
    });

};

var getCountOnKudoLikes = function(id, callback) {
    var collection = db.collection("kudos");


    var ObjectId = require('mongodb').ObjectID;
    var idObject = new ObjectId(id);

    var cursor =collection.find({"_id" : idObject});
    cursor.toArray(function(err, docs){
        console.log("likes length");
        console.log(docs[0].likes.length);
        callback(docs[0].likes.length);
    });

};



var insertIntoMongo = function(obj, collectionName) {
    var collection = db.collection(collectionName);
    console.log(collectionName);
   
    obj["dateCreated"] = new Date();
    //console.log(obj);
    collection.insert(obj, {safe: true}, function(err, result) {
        console.log("MongoDB returns: %s, %s", err, result);
        //console.log(result);
    });
};

var insertIntoEmpProfilePics = function(obj){
	insertIntoMongo(obj, "EmpProfilePics");
};

function setVersion(body){
    body["Application"] = "GuidePostMobile";
    obj = body;
	db.collection("OtherData").update({"Application" : "GuidePostMobile"}, obj);
};

function getVersion(callback) {
   var cursor =db.collection("OtherData").find({"Application" : "GuidePostMobile"});
   cursor.toArray(function(err, docs){
        callback(docs);
   });
};

var updateMongoCollection = function(obj, id, collectionName) {
    var collection = db.collection(collectionName);
    console.log("Update Collection:  " + collectionName);
    var ObjectId = require('mongodb').ObjectID;
    
    obj["dateUpdated"] = new Date();
    var idObject = new ObjectId(id);
    //collection.update({ "_id": idObject} , {$set: obj,$currentDate: { lastModified: true } }
    //console.log(obj);
    collection.update({ "_id": idObject} , obj);
};

var insertIntoConfRooms = function(obj) {
    var collection = db.collection("ConfRooms");
    //console.log("ConfRooms1");
    collection.insert(obj, {safe: true}, function(err, result) {
        console.log("MongoDB returns: %s, %s", err, result);
        //console.log(result);
    });
};


var insertToken = function(obj, res) {
    var collection = db.collection("token");
    console.log("Insert token");
    console.log(obj);
    collection.insert(obj, {safe: true}, function(err, result) {
        console.log("MongoDB insertToken returns: %s, %s", err, result);
        if (!err) {res.redirect(authHelper.getAuthUrl());}
        else {res.send({"Message" : "Errored"});}
        //console.log(result);
    });
};

var deleteAndInsertToken = function(obj, res) {
    var collection = db.collection("token");
    var cursor =collection.remove({"uuid" : obj.uuid}, function(e, r) {
        if (e) {
            console.log(e);
        }
        collection.insert(obj, {safe: true}, function(err, result) {
            console.log("MongoDB insertToken returns: %s, %s", err, result);
            if (!err) {res.redirect(authHelper.getAuthUrl());}
            else {res.send({"Message" : "Errored", "Error" : err});}
            //console.log(result);
        });

        console.log(r);
    });
    console.log("Insert token");
    console.log(obj);
};



var getToken = function(uuid, callback) {
   var cursor =db.collection("token").find({"uuid" : uuid});
   cursor.toArray(function(err, docs){
        callback(docs);
   });
};

var getTokenFromSessionID = function(sessionID, callback) {
   var cursor =db.collection("token").find({"sessionID" : sessionID});
   if (cursor) {
    cursor.toArray(function(err, docs){
        if (err) {callback("Error");}
        else{
         callback(docs);
         }
    });
   }
   else callback("Error");
};

var updateToken = function(sessionID, obj, response) {
   db.collection("token").update({"sessionID" : sessionID}, obj);
   response.send("Redirecting.....");
   
};

var updateTokenWithEmpInfo = function(obj, access_token) {
    var collection = db.collection("token");
    collection.findAndModify(
        {"token.token.access_token": access_token}, // query
        [['sessionID', 'asc']], // sort order
        {$set: {"EmpInfo": obj, "email" : obj.email, "dateCreated" : new Date()}}, // replacement, replaces only the field "email"
        {}, // options
        function(err, object) {
            if (err) {
                console.log("Error Error Error Error");
                console.log(err.message);  // returns error if no matching object found
            } else {
                console.log("Success");
                
            //}
            }
        });
};


var updateTokenfromSessionID = function(sessionID, token, response) {
    
   //db.collection("token").update({"sessionID" : sessionID}, {"token": ""});
   db.collection("token").findAndModify(
        {"sessionID" : sessionID}, // query
        [['sessionID','asc']],  // sort order
        {$set: {"token": token}}, // replacement, replaces only the field "token"
        {}, // options
        function(err, object) {
            if (err){
                console.log("Error Error Error Error");
                console.log(err.message);  // returns error if no matching object found
            }else{
                console.dir(object);
                response.send("Redirecting.....");
                //response.send(token);
                
            }
        });
   
};


var deleteToken = function(uuid, callback) {
    var collection = db.collection("token");
    var cursor =collection.remove({"uuid" : uuid});
    console.log("Delete token");
    callback({"Message": "Delete Successful"});
};

var deleteTokenAll = function(ip, email, callback) {
    var collection = db.collection("token");
    console.log("Delete token");
    var cursor =collection.remove({"ip" : ip});
    var cursor =collection.remove({"email" : email});
    callback({"Message": "Delete Successful"});
};

var getEmpForSlack = function(query, callback) {
    sTerm = query.term;
    sTerm = new RegExp(sTerm, 'i');
    var cursor = db.collection("ldap").find({"properties.searchSlack": sTerm}).sort({"properties.Name": 1});


    cursor.toArray(function(err, docs){
        callback(docs);
    });
};


var getConfForSlack = function(query, callback) {
    if(! query) {console.log("No Query object"); query = "";}
    if (query.term) {sTerm = new RegExp(query.term, 'i');} else {console.log("No sTerm object");sTerm = new RegExp("^" + "", "i");}
    if (query.email) {sEmail = new RegExp(query.email, 'i');} else {sEmail = new RegExp("^" + "", "i");}
    if (query.type) {sType = new RegExp(query.type, 'i');} else {sType = new RegExp("^" + "", "i");}
    console.log(sTerm);
    var cursor =db.collection("ConfRooms").
    find({$and: [{ "Name" : sTerm} , {"email" : sEmail} , {"Type" : sType}, {"Reservable" : "Yes"}]} ).
    sort({ "Floor" : 1, "Name" : 1  });

    callback(cursor);
};


exports.getEmpForSlack = getEmpForSlack;
exports.getConfForSlack = getConfForSlack;

var getListofEmployees = function(query, callback) {
    sTerm = query.term;
    //sTerm = new RegExp("^" + sTerm, 'i');
    sTerm = new RegExp(sTerm, 'i');
    sMemberOf = new RegExp(query.memberOf, 'i');
    console.log("sTerm");
    console.log(sTerm);
    console.log("sMemberOf");
    console.log(sMemberOf);
    //var cursor =db.collection("geojson").find( {"properties.name" : sTerm});
    if (query.memberOf)
    {
        var cursor = db.collection("ldap").find({$and: [{"properties.searchField": sTerm}, {"properties.memberOf" : sMemberOf}]}).sort({"properties.Name": 1});
    }
    else {
        var cursor = db.collection("ldap").find({"properties.searchField": sTerm}).sort({"properties.Name": 1});
    }

    cursor.toArray(function(err, docs){
        //console.log("retrieved records:");

        callback(docs);

    });
};

var getEmployeeFromEmail = function(email, callback) {
    //sTerm = new RegExp("^" + sTerm, 'i');
    email = new RegExp(email, 'i');
    console.log(email);
   //var cursor =db.collection("geojson").find( {"properties.name" : sTerm});
   var cursor =db.collection("ldap").find( {"properties.email" : email});//.sort({ "properties.Name" : 1 });
   cursor.toArray(function(err, docs){
            //console.log("retrieved records:");
            
            callback(docs);

        });
};


var getGeoJSONforSeat = function(seat, callback) {
   var cursor =db.collection("geojson").find({"properties.id" : seat});
   //console.log(cursor);
   cursor.toArray(function(err, docs){
     callback(docs);
 });
};

var getEmployeeforSeat = function(seat, callback) {
   var cursor =db.collection("ldap").find({"properties.seat" : seat});
   //console.log(cursor);
   cursor.toArray(function(err, docs){
     callback(docs);
 });
};

var getEmpProfilePicsFromID = function(empId, callback) {
   var cursor =db.collection("EmpProfilePics").find({"ID" : empId}).sort({"dateCreated":-1}).limit(1);
   cursor.toArray(function(err, docs){
            //console.log("retrieved records:");
            
            callback(docs);

        });
};


var getFromMongo = function(collectionName, callback) {
   var cursor =db.collection(collectionName).find().sort({ "date" : -1});
   
   callback(cursor);
};

var getAllGeoJSON = function(callback) {
   var cursor =db.collection("geojson").find();
   
   callback(cursor);
};

var getGeoJSONforFloor = function(floorNum, callback) {
   var cursor =db.collection("geojson").find({"properties.floor" : floorNum});
   cursor.toArray(function(err, docs){
     callback(docs);
 });
};


var getDeviceInfo = function(deviceId, callback) {
   var cursor =db.collection("DeviceId").find({"deviceToken" : deviceId});
   cursor.toArray(function(err, docs){
     callback(docs);
 });
};
var getProfileInfoforEmployee = function(empID, callback) {
   var cursor =db.collection("workdayEmployees").find({"Employee_ID" : empID});
   cursor.toArray(function(err, docs){
     callback(docs);
 });
};


var getListofConfRooms = function(query, callback) {
    console.log("IN Here")
   if(! query) {console.log("No Query object"); query = "";}
   if (query.term) {sTerm = new RegExp(query.term, 'i');} else {console.log("No sTerm object");sTerm = new RegExp("^" + "", "i");}
   if (query.email) {sEmail = new RegExp(query.email, 'i');} else {sEmail = new RegExp("^" + "", "i");}
   if (query.type) {sType = new RegExp(query.type, 'i');} else {sType = new RegExp("^" + "", "i");}
    console.log(sTerm);
   //var cursor =db.collection("ConfRooms").find( {"Name" : sTerm});
   //var cursor =db.collection("ConfRooms").find({ $or: [ {"Name" : sTerm}, {"Address" : sTerm} ] });
   //var cursor =db.collection("ConfRooms").find({$and: [{ $or: [  {"Type" : sType}, {"Name" : sTerm}, 
    //                                                            {"email" : sEmail} ] }, 
    //                                                    {"email" : /@washpost/}, {"Reservable" : "Yes"}]} );
   var cursor =db.collection("ConfRooms").
           find({$and: [{ "Name" : sTerm} , {"email" : sEmail} , {"Type" : sType}, {"Reservable" : "Yes"}]} ).
                    sort({ "Floor" : 1, "Name" : 1  });
   
   //var cursor =db.collection("ConfRooms").find({"email" : /@washpost/});
   
   //var cursor =db.collection("ConfRooms").find(sTerm);
   callback(cursor);
};

exports.getCountOnKudoLikes = getCountOnKudoLikes;
exports.addLikeToKudo = addLikeToKudo;
exports.addCommentToKudo = addCommentToKudo;
exports.getCountOnKudoComments = getCountOnKudoComments;
exports.updateTokenWithEmpInfo = updateTokenWithEmpInfo;
exports.updateTokenfromSessionID = updateTokenfromSessionID;
exports.setVersion = setVersion;
exports.getVersion = getVersion;
exports.getDeviceInfo = getDeviceInfo;
exports.updateMongoCollection = updateMongoCollection;
exports.insertIntoEmpProfilePics = insertIntoEmpProfilePics;
exports.getEmployeeFromEmail = getEmployeeFromEmail;
exports.insertIntoMongo = insertIntoMongo;
exports.getEmpProfilePicsFromID = getEmpProfilePicsFromID;
exports.getFromMongo = getFromMongo;
exports.addGeoJSON = addGeoJSON;
exports.deleteGeoJSON = deleteGeoJSON;
exports.updateGeoJSON = updateGeoJSON;
exports.addAllGeoJSON = addAllGeoJSON;
exports.insertIntoConfRooms = insertIntoConfRooms;

exports.deleteAndInsertToken = deleteAndInsertToken;
exports.insertToken = insertToken;
exports.updateToken = updateToken;
exports.deleteTokenAll = deleteTokenAll;
exports.deleteToken = deleteToken;
exports.getTokenFromSessionID = getTokenFromSessionID;
exports.getToken = getToken;
exports.getAllGeoJSON = getAllGeoJSON;
exports.getListofEmployees = getListofEmployees;
exports.getGeoJSONforFloor = getGeoJSONforFloor;
exports.getGeoJSONforSeat = getGeoJSONforSeat;
exports.getEmployeeforSeat = getEmployeeforSeat;
exports.getProfileInfoforEmployee = getProfileInfoforEmployee;
exports.getListofConfRooms = getListofConfRooms;

