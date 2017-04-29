// *** Express Server Setup ***

var express = require("express");
var app = express();

//Enable compression
var compression = require("compression");
app.use(compression());

// body-parser for the json
var bodyParser = require( 'body-parser' );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: true } ))


// *** Security ***

var express_enforces_ssl = require('express-enforces-ssl');
// Do not use SSL in the localhost because there's no certificate there.
if ( process.env.NODE_ENV ) {
  app.enable('trust proxy');
  app.use(express_enforces_ssl());
}
/*
var helmet = require('helmet');
app.use(helmet());
app.use(helmet.referrerPolicy());

var cors = require('cors');
var whitelist = [
    process.env.ALLOWED_ORIGIN,
];
var corsOptions = {
    origin: function(origin, callback){
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        console.log("Origin not allowed by CORS:" + origin);
        callback(new Error('Origin not allowed by CORS.  The origin is ' + origin), false);
      }
    },
    methods: "POST"
};
app.use(cors(corsOptions));
*/

// *** Mailgun ***

var mailgun = require('mailgun-js') ({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
} );


// *** reCAPTCHA ***

var recaptcha = require('express-recaptcha');
recaptcha.init( process.env.RECAPTCHA_SITE_KEY, process.env.RECAPTCHA_SECRET_KEY );


app.post('/mail', recaptcha.middleware.verify, function(req, res) {

  console.log("Received data:");
  console.log(req.body);
  console.log("Response from reCAPTCHA:");
  console.log(req.recaptcha);

  req.body.to = process.env.EMAIL;

  if ( req.recaptcha.error ) {
    console.log("Recaptcha Error");
    return res.status(403).send( { message: "Error From ReCAPTCHA: "+req.recaptcha.error.toString() } );
  }
  else {
    mailgun.messages().send( req.body, function sendReply (error, body) {
      console.log("Response from Mailgun:");
      console.log(body);
      if ( !error ) {
        console.log("Message Sent");
        return res.status(200).send( { message: "Your message has been sent." });
      }
      else {
        console.log("Cannot send message due to errors.");
        console.log(error);
        return res.status(404).send( { message: "Cannot send message due to server error." } );
      }
    });
  }
});

app.get('/', function(req, res) {
    res.send('I am alive! :)');
})

//Turn on the web server listening on a specific port
app.listen( process.env.PORT );
