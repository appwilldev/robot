var fs = require('fs');

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


exports.out = function(list) {

}

exports.log = function(arg) {

}
