var fs = require('fs'),
crypto = require('crypto');

String.prototype.mime = function() {
    for (i = this.length - 1; i >=0; i --) {
        if (this[i] == '.') 
            return this.slice(i, this.length);
    return null;
    }
}

Array.prototype.contains = function(element) {
    for (i in this) {
        if (this[i] === element) 
            return true;
    }
    return false;
}


/**
 * check the store envirenment
 */
exports.initStore = function(conf) {
    if (conf.path == undefined) {
        conf['path'] = './data/';
        var start = conf.src.lastIndexOf('/');
        start = start == -1 ? 0 : start;
        var end = conf.src.lastIndexOf('.');
        end = end === -1 ? 0 : end;
        // ignore start > end
        conf.path += conf.src.slice(start, end) + '.sh';
    }
    
    try {
        if (! fs.existsSync(conf.path)) {
            // create and return fd
         }
    }
    catch (err) {
    }
}


var MIME_TYPE = new Array(
    'image/jpg',
    'image/pjpeg',
    'image/jpeg',
    'image/bmp',
    'image/x-png',
    'image/png',
    'image/gif',
    'jpg',
    'jpeg',
    'x-png',
    'png',
    'gif'
);

/**
 * this function used to filter media type and 
 * if media is image, the same to image size
 */
exports.filter = function(conf, media, mime) {
    // must set global variable conf
    if (conf == undefined && typeof conf != 'object') 
        throw new Error('No conf section found');
    // mime
    if (typeof mime == 'boolean' && mine)
        if (! MIME_TYPE.contains(media['mime']))
            return false;
    console.log(media);
    // image size check
    if (media['height'] >= conf['height'] && media['width'] >= conf['width'])
        return true;
    return false;
}

exports.out = function(data, conf) {
    process.stdout.write('.');
    data = data + '\n';
    var fd = fs.openSync(conf.path, 'a');
    var count = 0;
    do {
        data = data.slice(count, data.length);
        count = fs.writeSync(fd, data, 0, 'utf-8'); 
    } while( count < data.length);
    fs.closeSync(fd);
}


exports.log = function(arg) {

}
