var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
   service: "gmail",
   auth: {
       user: "guidepost.mobile",
       pass: "mobileguidepost"
   }
});

smtpTransport.sendMail({
   from: "Guidepost Team <guidepost.mobile@gmail.com>", // sender address
   to: "Bhu <shiv.bhuvanapalli@washpost.com>", // comma separated list of receivers
   subject: "Hello ✔", // Subject line
   text: "Hello world ✔" // plaintext body
}, function(error, response){
   if(error){
       console.log(error);
   }else{
       console.log("Message sent: " + response.message);
   }
});