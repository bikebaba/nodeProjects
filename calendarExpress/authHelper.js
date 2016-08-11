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
    "profile",
    "https://outlook.office.com/mail.readwrite",
    "https://outlook.office.com/calendars.readwrite",
    "offline_access"];

function getAuthUrl() {
    var returnVal = oauth2.authCode.authorizeURL({
        redirect_uri: "http://localhost:8000/authorize",
        scope: scopes.join()
    });
    console.log("Generated auth url: " + returnVal);
    return returnVal;
}

function getNewToken(req, res){
    var request = require("request");
    console.log("IN getnewtoken");
    console.log(req.query.refresh_token);
    var options = {method: 'POST',
        url: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        //url : 'https://login.windows.net/common/oauth2/token',
        form:
        {grant_type: 'refresh_token',
            //refresh_token: 'AAABAAAAiL9Kn2Z27UubvWFPbm0gLYrVyYqIHJkS-Aq8MnoCdMJQkLyFJRDXOuz-M98HfUATtVAwBO2AG40xZXBrb7jcS1Bq2ZmQoVc-IHtWcJ7TQlrcWqojPwHuKMKrYlE7S3xqZT9x8-LZQ2QxNrcg5ZW5c9Vly1H_4sIYvkVjd8nNBkE7lC8vI89LnhOi44_P-4y-ZBPuAsr8zgccD6bABQQvRAauEE6L_kkuiWw-U-JfwsSTC_CltdyNINbPO7L-uIzJMaj-0Tblt_3kcmMELaaOXjlOf-1xZ8y9NnQRD2ugxZOsrRpo0BopftaxJNl6Aeac9ZQPFvyZK3jNcs5I6rQsZzokjsahRX_uyXqntfqm8ftGaufp2GOa9QD2XdHK8WmJsniUOlFIpWLdAhZv5tHJMAJSZ61fkNRrcf_ayiSp_Ud5rSdW5QBGlmgeYgs8DS-mN-ZpkHi8gqKx_ZRsGNUQnaade3d3u5_T-t71pxZ093uSCwwTeRsAixA0vIxPgj4QMs1aqIghij8ZrYuzo0LkW9nKBYsedIm5FXN1ugr1cDz1OhoJfk220y55-Jhdb55jc4iwDZPzImlfOhivIaKi5MRTUzRuD9lZUMzo69aXvecgAA',
            refresh_token: req.query.refresh_token,
            client_id: credentials.clientID, //'0aca55fd-3cd9-40a6-aa78-ae6fcd1ab359',
            client_secret: credentials.clientSecret //'F7dKfSa372ryjyskvxbQS4C9FAJVBNnfRIHwdOQLd2w='
        }};

    //console.log("Req:   " + util.inspect(req.headers["x-forwarded-for"], false, null));
    //console.log("Res:   " + JSON.stringify(res));
    request(options, function(error, response, body) {
        if (error)
            throw new Error(error);
        res.setHeader('Content-Type', 'application/json');
        res.send(body);
    });

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
            console.log("Access token error: ", error);
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



exports.getEmailFromIdToken = getEmailFromIdToken;
exports.getTokenFromCode = getTokenFromCode;
exports.getAuthUrl = getAuthUrl;
exports.getNewToken = getNewToken;
