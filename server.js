//Initialize the Express library, used to create a web server
var express = require("express");
var https = require("https");
var app = express();

// Set up mailgun to send email. body-parser is required for the json format.
var mailgun = require('mailgun-js') ({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
} );
var bodyParser = require( 'body-parser' );
app.use( bodyParser.json() ); // for parsing application/json
app.use( bodyParser.urlencoded( { extended: true } )) ; // for parsing application/x-www-form-urlencoded


// Set up reCAPTCHA to prevent abuse of the mail form
var recaptcha = require('express-recaptcha');
recaptcha.init( process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY );

/* At the top, with other redirect methods before other routes */

app.get('*',function(req,res,next){
  if( process.env.NODE_ENV == 'production' && req.headers['x-forwarded-proto'] !== 'https' )
    res.redirect( 'https://' + req.headers.host + req.url );
  else
    next() /* Continue to other routes if we're not redirecting */
})

app.post('*', function(req, res, next) {
  if( process.env.NODE_ENV == 'production' && req.headers['x-forwarded-proto'] !== 'https' )
    return res.status(403).send( { message: 'SSL required' } );
  else
    next() /* Continue to other routes if we're not redirecting */
});

app.post('/mail', recaptcha.middleware.verify, function(req, res) {

  console.log( "Received data: ");
  console.log(req.body);

  console.log( "Response from reCAPTCHA: ");
  console.log( req.recaptcha );

  req.body.to = process.env.EMAIL;

  if ( req.recaptcha.error ) {
    return res.status(403).send( { message: req.recaptcha.error.toString() } );
  }
  else {
    mailgun.messages().send( req.body, function sendReply (error, body) {
      console.log( "Response from Mailgun: ");
      console.log( body );
      if ( !error ) {
        return res.status(200).send( { message: 'Your message has been sent' } );
      }
      else {
        return res.status(404).send( { message: error.toString() } );
      }
    });
  }
});

//Tell the server to serve the contents of the client folder
app.use( express.static('client') );

//Turn on the web server listening on a specific port
app.listen( process.env.PORT );
