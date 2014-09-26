'use strict';

var _ = require('lodash');
var util = require('util');
var conf = require('./conf.js');
var parse = require('./parse.js');
var running = '[[ $(pm2 jlist) != "[]" ]]';

module.exports = {
    pm2_reload: function () {
        return util.format('%s && sudo pm2 reload all || echo "pm2 not started."', running);
    },
    pm2_start: function (name) {
        var defaults = {
            NODE_ENV: name
        };
        var user = conf('ENV');
        var env = {};

        // user can override NODE_ENV if need be
        _.assign(env, defaults, user);

        // if PM2_MODE is conf to 'fork', run pm2 with -x param: https://github.com/Unitech/PM2/issues/74
        // For Node v0.10.x the workaround is now to launch your script in "fork mode" by adding the -x parameter 
        var pmMode = "";
        if(conf('PM2_MODE') == 'fork'){
            pmMode = "-x"
        }
        return util.format('%s || sudo %s pm2 start %s/%s -i %s --name %s %s || echo "pm2 already started."',
            running, parse.toPairs(env), conf('SRV_CURRENT'), conf('NODE_SCRIPT'), conf('PM2_INSTANCES_COUNT'), name, pmMode
        );
    }
};