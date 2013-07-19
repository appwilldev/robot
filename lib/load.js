var $ = require('jquery')
    fs = require('fs'),
    fetch = require('./fetch.js'),
    http = require('./http.js');

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
                var target = Array('name', 'url', 'category', 'resolution');
                for (var i in target) {
                    var n = node.node.find(target[i]);
                    if (n == null)
                        continue;
                    node[target[i]] = {};
                    // route
                    var r_c_a = element(n.find('route'));
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
            var options = {
                hostname: conf.url,
                method: 'GET'
            };
            request = http.request(options, function(res) {
                res.setEncoding('UTF-8');
                var data = ''
                res.on('data', function(chunk) {
                    data += chunk;
                }).on('end', function() {
                    fetch.analyse(data);
                });
            });
        });
    });
}


function element(node) {
    if (node == null || node == '' || node.html() == undefined)
        return null;
    var tmp = res = {'tagName': null, 'attr':{}, 'index': 0, 'next': null};
    var target = null;
    try {
        if (node.length >= 0){
            target = node.text().trim().match(/\[.*\]/g)[0].slice(1, -1);
            node = node.children();
        }
    }
    catch (err) {
        throw new Error('The target attr is not in the correct format\n'
         + 'Please use [attr]');
    }
    // {tag:div, attr:{key:value,key:value}, index:0, target: null,  next:null}
    while(node.length > 0) {
        tmp['tagName'] = node.get(0).tagName;
        $(node.get(0).attributes).each(function() {
            if (this.nodeName == 'index')
                tmp.index = this.nodeValue;
            else
                tmp.attr[this.nodeName] = this.nodeValue;
        });
        node = node.children();
        if(node.length > 0){
            tmp.next = {'tagName': null, 'attr':{}, 'index': 0, 'next': null};
            tmp = tmp.next;
        }
    }
    tmp['target'] = target;
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
