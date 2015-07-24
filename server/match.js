/*
 * Nose.JS Express WEB-server: match
 */
'use strict';

function Match() {
    var match   = this,
        routes_ = {},
        store_  = {};

    // Methods:
    match.getHandler    = getHandler;
    match.setRoutes     = setRoutes;
    match.getRoutes     = getRoutes;
    match.restoreRoutes = restoreRoutes;

    // Redeclaration:
    match.toString = toString;

    // Get Handler by Path:
    function getHandler( path ) {
        if( typeof  path === "string" ) {
            var handler = routes_[path];
            if (handler) {
                return handler;
            }
        }
        return undefined;
    }

    // Set new Handlers Array:
    function setRoutes( handlers ) {
        if( typeof handlers === "object" ) {
            store_    = Object.create( routes_);
            routes_ = Object.create( handlers );
        }
    }

    // Set get Handlers Array:
    function getRoutes() {
        return routes_;
    }

    // Set previous Handlers Array
    function restoreRoutes() {
        routes_ = Object.create(store_);
    }

    // To String Current Handlers Array:
    function toString() {
        var str = "";
        for( var r in routes_ ) {
            if( routes_.hasOwnProperty(r) ) {
                str += r + "   " + routes_[r] + "\\n";
            }
        }
        return str;
    }

    return match;
}

module.exports = Match;
