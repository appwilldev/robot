var $ = require('jquery')
    fs = require('fs'),
    http = require('http');

var print = console.log;

exports.analyse = function (path) {
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
            root.url = dom.find('#root').attr('url');
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
                // name
                var name = node.node.find('name');
                element(name.find('route'));

                node = node.child;
            }
        });
    });
}

function element(node) {
    if (node == null || node == '' || typeof node.children() == 'undefined') 
        return null
    node.children().each(function() {
        print($(this).attr('id'));
        print($(this).get(0).tagName);
        $($(this).get(0).attributes).each(function() {
            console.log(this.nodeName + ':' + this.nodeValue);
        });
    });
}
