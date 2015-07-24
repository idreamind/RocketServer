/*
 * Nose.JS Express WEB-server: MySQL
 */
'use strict';

var mysql   = require('mysql'),
    fs      = require('fs'),
    Helper  = require('./helpers'),
    pool    = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : '1234',
        database : 'tubegallery'
    }),
    isProduction = true;

function Controllers() {
    var ctrl = this;

    ctrl.getTemplate    = getTemplate;
    ctrl.getData        = getData;
    ctrl.makeUpload     = makeUpload;
    /*..... WRITE YOUR DECLARATION HERE */

//----------------------------------------------------------------------------------------------------------------------
    // Render Template:
    function getTemplate( req, res ) {
        connectionQuery_( res, 'SELECT SiteName FROM general', renderFile );

        function renderFile( res, rows ) {
            var row = rows[0];

            res.render( 'index', {
                hello:  row.SiteName
            } );
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    // Get Site General Data:
    function getData( req, res ) {
        connectionQuery_( res, 'SELECT * FROM general', getGeneral );

        function getGeneral( res, rows ) {
            res.send( rows[0] );
        }
    }
//----------------------------------------------------------------------------------------------------------------------
    // Upload a new file:
    function makeUpload( req, res ) {

        var file        = "files/" + repQuotes_( req.files.file.name ),
            fileType    = JSON.parse(req.body.data).fileType,
            first       = filterData_( JSON.parse(req.body.data).first ),
            second      = filterData_( JSON.parse(req.body.data).second ),
            third       = filterData_( JSON.parse(req.body.data).third ),
            insertStr   = "";

        switch ( fileType ) {
            case 'gallery':
                insertStr = "INSERT INTO gallery ( GalleryImgLink, GalleryTitle, GalleryDescription, GalleryAddition ) VALUES ( '" + file + "',  '" + first + "', '" + second + "', '" + third + "' )";
                queryUpdate_( insertStr, sendAnswer, res );
                break;
            case 'music':
                insertStr = "INSERT INTO music ( MusicLink, MusicTitle ) VALUES ( '" + file + "', '" + first + "' )";
                queryUpdate_( insertStr, sendAnswer, res );
        }

        function sendAnswer( rows, res ) {
            res.send( fileType );
        }
    }

//----------------------------------------------------------------------------------------------------------------------
    // Private:   ------------------------------------------------------------------------------------------------------
    // To query response:   --------------------------------------------------------------------------------------------
    function connectionQuery_( res, queryString, handler ) {
        pool.getConnection( function( err, connection ) {
            if( err ) {
                if( !isProduction ) {
                    connection.release();
                }
                console.log({"code" : 100, "status" : "Error in connection database"});
            }

            connection.query( queryString, function( err, rows ) {
                if( !isProduction ) {
                    connection.release();
                }
                if( !err ) handler( res, rows );
                connection.on('error', function( err ) {
                    res.json({"code" : 100, "status" : "Error in connection database"});
                });
            });
        });
    }

//----------------------------------------------------------------------------------------------------------------------
    // Replace Quotes:
    function repQuotes_( str ) {
        if( typeof str != "string" ) {
            return null;
        }
        return str.replace(/'/g,'\\\'').replace(/"/g,'\\\"').trim();
    }

    // Filter data:
    function filterData_( str ) {
        if( typeof str != "string" ) {
            return null;
        }
        return str.replace(/'/g, '\\\'').replace(/"/g,'\\\"').replace(/;/g, '').replace(/select/gi,'').replace(/union/gi,'').trim();
    }

    // Delete Quotes:
    function deleteQuotes_( str ) {
        if( typeof str != "string" ) {
            return null;
        }
        return str.replace(/'/g,'').replace(/"/g,'').trim();
    }

//----------------------------------------------------------------------------------------------------------------------
    // Function to Query a simple connection ( UPDATE ):
    function queryUpdate_( queryString, process, res ) {

        pool.getConnection( function( err, connection) {
            errorHandler( err );
            connection.query( queryString, handler );
        });

        function handler( err, rows ) {
            errorHandler( err );
            if( typeof process == "function" ) {
                process( rows, res );
            }
        }

        function errorHandler( err ) {
            if( err ) {
                if( !isProduction ) {
                    connection.release();
                }
                console.log( " Error in connection database" , err );
            }
        }
    }


// End: ----------------------------------------------------------------------------------------------------------------
    return ctrl;
}

//----------------------------------------------------------------------------------------------------------------------
module.exports = Controllers;
