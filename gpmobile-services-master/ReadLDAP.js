console.log("Start Mongo Connection");
//exports.handler = function(event, context) {
    var request = require("request");

    var options = {method: 'GET',
        url: 'http://localhost:3300/getldapjson',
        headers:
                {'postman-token': '8a0de27b-18d4-e167-0b16-0577e62fc3b2',
                    'cache-control': 'no-cache'}};

    request(options, function(error, response, body) {
        if (error)
            throw new Error(error);

            var request2 = require("request");

            var options2 = { method: 'POST',
              url: 'http://localhost:3300/postldapjson',
              headers: 
               { 'content-type': 'application/json' },
              body: body,
              json: true };

            request2(options, function (error2, response2, body2) {
              if (error2) throw new Error(error2);

              //console.log(body2);
            });



        console.log("body");
    });

//};
