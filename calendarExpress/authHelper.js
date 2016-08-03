/**
 * Created by bhuvanapalli on 6/30/16.
 */

var credentials = {
    clientID: "2ceb3fc9-2ab1-4942-a392-5a90c72e58e2",
    clientSecret: "2bp7d3kVUwzEoD9nqPJa9UA",
    site: "https://login.microsoftonline.com/common",
    authorizationPath: "/oauth2/v2.0/authorize",
    tokenPath: "/oauth2/v2.0/token"
}
var oauth2 = require("simple-oauth2")(credentials);

var redirectUri = "http://localhost:8000/authorize";

// The scopes the app requires
var scopes = [ "openid",
    "offline_access",
    "profile",
    "https://outlook.office.com/mail.readwrite",
    "https://outlook.office.com/calendars.readwrite" ];

function getAuthUrl() {
    var returnVal = oauth2.authCode.authorizeURL({
        redirect_uri: "http://localhost:8000/authorize",
        scope: scopes.join(" ")
    });
    console.log("Generated auth url: " + returnVal);
    return returnVal;
}


function getTokenFromCode(auth_code, callback, response) {
    var token;
    //scopes[4] = "offline_access";
    console.log(scopes[0]);
    oauth2.authCode.getToken({
        code: auth_code,
        redirect_uri: redirectUri,
        scope: scopes.join(" ")
    }, function (error, result) {
        if (error) {
            console.log("Access token error: ", error.message);
            callback(response, error, null);
        }
        else {
            token = oauth2.accessToken.create(result);
            console.log("Token ");
            console.log(token.token.access_token);
            console.log("Refresh ");
            console.log(token.token.refresh_token);
            callback(response, null, token);
        }
    });
}

function getEmailFromIdToken(id_token) {
    // JWT is in three parts, separated by a '.'
    var token_parts = id_token.split('.');

    // Token content is in the second part, in urlsafe base64
    var encoded_token = new Buffer(token_parts[1].replace("-", "_").replace("+", "/"), 'base64');

    var decoded_token = encoded_token.toString();

    var jwt = JSON.parse(decoded_token);

    // Email is in the preferred_username field
    return jwt.preferred_username
}

//gets a new token given a refresh token
function getTokenFromRefreshToken(token, callback) {
    var payload = 'grant_type=refresh_token' +
        '&redirect_uri=' + credentials.redirect_url +
        '&client_id=' + credentials.client_id +
        '&client_secret=' + credentials.client_secret +
        '&refresh_token=' + token +
        '&scope=' + appDetails.scopes;

    postJson('login.microsoftonline.com',
        '/common/oauth2/v2.0/token',
        payload,
        function(token) {
            callback(token);
        });
};

//performs a generic http POST and returns JSON
function postJson(host, path, payload, callback) {
    var options = {
        host: host,
        path: path,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(payload, 'utf8')
        }
    };

    var reqPost = https.request(options, function(res) {
        var body = '';
        res.on('data', function(d) {
            body += d;
        });
        res.on('end', function() {
            callback(JSON.parse(body));
        });
        res.on('error', function(e) {
            callback(null);
        });
    });

    //write the data
    reqPost.write(payload);
    reqPost.end();
};




exports.getEmailFromIdToken = getEmailFromIdToken;
exports.getTokenFromCode = getTokenFromCode;
exports.getAuthUrl = getAuthUrl;
