/*
 * Nose.JS Express WEB-server
 */
'use strict';

var express = require('express'),
    http    = require('http'),
    multer  = require('multer'),
    mailer  = require('express-mailer'),
    app     = express(),
    Logger  = require('./server/logger'),
    logger  = new Logger(),
    Router  = require('./server/router'),
    router  = new Router(),
    Simple  = require('./server/simple'),
    simple  = new Simple(),
    Helper  = require('./server/helpers'),
    helper  = new Helper();

mailer.extend( app, {
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'guestbook.noreply@gmail.com',
        pass: 'NJM52691612918g$'
    }
} );

var portName = 3000;

var bodyParser = require('body-parser');

app.use( multer({ dest: './server/views/files'}) );
app.use( bodyParser.json() );        // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

// Set Views location:
app.engine( 'html', simple.render );
app.set('view engine', 'html');
app.set('views', __dirname + '/server/views');

// Log all connections:
app.use( function(req, res, next ) {
    logger.getLog( req );
    next();
} );

// Route Content:
app.use( function( req, res, next ) {
    router.router( req, res, next );
} );

// Send Email with New Password:
app.post('/forgot', function (req, res, next) {
    var mail        = req.body.mail,
        newPass     = Math.floor( Math.random() * ( 9999998 - 1000001 ) + 1000001 );

    app.mailer.send('email', {
        to: mail,                                   // REQUIRED. This can be a comma delimited string just like a normal email to field.
        subject: 'Новый пароль для приложения Retro Radio:', // REQUIRED.
        pass:  newPass
    }, function (err) {
        if( err ) {
            // Handle error
            console.log(err);
            res.send( 'There was an error sending the e-mail' );
            return;
        }
        // Update DB:
        req.body.pass = newPass;
        db.forgotPassword( req, res );
    });
});

// Send Static Content:
app.use( express.static(__dirname) );
app.use( express.static(__dirname + '/server/views') );

// Create HTTP-server:
http.createServer( app ).listen( portName, startListen );

// On server Start:
function startListen() {
    console.log(' Server Run at ' + helper.getCurrentTime() + ' on port ' + portName );
}

