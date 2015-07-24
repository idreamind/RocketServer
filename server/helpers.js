/*
 * Nose.JS Express WEB-server: Helpers
 */
'use strict';

function Helpers() {
    var help = this;

    help.pathType       = pathType;
    help.objToStr       = objToStr;
    help.getCurrentTime = getCurrentTime;

    // Know path type:  --------------------------------------------------------
    function pathType( path, types ) {

        if( typeof path != "string" || path.length < 1 ) {
            return 0;
        }

        path = path.toLowerCase();

        types = types || {
            js:     ['.js'],
            audio:  ['.mp3', '.ogg', '.wav'],
            image:  ['.png', '.jpg', '.jpeg', '.gif', '.svg'],
            css:    ['.css', '.scss', '.sass'],
            html:   ['.html'],
            map:    ['.map'],
            pdf:    ['.pdf'],
            cmd:    []
        };

        var keys    = Object.keys( types ),
            solve   = keys[ keys.length - 1 ];

        for( var type in types ) {
            if( types.hasOwnProperty(type) ) {
                if( type !== types.cmd ) {
                    types[type].forEach( function(a) {
                        var pattern = new RegExp( a + "$" );
                        if( path.search( pattern ) != -1 ) {
                            solve = type;
                        }
                    } );
                }
            }
        }

        return solve;
    }

    // Print object to string:
    function objToStr( obj ) {
        var reqStr = '<ul>';
        for( var prop in obj ) {
            if( obj.hasOwnProperty(prop) ) {
                reqStr += '<li>' + prop + ': ' + obj[prop];
            }
        }
        return reqStr + '</ul>';
    }

    // Get current time:
    function getCurrentTime( type ) {

        if( typeof type !== "string" || !type ) {
            type = 'all';
        }
        type = type.toLowerCase();

        var dateTime = new Date(),
            year  =  dateTime.getFullYear()     + '',
            month = (dateTime.getMonth() + 1)   + '',
            date  =  dateTime.getDate()         + '',
            hours =  dateTime.getHours()        + '',
            min   =  dateTime.getMinutes()      + '',
            sec   =  dateTime.getSeconds()      + '',
            milli =  dateTime.getMilliseconds() + '';

        month = ( month.length < 2 ) ? '0' + month : month;
        date  = ( date.length  < 2 ) ? '0' + date  : date;
        hours = ( hours.length < 2 ) ? '0' + hours : hours;
        min   = ( min.length   < 2 ) ? '0' + min   : min;
        sec   = ( sec.length   < 2 ) ? '0' + sec   : sec;
        milli = ( milli.length < 2 ) ? '0' + milli : milli;
        milli = ( milli.length < 3 ) ? '0' + milli : milli;

        var time = hours + ':' + min + ':' + sec + '.' + milli;

        if( type === 'time') {
            return time;
        }
        return year + '/' + month + '/' + date + ' ' + time;
    }

    return help;
}

module.exports = Helpers;