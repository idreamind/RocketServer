/**
 * Created by dreamind on 26.07.2015.
 * Global Config
 */

'use strict';

var Rocket = {
    port:   3000,
    views:  '/server/views',
    files:  './server/views/files',
    mail: {
        port:   465,
        host:   'smtp.gmail.com',
        method: 'SMTP',
        from:   'noreplay@email.com',
        auth: {
            user: 'guestbook.noreply@gmail.com',
            pass: 'NJM52691612918g$'
        }
    }
};

module.exports = Rocket;