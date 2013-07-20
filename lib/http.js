var $ = require('jquery'),
    http = require('http');

headers = {'User-Agent': 
'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/28.0.1500.71 Safari/537.36'};

/**
 * grab the web page
 * need a call back to deal with the result
 * 
 * this function deals with headers, cookie and http/https
 */
exports.request = function(options, callback) {
    if (typeof callback != 'function')
        throw new Error('param of callback must be a function');
    if (options['hostname'] == undefined)
        throw new Error('options MUST contains url');
    try {
        if (! options['headers']['User-Agent'])
            options['headers']['User-Agent'] = headers['User-Agent'];
    }
    catch (err){
        options['headers'] = headers;
    }
    var req = http.get(options, callback);
    req.on('error', function(err) {
        throw new Error(err.message);
    });
    req.end();
    return req;
}
