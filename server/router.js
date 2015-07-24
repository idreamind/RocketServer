/*
 * Nose.JS Express WEB-server: Router
 */
'use strict';

function Router() {
    var route  = this,
        Match  = require('./match'),
        match  = new Match(),
        routes = require('./routes'),
        Controllers = require('./controllers'),
        ctrl        = new Controllers();

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

module.exports = Router;