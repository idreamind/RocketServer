/*
 * Test Template Server: Template Engine
 */
'use strict';

function Simple() {
    var simple = this,
        mode   = 'dev',
        tags   = ['{','}'],
        fs     = require('fs'),
        mod    = {
            developer:  'dev',
            production: 'prod'
            };

    simple.render  = render;
    simple.setMode = setMode;
    simple.getMode = getMode;

    function render( filePath, options, callback ) {
        fs.readFile( filePath, function( error, content ) {
            if( error ) {
                throw new Error( error );
            }
            if( options.length === 0 || typeof options !== "object") {
                throw new Error(' The second argument must not be null object. ');
            }

            var template = content.toString();
            for( var link in options ) {
                if (options.hasOwnProperty(link)) {
                    var value    = options[link],
                        mask     = tags[0] + link + tags[1];

                    while( template.search( mask ) != -1 ) {
                        template = template.replace( mask, value );
                    }
                }
            }

            if( mode === mod.production ) {
                template = template.replace( /{\S+}/gmi, '' );
            }

            if( typeof callback === "function" ) {
                return callback( null, template );
            } else {
                return template;
            }
        } );
    }

    function setMode( newMode ) {
        if( newMode && typeof newMode === "string" ) {
            mode = newMode;
        } else {
            throw new Error('Mode must be a string: [ dev, prod ]');
        }
    }

    function getMode() {
        return mode;
    }

    return simple;
}

module.exports = Simple;