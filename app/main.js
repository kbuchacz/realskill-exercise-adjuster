'use strict';
var Promise = require('bluebird');
var request = require('sync-request');
var fs = Promise.promisifyAll(require('fs'));
var glob = Promise.promisify(require('glob'));
var git = require('git');
/* global JSON, process */

fs.readFileAsync(process.env.REPO_PATH + '/package.json').then(function (data) {
    return glob(process.env.REPO_PATH + '/**/protractor.conf.js', {}).then(function (files) {
        var config = JSON.parse(data);
        config.scripts.test = 'grunt verify --force';
        if(0 < files.length) {
            config.scripts.postinstall = 'webdriver-manager update --standalone';
        }
        return fs.writeFileAsync(process.env.REPO_PATH + '/package.json', JSON.stringify(config, null, 2) + '\n', {}).then(function ()
        {
            if(0 < files.length) {
                return fs.writeFileAsync(files[0], fs.readFileSync(__dirname + '/protractor.conf.js'), {}).then(function ()
                {
                    console.info('protractor.conf.js overwriten');
                })
            }
        }).then(function ()
        {
            return fs.writeFileAsync(process.env.REPO_PATH + '/Gruntfile.js', request('GET', process.env.GRUNTFILE).getBody(), {}).then(function ()
            {
                console.info('Gruntfile.js overwriten');
            });
        });
    })
}).catch(function (err)
{
    console.error('Error: ', err);
});
