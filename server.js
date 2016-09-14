//Initialize the Express library, used to create a web server
var express = require("express");
var app = express();

// API endpoint to send email from the form

// TODO: Replace the Mailgun keys with env variables
var api_key = 'key-df7c40fe12d3f0306f54a33c70515c4c';
var domain = 'sandboxd02e96d4e7364311b49d334d6c380163.mailgun.org';
var mailgun = require('mailgun-js')( { apiKey: api_key, domain: domain } );
//var mailgun = require('mailgun-js')( { apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN } );

var bodyParser = require( 'body-parser' );
app.use( bodyParser.json() ); // for parsing application/json
app.use( bodyParser.urlencoded( { extended: true } )) ; // for parsing application/x-www-form-urlencoded

app.post('/mail', function(req,res) {
  mailgun.messages().send(req.body, function (error, body) {
    console.log(body);
    console.log(error);
    if ( !error && body.message == 'Queued. Thank you.' ) {
      res.status(200).send(body);
    } else {
      res.status(400).send(body);
    }
  });
});

//Tell the server to serve the contents of the client folder
app.use( express.static('client') );

//Turn on the web server listening on a specific port
app.listen( process.env.PORT || 8000 );
