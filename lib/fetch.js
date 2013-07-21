var $ = require('jquery'),
    http = require('httpsync'),
    parse = require('url').parse;

/**
 * data constains of web data
 * and root instracted what is need
 */
exports.analyse = function(data, root, conf) {
    search_node = root.child;
    page = $(data);
    var result = null;
    // for pages
    // end as null
    // var target = Array('name', 'url', 'category', 'resolution');
    var target = Array('url');
    // currently, just consider of url
    if (root) {
        for (var i = 0;i < target.length; i ++) {
            if (root[target[i]] == undefined)
                continue;
            result = search(data, root[target[i]].target);
            if (root.child != null) {
                for (var j = 0; j < result.length; j++) {
                    subPage(root.child, result[j], conf);
                }
            }
            else {
                for (var j = 0; j < result.length; j++) {
                    console.log(result[j]);
                }
            }
        }
    }
}

/**
 * recursive
 */
function subPage(node, url, conf) {
    if (node == null || url == null || url == '')
        return;
    // do http request
    var options = {};
    if (parse(url).hostname == null) {
        // ends without slash
        options['url'] = parse(conf.url).hostname;
        if (parse(url).path != null) {
            if (url.indexOf('/') != 0)
                options['url'] += '/'; 
            options['url'] += url;
        }
        else
            // path is null
            // should never happen
            options['url'] += '/';
    }
    else 
        options['url'] = url;
    options['method'] = 'GET';

    var req = http.request(options);
    var res = req.end();
    result = search(res.data.toString(), node['url'].target);
    // next page
    node = node.child;
    if (node == null) {
        for (var j = 0; j < result.length; j++) {
            console.log(result[j])
        }
        return;
    }
    for (var j = 0; j < result.length; j ++) {
        subPage(node, result[j], conf);
    }
}


/**
 * it just do search job
 * according to the tagnames and the attrs
 */
function search(data, target) {
    // generate selector statement
    var t = target,
        selector = '';
    while(true) {
        // id first, if has id, ignore attrs and tag
        if (t.attr['id'] != undefined) {
            selector += '#' + t.attr['id'];
        }
        else {
            selector += t.tagName;
            if(t.attr['class'] != undefined)
                selector += '.' + t.attr['class'];
            for (var i in t.attr) {
                if ( i == 'class')
                    continue;
                selector += '[' + i;
                if (t.attr[i] != '')
                    selector += '=' + t.attr[i];
                selector += ']';
            }
            if (t.index != -1)
                selector += ':eq(' + t.index + ')';
        }
        // descendant
        if (t.next == null)
            break;
        selector += ' ';
        t = t.next;
    }
    var result = new Array(),
        i = 0;
    // console.log(selector);
    $(data).find(selector).each(function(){
        if(t.target != null)
            result[i++] = $(this).attr(t.target);
        else 
            result[i++] = $(this).text(); 
    });
    return result;
}


/**
 * according to the convert section 
 * convert the tag to the final format
 */
function convert(data, target) {
    if (typeof target != 'object')
        return data;
    // here to reg replacement
    for (from in target) {



    }
}
