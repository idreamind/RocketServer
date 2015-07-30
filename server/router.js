/*
 * Nose.JS Express WEB-server: Router
 */
'use strict';

function Router() {
    var route  = this,
        match  = require('./match'),
        routes = require('./routes'),
        ctrl   = require('./controllers');

    match.setRoutes( routes );

    route.router = router;

    function router( req, res, next ) {
        var handler = match.getHandler( req.path );

        if( handler && ctrl.hasOwnProperty(handler) ) {
            ctrl[handler]( req, res );
        } else {
            next();
        }
    }

    return route;
}

module.exports = new Router();