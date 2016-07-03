
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express(); 
var PORT = process.env.PORT || 8080; 
var cors = require ('cors');
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

require('./app/routing/api-routes.js')(app); 

app.listen (PORT, function () {
	console.log("Listening to app at port %d", PORT);
})

