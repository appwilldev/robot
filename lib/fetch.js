var $ = require('jquery');

/**
 * data constains of web data
 * and root instracted what is need
 */
exports.analyse = function(data, root) {
    search_node = root;
    page = $(data);
    // for pages
    // end as null
    var target = Array('name', 'url', 'category', 'resolution');
    while(search_node) {
        for (i in target) {
            if (search_node[target[i]] == undefined) 
                continue;
            var result = search(data, search_node[target[i]].target);
            for (var i = 0; i < result.length; i++ ) {
                console.log(i, result[i]);
            }
        }
        search_node = search_node.child;
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
    console.log(selector);
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
