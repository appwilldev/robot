var async = require('async'),
    http = require('http');

async.waterfall([
    function(callback) {
        http.get('http://www.baidu.com', function(res) {
            callback(null, res);
        });
    },
    function(arg, callback) {
        console.log("got response " + arg.statusCode);
        callback(null, arg);
    }
], function(err, res) {
    // console.log(err);
    res.setEncoding('UTF-8');
    res.on('data', function(chunk) {
        console.log(chunk);
    });
});

// var q = async.queue(function (task, callback) {
//     console.log('-- ' + task.name);
//     callback();
// }, 1);
// 
// q.push({name: 'baidu'}, function(err) {
//     console.log('finished processing bar ' + err);
// });
// 
// q.push({name: 'google'}, function(err) {
//     console.log('finished processing bar ' + err);
// });
// 
console.log('Http End');
