//Initialize the Express library, used to create a web server
var express = require("express");
var app = express();

//Tell the server to serve the contents of the client folder
app.use(express.static('client'));

//Turn on the web server listening on a specific port
app.listen(process.env.PORT || 8000);