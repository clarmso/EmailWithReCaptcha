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

app.use(helmet());
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: [
      "'self'",
      'https://www.google.com/recaptcha/',
      'https://www.gstatic.com/recaptcha/',
    ],
    scriptSrc: [
      "'self'",
      'https://cdnjs.cloudflare.com',
      'https://maps.googleapis.com',
      'https://www.google-analytics.com',
      'https://ajax.googleapis.com',
      'https://www.google.com/recaptcha/',
      'https://www.gstatic.com/recaptcha/',
    ],
    styleSrc: [
      "'self'",
      'https://fonts.googleapis.com',
      'https://maps.googleapis.com/',
      'https://www.gstatic.com/',
      "'unsafe-inline'",
    ],
    imgSrc: [
      "'self'",
      'https://maps.googleapis.com',
      'https://maps.gstatic.com',
      'https://csi.gstatic.com'
    ],
    connectSrc: [
      "'self'",
      'ws://127.0.0.1:*/livereload',
    ],
    fontSrc: [
      "'self'",
      'https://themes.googleusercontent.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    mediaSrc: [
      "'none'",
    ],
    childSrc: [
      "'self'",
      'https://www.google.com/recaptcha/'
    ],
    sandbox: [
      'allow-forms',
      'allow-scripts',
      'allow-same-origin',
    ],
    formAction: [
      "'self'",
    ],
    objectSrc: [
      "'none'",
    ]
  }
}));
app.use(helmet.noCache());
app.use(helmet.referrerPolicy());
if ( process.env.NODE_ENV ) {
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

app.get('/', function(req, res, next) {
  console.log("Request from "+req.ip);
  next();
});

//Tell the server to serve the contents of the client folder
app.use( express.static('client') );

//Turn on the web server listening on a specific port
app.listen( process.env.PORT );
