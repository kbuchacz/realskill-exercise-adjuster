'use strict';
var fs = require('fs');
var glob = require("glob");
/* global JSON */

fs.readFile(__dirname + '/package.json', function (err, data) {
    if (err) {
        throw err;
    }

    glob("**/*.js", options, function (er, files) {
        var config = JSON.parse(data);
        console.log(files);
        console.log(config);
    });
});
