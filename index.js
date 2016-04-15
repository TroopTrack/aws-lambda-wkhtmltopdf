var wkhtmltopdf = require('wkhtmltopdf');
var fs = require('fs');
var AWS = require('aws-sdk');
var config = require('./config.js');

var s3 = new AWS.S3();

var generateRandomFilename = function() {
  return Math.random().toString(36).slice(2) + '.pdf';
};

var toPDF = function toPDF(event, context) {
  if (!event.html) {
    context.done("Couldn't get html", {});
    return;
  }

  var outputFilename = "/tmp/" + generateRandomFilename();
  var writeStream = fs.createWriteStream(outputFilename);
  wkhtmltopdf(
    event.html,
    config.settings,
    toS3(config, outputFilename, context)
  ).pipe(writeStream);
};

var completePut = function(outputFilename, context) {
  return function(err, data) {
    if (err) context.done(err, {});
    else     context.done({ filename: outputFilename });
  };
};

var toS3 = function(config, outputFilename, context) {
  return function() {
    s3.putObject({
      Bucket: config.bucket,
      Key: outputFilename,
      Body: fs.createReadStream(outputFilename),
      ContentType: "application/pdf"
    }, completePut(outputFilename, context));
  };
};

exports.handler = toPDF;
