var $ = require('jquery')
    fs = require('fs'),
    fetch = require('./fetch.js'),
    utils = require('./utils.js'),
    parse = require('url').parse;

var print = console.log;
var conf = null;

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
}

Array.prototype.contains = function(element) {
    for (i in this) {
        if (this[i] === element)
            return true;
    }
    return false;
}

exports.load = function (path) {
    // check file 
    fs.exists(path, function(exists) {
        if (!exists)
            throw new Error('Script ' + path + ' NOT EXIST!');
        // read file
        fs.readFile(path, 'UTF-8', function(err, script) {
            if (err)
                throw err;
            if (script == null || script == '')
                return false;
            var dom = $(script);
            // config
            conf = config(dom.find('config'));
            conf['src'] = path;

            // here is hard to decide the mechanism
            // has child
            // until no child
            var root = {'id':'root'};
            root.node = dom.find('#root');
            var node = root;
            while (node.node.attr('child') != '') {
                if(dom.find('#' + node.node.attr('child')).attr('id') != node.node.attr('child'))
                    throw new Error('Child page ' + node.node.attr('child') + ' MISSING!');
                node.child = {}
                node.child.id = node.node.attr('child');
                node.child.node = dom.find('#' + node.node.attr('child'));
                node = node.child;
            }
            node.child = null;
            // print(root);

            // init pages argu
            node = root;
            while(node) {
                // init cookie
                node.headers = {'cookie':{}}
                if (node.node.attr('cookie') != 'cookie') {
                    node.node.find('cookie>tuple').each(function() {
                        node.headers.cookie[$(this.key).text()] = $(this.value).text();
                    });
                }

                // target
                // var target = Array('name', 'url', 'category', 'resolution');
                var target = Array('url', 'next');
                for (var i = 0; i < target.length; i++) {
                    var n = node.node.find(target[i]);
                    if (n == null || n.length == 0)
                        continue;
                    node[target[i]] = {};
                    // route
                    var r_c_a = route(n.find('route'));
                    if (r_c_a) {
                        node[target[i]]['target'] = r_c_a;
                    }
                    // convert
                    r_c_a = n.find('convert');
                    r_c_a = convert(r_c_a);
                    if (r_c_a)
                        node[target[i]]['convert'] = r_c_a;
                    // as
                    r_c_a = n.find('as');
                    if(r_c_a != undefined && r_c_a.text() != '')
                        node[target[i]]['as'] = r_c_a.text();
                }
                node = node.child;
            }
            // root
            fetch.enter(root, conf.url, conf);
        });
    });
}


function route(node) {
    if (node == null || node.length == 0)
        return null;
    var res = {'selector': null, 'attr':null};
    if (node.find('selector'))
        res['selector'] = node.find('selector').text();
    if (node.find('attr'))
        res['attr'] = node.find('attr').text();

    return res;
}

function convert(node) {
    if(node == null || node == undefined || node.length == 0)
        return null;
    if(node.get(0).tagName.toLowerCase() != 'convert')
        return null;
    var c = {};
    node.find('tuple').each(function(){
        c[$(this).find('from').text()] = $(this).find('to').text();
    });
    return c;
}

function config(node) {
    if(node == null || node == undefined || node.length == 0)
        return null;

    if(node.get(0).tagName.toLowerCase() != 'config')
        return null;
    var conf = {'action':'large'};
    // path
    node.find('path').each(function(){
        conf['path'] = $(this).text().trim();
    });
    // url
    node.find('url').each(function() {
        conf['url'] = $(this).text().trim();
    });
    if (conf['url'] == undefined || config['url'] == '') {
        throw new Error('URL is NEED');
    }

    // type
    // type:{'audio', 'image'}
    node.find('type').each(function(){
        conf['type'] = $(this).text().trim().toLowerCase();
        if(conf['type'] == 'image') {
            node.find('ratio').each(function(){
                // action
                // action:{'fix', 'large', 'small'}
                var action = Array('fix', 'large', 'small');
                if($(this).attr('action').toLowerCase().trim() != '')
                    conf['action'] = $(this).attr('action').toLowerCase().trim();
                if(! action.contains(conf['action'])) {
                    throw new Error('Error actoin type in ratio set in config section\n'
                    + "       action must be one in {'fix', 'large', 'small'}\n"
                    + "       the default action is 'large'");
                }
                conf['width'] = Number($(this).find('width').text());
                conf['height'] = Number($(this).find('height').text());
            });
        }
    });
    return conf;
}
