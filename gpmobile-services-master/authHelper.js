// Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license at the bottom of this file.
var outlook = require("node-outlook");
var clientId = require("./clientId");
var mongoLog = require('./mongoose');

var credentials = {
    clientID: clientId.clientId,
    clientSecret: clientId.clientSecret,
    site: "https://login.microsoftonline.com/common",
    authorizationPath: "/oauth2/authorize",
    tokenPath: "/oauth2/token"
};
var oauth2 = require("simple-oauth2")(credentials);

var redirectUri = clientId.redirectUri;
var tokenPath = "/common/oauth2/token";

function getAccessToken(resource, request) {
    //console.log("getAccessToken called for " + request);
    var deferred = new outlook.Microsoft.Utility.Deferred();
    ls = request.headers.authorization;
    console.log("EXISTING ACCESS TOKEN: ", ls);
    deferred.resolve(JSON.stringify(ls));
    //}
    return deferred;
}

function getAccessTokenFn(resource, request) {
    return function() {
        return getAccessToken(resource, request);
    }
}

function getAuthUrl() {
    var returnVal = oauth2.authCode.authorizeURL({
        redirect_uri: redirectUri
    });
    console.log("Generated auth url: " + returnVal);
    return returnVal;
}

function getTokenFromCode(auth_code, resource, response, request) {
    var token;
    oauth2.authCode.getToken({
        code: auth_code,
        redirect_uri: redirectUri,
        resource: resource
    }, function(error, result) {
        if (error) {
            console.log("Access token error: ", error.message);
        }


        token = oauth2.accessToken.create(result);

        var req = require("request");

        /*var options = {method: 'GET',
            url: 'https://outlook.office.com/api/v1.0/me',
            headers:
                    {authorization: 'Bearer  ' + token.token.access_token,
                        'content-type': 'application/json'}};
                        */

        console.log("I have the token 1");
        console.log(request.sessionID);
        mongoLog.updateTokenfromSessionID(request.sessionID, token, response);

        //response.send( {'token': token});
    });
}

exports.getAuthUrl = getAuthUrl;
exports.getTokenFromCode = getTokenFromCode;
exports.getAccessTokenFn = getAccessTokenFn;

/*
 MIT License: 
 
 Permission is hereby granted, free of charge, to any person obtaining 
 a copy of this software and associated documentation files (the 
 ""Software""), to deal in the Software without restriction, including 
 without limitation the rights to use, copy, modify, merge, publish, 
 distribute, sublicense, and/or sell copies of the Software, and to 
 permit persons to whom the Software is furnished to do so, subject to 
 the following conditions: 
 
 The above copyright notice and this permission notice shall be 
 included in all copies or substantial portions of the Software. 
 
 THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND, 
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE 
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION 
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION 
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */