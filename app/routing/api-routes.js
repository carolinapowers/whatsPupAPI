var nodemailer      = require('nodemailer');
var bodyParser      = require('body-parser');
var options         = require ('../credentials.js');
var hbs             = require('nodemailer-express-handlebars');
var smtpTransport   = require('nodemailer-smtp-transport');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var transporter     = nodemailer.createTransport(smtpTransport(options));

var handlebarOptions = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'app/routing/views/email/',
         defaultLayout : 'email_body',
         partialsDir : 'views/partials/'
     },
     viewPath: 'app/routing/views/email/',
     extName: '.hbs'
 };

module.exports = function(app){
  
	app.post('/api/email', function(req, res){         
        var mailOptions={
            to : req.body.to,
            subject : "New Visit Update from WhatsPup",
            text : req.body.text,
            template: 'email_body',
            context : {
                to: req.body.to,
                time: req.body.time,
                food: req.body.food,
                water: req.body.water,
                play: req.body.play,    
                treats: req.body.treats,
                meds: req.body.meds,
                message: req.body.message
            }
        }
        console.log(req.body);
        transporter.use('compile', hbs(handlebarOptions));
        
        transporter.sendMail(mailOptions, function(error, response){
            if(error){
                console.log('email error ', error);
                res.end("error");
            }else{
                console.log("Message sent: " + response);
                res.end("sent");
            }
        });
    });
}