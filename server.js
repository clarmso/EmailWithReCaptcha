//Initialize the Express library, used to create a web server
var express = require("express");
var app = express();

// Set up mailgun to send email. body-parser is required for the json format.
var mailgun = require('mailgun-js') ({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
} );

// body-parser for the json
var bodyParser = require( 'body-parser' );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ))

// Set up reCAPTCHA to prevent abuse of the mail form
var recaptcha = require('express-recaptcha');
recaptcha.init( process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY );

// Security
// Do not use SSL in the localhost because there's no certificate there.
var helmet = require('helmet');
var express_enforces_ssl = require('express-enforces-ssl');
if ( !process.env.LOCAL ) {
  app.use(helmet());
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'oss.maxcdn.com', 'www.google.com',
        'cdnjs.cloudflare.com', 'aps.googleapis.com'],
    }
  }))
  app.use(helmet.noCache());
  app.use(helmet.referrerPolicy());
  app.enable('trust proxy');
  app.use(express_enforces_ssl());
}

app.post('/mail', recaptcha.middleware.verify, function(req, res) {

  console.log( "Received data: ");
  console.log( req.body );

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
