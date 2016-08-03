var pdfFiller   = require('pdffiller');

var sourcePDF = "/Users/bhuvanapalli/nodeProjects/pdf-filler/B6I_Template.pdf";
var destinationPDF =  "/Users/bhuvanapalli/nodeProjects/pdf-filler/B6I_Template_complete.pdf";
var shouldFlatten = false;
var data = {
    "Last_Name" : "John",
    "First_Name" : "Doe"
};

pdfFiller.fillForm( sourcePDF, destinationPDF, data, shouldFlatten, function(err) {
    if (err) throw err;
    console.log("In callback (we're done).");
});