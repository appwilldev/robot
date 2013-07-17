var jQuery = require('jquery')
    fs = require('fs');

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
            var dom = jQuery(script);
            // here is hard to decide the mechanism
            dom.find('interface').each(function(){
                
            });
        });
    });
}
