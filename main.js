#!/usr/bin/env node

var domain = require('domain').create(),
    load = require('./lib/load.js');

/*
var http = require('http'),
var url = 'http://chideat.org/index.xml';

var html = ''

var request = http.get(url, function(response) {
    response.setEncoding('UTF-8');
    response.on('data', function(chunk) {
        html += chunk;
    })
    .on('end', function() {
        // analyse.analyse(html);
    });
});

request.on('err', function(error) {
    console.error('Problem with ' + url + ' request: ' + error.message);
});
*/


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
