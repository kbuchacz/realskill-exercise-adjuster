'use strict';
var Promise = require('bluebird');
var _ = require('lodash');
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
            config.devDependencies['grunt-protractor-runner'] = '4.0.0';
            config.devDependencies['grunt-protractor-webdriver'] = '0.2.5';
            config.devDependencies['protractor'] = '4.0.14';
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
        });
    })
}).then(function ()
{
    var bowerJson = request('GET', process.env.SCAFFOLDING + '/bower.json');
    if(404 != bowerJson.statusCode) {
        return fs.writeFileAsync(process.env.REPO_PATH + '/.bowerrc', request('GET', process.env.SCAFFOLDING + '/.bowerrc').getBody(), {}).then(function ()
        {
            console.info('.bowerrc overwriten');
        });
    } else {
        return Promise.resolve();
    }
}).then(function ()
{
    return fs.writeFileAsync(process.env.REPO_PATH + '/realskill.json', request('GET', process.env.SCAFFOLDING + '/realskill.json').getBody(), {}).then(function ()
    {
        console.info('realskill.json overwriten');
    });
}).then(function ()
{
    return fs.writeFileAsync(process.env.REPO_PATH + '/Gruntfile.js', request('GET', process.env.SCAFFOLDING + '/Gruntfile.js').getBody(), {}).then(function ()
    {
        console.info('Gruntfile.js overwriten');
    });
}).then(function ()
{
    return fs.writeFileAsync(process.env.REPO_PATH + '/.jshintrc', request('GET', process.env.SCAFFOLDING + '/.jshintrc').getBody(), {}).then(function ()
    {
        console.info('.jshintrc overwriten');
    });
}).then(function ()
{
    return fs.writeFileAsync(process.env.REPO_PATH + '/.gitattributes', request('GET', process.env.SCAFFOLDING + '/.gitattributes').getBody(), {}).then(function ()
    {
        console.info('.gitattributes overwriten');
    });
}).then(function ()
{
    return fs.writeFileAsync(process.env.REPO_PATH + '/.gitignore', request('GET', process.env.SCAFFOLDING + '/.gitignore').getBody(), {}).then(function ()
    {
        console.info('.gitignore overwriten');
    });
}).catch(function (err)
{
    console.error('Error: ', err);
});
