var nodemailer      = require('nodemailer');
var bodyParser      = require('body-parser');
var options         = require ('../credentials.js');
var hbs             = require('nodemailer-express-handlebars');
var smtpTransport   = require('nodemailer-smtp-transport');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });
var transporter     = nodemailer.createTransport(smtpTransport(options));
var inlineBase64 = require('nodemailer-plugin-inline-base64');
var cloudinary = require ('cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUDNAME, 
  api_key: process.env.APIKEY, 
  api_secret: process.env.APISECRET 
});

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

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });
  
	app.post('/api/email', function(req, res){

        var imgUrl;   

        cloudinary.uploader.upload(req.body.image, function(result) { 
            imgUrl = result.url;
        });      
        
        var mailOptions={
            to : req.body.to,
            subject : 'New Visit Update from WhatsPup',
            text : req.body.text,
            template: 'email_body',
            attachments: {
                filename: "pup.jpg",
                content: req.body.imageString,
                encoding: 'base64',
                headers: 'Attachment:',
                cid: 'unique@node.ee',
                contentDisposition: 'inline' 
            },
            context : {
                to: req.body.to,
                time: req.body.time,
                food: req.body.food,
                water: req.body.water,
                play: req.body.play,    
                treats: req.body.treats,
                meds: req.body.meds,
                mess: req.body.mess,
                mail: req.body.mail,
                packages: req.body.packages,
                plants: req.body.plants,
                other: req.body.other,
                message: req.body.message,
                //image: req.body.image
                image: imgUrl
            }
        }

        transporter.use('compile', inlineBase64)
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