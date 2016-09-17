//Initialize the Express library, used to create a web server
var express = require("express");
var https = require("https");
var app = express();

// API endpoint to send email from the form

var mailgun = require('mailgun-js')( { apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN } );
var bodyParser = require( 'body-parser' );
app.use( bodyParser.json() ); // for parsing application/json
app.use( bodyParser.urlencoded( { extended: true } )) ; // for parsing application/x-www-form-urlencoded

/* At the top, with other redirect methods before other routes */

app.get('*',function(req,res,next){
  if( process.env.NODE_ENV == 'production' && req.headers['x-forwarded-proto'] != 'https')
    res.redirect( 'https://' + req.headers.host + req.url )
  else
    next() /* Continue to other routes if we're not redirecting */
})


app.post('/mail', function(req,res) {
  req.body.to = process.env.EMAIL;
  mailgun.messages().send(req.body, function (error, body) {
    console.log( "Response from mailgun: " + body.message );
    console.log( "Response from mailgun: " + body.id );
    if ( !error && body.message == 'Queued. Thank you.' ) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  });
});

//Tell the server to serve the contents of the client folder
app.use( express.static('client') );

//Turn on the web server listening on a specific port
app.listen( process.env.PORT );
