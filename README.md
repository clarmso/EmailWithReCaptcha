# Mailgun email REST API endpoint with reCAPTCHA

I wrote this server to send email to myself from my homepage's contact form.  This endpoint is implemented as an REST 
API endpoint.  My page sends an AJAX request to this endpoint.  It is written with the following in mind:
* My email address is not exposed.
* My Mailgun API is not exposed in the AJAX call.
* reCAPTCHA is used to mitigate abuse.
* Good SPF record.
* No PHP!!!!!
* Must run SSL.
* FREE :)

I have considered using the free tier of the following API, but none satisfies all of the above.
* formspree.io (Email exposed)
* Sendgrid (Not free)
* Mailgun (API key exposed)
* Own SMTP/IMAP server (SPF record?)

## Deploying the Endpoint

### Node.js

Yes, Node.js it is.

### Get a Heroku Account
The instructions are specific to Heroku.  The environment variables are Heroku-specific.  With some treaking, you may get 
the REST API endpoint to work in other services that can host a Node.js environemnt.

### Get a Mailgun API Key and Domain

Sign up for a free Mailgun account.  If you expect only a few people per month would contact you using the contact form,
the free tier should be more than enough.  Create a new sandbox domain.  Note the following two pieces of information after 
signing up: *API key* and *domain name*.  They can be found in the Mailgun's dashboard.

Optional: You may verify if the domain and API key are working by sending yourself an email using curl: 
https://documentation.mailgun.com/en/latest/quickstart-sending.html#send-via-api

### Get a ReCaptcha Site Key Pair

### Client

### Server
