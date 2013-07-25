var $ = require('jquery'),
    http = require('httpsync'),
    utils = require('./utils.js'),
    parse = require('url').parse;


/**
 * module gateway
 */
exports.enter = function(node, url, conf) {
    if (node == null || url == null || url == '')
        return;
    console.log('Fetch from ' + url);
    while (true) {
        this.page(node, url, conf);
        url = nextPage(node, url, conf);
        global.gc();
        if (! url)
            break;
        console.log('\n-- Fetch page ' + url);
    }
    console.log('\nFetch End');
}


/**
 * find if Have next page
 * return: url of next page | null
 */
function nextPage(node, url, conf) {
    if (! url)
        return null;
    var options = {'url': fullUrl(url, conf), 'method': 'GET'};
    var req = http.request(options);
    var res = req.end();
    var result = search(res.data.toString(), node['next'].target);
    if (result.length == 0)
        return null;
    return fullUrl(result[0], conf);
}


/**
 * recursive
 */
exports.page = function(node, url, conf) {
    if (node == null || url == null || url == '')
        return;
    // do http request
    var options = {'url': fullUrl(url, conf), 'method': 'GET'};
    // may add some other options here

    var req = http.request(options);
    var res = req.end();
    var result = search(res.data.toString(), node['url'].target);
    if (node.child == null) {
        for (var j = 0; j < result.length; j++) {
            if (node.url.convert != undefined) {
                result[j] = convert(result[j], node.url.convert);
            }
            // console.log(fullUrl(result[j], conf))
            utils.out('wget ' + fullUrl(result[j], conf), conf);
        }
        return;
    }
    // sub page
    for (var j = 0; j < result.length; j ++) {
        this.page(node.child, result[j], conf);
    }
}


/**
 * complemented url 
 * return: full url
 */
function fullUrl(url, conf) {
    if (conf == null)
        return url;
    var res;
    if (parse(url).hostname == null) {
        // ends without slash
        res = parse(conf.url).hostname;
        if (parse(url).path != null) {
            if (url.indexOf('/') != 0) 
                res += '/';
             res += url;
        }
        else 
            // path is null
            // should never happen
            res += '/';
    }
    else 
        res = url;
    return res;
}


/**
 * it just do search job
 * according to the tagnames and the attrs
 * return: Array
 */
function search(data, target) {
    var result = new Array(),
        i = 0;
    // console.log(selector);
    $(data).find(target.selector).each(function(){
        if(target.attr != null)
            result[i++] = $(this).attr(target.attr);
        else 
            result[i++] = $(this).text(); 
    });
    return result;
}


/**
 * according to the convert section 
 * convert the tag to the final format
 * return: string
 */
function convert(data, target) {
    if (typeof target != 'object')
        return data;
    if (typeof data != 'string')
        throw new Error('can ONLY convert string, not ' + typeof data);
    // here to reg replacement
    for (var from in target) {
        data = data.replace(regExp(from), target[from]);
    }
    return data;
}

/**
 * convert string to regExp obj
 * return: regExp obj
 */
function regExp(str) {
    if (typeof str != 'string')
        return str;
    if (str.indexOf('/') == -1)
        return new RegExp(str,'g');
    var attr = str.slice(str.lastIndexOf('/') + 1, str.length);
    return new RegExp(str.slice(str.indexOf('/') + 1, str.lastIndexOf('/')), attr);
}
