#!/usr/bin/env node

var domain = require('domain').create(),
    load = require('./lib/load.js');

if (process.argv.length <= 2) {
    console.error('At least one argument is Need!');
    return 1;
}

domain.on('error', function(err){
    console.error(err.message);
});

//domain.run(function() {
    // analyse file
    for(var i = 2; i < process.argv.length; i ++) {
        load.load(process.argv[i])
    }
//});
