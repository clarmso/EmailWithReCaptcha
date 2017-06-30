# Mailgun email REST API endpoint with reCAPTCHA

I wrote this server to send email to myself from my homepage's contact form.  
This endpoint is implemented as an REST API endpoint.  My page sends an AJAX
request to this endpoint.  It is written with the following in mind:
* My email address is not exposed.
* My Mailgun API is not exposed in the AJAX call.
* reCAPTCHA is used to mitigate abuse.
* Good SPF record.
* No PHP!!!!!
* Must run SSL.
* FREE :)

I have considered using the free tier of the following API, but none satisfies
all of the above.
* formspree.io (Email exposed)
* Sendgrid (Not free)
* Mailgun (API key exposed)
* Own SMTP/IMAP server (SPF record?)
* Google Forms (Ugly)

## Deploying the Endpoint

### Node.js

Yes, Node.js it is.  I have Node 6.10.2 running.  It was first worked on under
Node 4.x.  If nothing goes wrong, it should work under other versions of Node.

### Get a Heroku Account

The instructions are specific to Heroku.  The environment variables are
Heroku-specific.  With some treaking, you may get the REST API endpoint to
work in other services that can host a Node.js environemnt.

### Get a Mailgun API Key and Domain

Sign up for a free Mailgun account.  If you expect only a few people per
month would contact you using the contact form, the free tier should be more
than enough.  Create a new sandbox domain.  Note the following two pieces of
information after signing up: *API key* and *domain name*.  They can be found
in the Mailgun's dashboard.

Optional: You may verify if the domain and API key are working by sending
yourself an email using curl:
https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-via-api

### Get a reCAPTCHA Site/Secret Key Pair

Get a pair of reCaptcha keys from Google: https://www.google.com/recaptcha/.
It does not really matter if the type is reCAPTCHA v2 or Invisible reCAPTCHA.
I worked on the endpoint before the invisible one became available to the
public.  Eventually, I started to use the invisible reCAPTCHA instead of
reCAPTCHA v2.  That said, the endpoint should work for both versions.

### Client

From the form, you need to construct an AJAX call that includes the name,
email and a message.  Please see form.html for an example.  Replace the
"data-sitekey" of the button by the reCAPTCHA *site key* (not secret key).
Replace <Your host> of the AJAX call to the name of your server.

### Server

Under the Settings > Config Variables, add the following Config Vars:
* ALLOWED_ORIGIN - The URL of your contact page.
* ALTERNATE_ALLOWED_ORIGIN - Another URL of your contact page.  Maybe localhost for testing.
* EMAIL - The "to" field of the emails.
* MAILGUN_API_KEY - API key from Mailgun.
* MAILGUN_DOMAIN - Domain name of the particular API key from Mailgun.
* RECAPTCHA_SECRET_KEY - Secret key from reCAPTCHA.
* RECAPTCHA_SITE_KEY - Site key from reCAPTCHA.  This is the one to be included
  in the client-side.

If you are testing locally, you should include the config vars above in a
.env file.  Please find the sample .env file "ExampleEnv".

Deploy to Heroku and you should be all set!

## Testing the endpoint

### /

If the server is up, "I am alive! :)" is displayed.  Nothing more.

### /cors

This endpoint tests the CORS (Cross-Origin Resource Sharing) policy used by the
mail/ endpoint.  The policy only allows HTTP POST request from ALLOWED_ORIGIN
and ALTERNATE_ALLOWED_ORIGIN.  If you access this endpoint from the web
browser, you should get an "Internal Server Error" message.  (Note that such a
   request from the browser is an HTTP GET request.)

### /test

This endpoint displays the test form "form.html".  It should look like the following:

![Screenshot of sample form](https://github.com/clarmso/EmailWithReCaptcha/blob/master/SampleForm.png)
