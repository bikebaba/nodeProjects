/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
var sns = new AWS.SNS();


var endpointArn = "arn:aws:sns:us-east-1:311651137993:shivTopic";

var payload = {
  default: 'Hello World',
  APNS: {
    aps: {
      alert: 'Hello World',
      sound: 'default',
      badge: 1
    }
  }
};

// first have to stringify the inner APNS object...
payload.APNS = JSON.stringify(payload.APNS);
// then have to stringify the entire message payload
payload = JSON.stringify(payload);

console.log('sending push');
sns.publish({
  Message: payload,
  MessageStructure: 'json',
  TargetArn: endpointArn
}, function(err, data) {
  if (err) {
    console.log(err.stack);
    return;
  }

  console.log('push sent');
  console.log(data);
});