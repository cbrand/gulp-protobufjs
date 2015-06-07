require('should');

var path = require('path');
var fs = require('fs');
var File = require('vinyl');
var gulpprotobuf = require('..');
var Q = require('q');

describe('index', function () {

    var basePath;
    var protoBufPath;
    var protoBufData;
    var jsonPath;
    var jsonData;

    before(function () {
        basePath = path.resolve(__dirname + '/files');
        protoBufPath = path.join(basePath, 'person.proto');
        protoBufData = fs.readFileSync(protoBufPath).toString('utf-8');
        jsonPath = path.join(basePath, 'imports.json');
        jsonData = fs.readFileSync(jsonPath).toString('utf-8');
    });

    it('should be able to parse a proto file', function () {
        return Q.Promise(function (resolve, reject) {
            var fakeFile = new File({
                contents: new Buffer(protoBufData)
            });
            var plugin = gulpprotobuf();
            plugin.write(fakeFile);
            plugin.once('data', function (file) {
                file.contents.toString('utf-8').should.startWith('module.exports');
                resolve();
            });
            plugin.once('error', function (err) {
                reject(err);
            });
        });
    });

    it('should be able to parse a json file', function () {
        return Q.Promise(function (resolve, reject) {
            var fakeFile = new File({
                contents: new Buffer(jsonData)
            });
            var plugin = gulpprotobuf({
                input: 'json'
            });
            plugin.write(fakeFile);
            plugin.once('data', function (file) {
                file.contents.toString('utf-8').should.startWith('module.exports');
                resolve();
            });
            plugin.once('error', function (err) {
                reject(err);
            });
        });
    });

    it('should throw an error if proto parsing fails', function () {
        return Q.Promise(function (resolve) {
            var fakeFile = new File({
                contents: new Buffer(jsonData)
            });
            var plugin = gulpprotobuf();
            plugin.once('error', function () {
                resolve();
            });
            plugin.write(fakeFile);
        });
    });

    it('should throw an error if json parsing fails', function () {
        return Q.Promise(function (resolve) {
            var fakeFile = new File({
                contents: new Buffer(protoBufData)
            });
            var plugin = gulpprotobuf({
                input: 'json'
            });
            plugin.once('error', function () {
                resolve();
            });
            plugin.write(fakeFile);
        });
    });

    describe('targets', function () {
        var withOptions = function (options) {
            return Q.Promise(function (resolve, reject) {
                var fakeFile = new File({
                    contents: new Buffer(protoBufData)
                });
                var plugin = gulpprotobuf(options);
                plugin.once('data', function (data) {
                    resolve(data);
                });
                plugin.once('error', function (err) {
                    reject(err);
                });
                plugin.write(fakeFile);
            });
        };

        it('should be able to export js data', function () {
            return withOptions({
                target: 'js'
            }).then(function (file) {
                file.contents.toString('utf-8').should.startWith('var _root');
            });
        });

        it('should be able to export amd data', function () {
            return withOptions({
                target: 'amd'
            }).then(function (file) {
                file.contents.toString('utf-8').should.startWith('define(["ProtoBuf"]');
            });
        });

        it('should be able to export protobuf data', function () {
            return withOptions({
                target: 'proto'
            }).then(function (file) {
                file.contents.toString('utf-8').should.startWith('package test;');
            });
        });

        it('should be able to export json data', function () {
            return withOptions({
                target: 'json'
            }).then(function (file) {
                file.contents.toString('utf-8').should.startWith('{');
            });
        });
    });

});
