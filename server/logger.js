/*
 * Nose.JS Express WEB-server: Logger
 */
'use strict';

var Helper  = require('./helpers'),
    helper  = new Helper(),
    ip      = require('request-ip');

function Logger() {

    var log      = this,
        colWidth = 16,
        colTime  = 27;

    log.getLog      = getLog;
    log.logToFile   = logToFile;

    // Create log string:
    function getLog( req  ) {

        var dateTimeStr = helper.getCurrentTime(),
            ipAddress   = ip.getClientIp(req),
            logArr      = [
                req.hostname,
                ipAddress,
                dateTimeStr,
                helper.pathType( req.path ),
                req.path
            ];

        var logStr = logArr.reduce( createStr_, "" );

        log.logToFile( logStr );
    }

    // Write log string to file:
    function logToFile( str ) {
        console.log( 'http://%s', str );
    }

    // Create string:
    function createStr_( prevStr, str, i ) {

        if( typeof str !== "string" ) {
            return;
        }

        var width = colWidth;
        if( i == 2 ) {
            width = colTime;
        }

        while( width > str.length ) {
            if( width > str.length ) {
                str = str + " ";
            }
        }

        return prevStr + str;
    }

    return log;
}

module.exports = Logger;