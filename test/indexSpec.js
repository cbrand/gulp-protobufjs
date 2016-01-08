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
            var fakeFile = new File({
                contents: new Buffer(protoBufData)
            });

            return withFileOptions(fakeFile, options);
        };

        var withFileOptions = function (file, options) {
            return Q.Promise(function (resolve, reject) {
                var plugin = gulpprotobuf(options);
                plugin.once('data', function (data) {
                    resolve(data);
                });
                plugin.once('error', function (err) {
                    reject(err);
                });
                plugin.write(file);
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

        it('should keep the correct path', function () {
            withFileOptions(new File({
                contents: new Buffer(protoBufData),
                path: '/this/is/a/test/path'
            }), {
                target: 'js'
            }).then(function (file) {
                file.path.should.equal('/this/is/a/test/path.js');
            });
        });

        var fileWithPath = function () {
            return new File({
                contents: new Buffer(protoBufData),
                path: '/this/is/a/test/path.proto'
            });
        };

        var executeWithTargetAndExpect = function (target, ext) {
            return withFileOptions(fileWithPath(), {
                target: target
            }).then(function (file) {
                file.path.should.endWith(ext);
            });
        };

        it('should set the correct extension for js', function () {
            return executeWithTargetAndExpect('js', '.proto.js');
        });

        it('should set the correct extension for json', function () {
            return executeWithTargetAndExpect('json', '.proto.json');
        });

        it('should set the correct extension for amd', function () {
            return executeWithTargetAndExpect('amd', '.proto.js');
        });

        it('should set the correct extension for commonjs', function () {
            return executeWithTargetAndExpect('commonjs', '.proto.js');
        });

        it('should set the correct extension for proto', function () {
            return executeWithTargetAndExpect('proto', '.proto');
        });

    });

    describe('when working with structures having multiple imports of the same file', function () {

        before(function () {
            basePath = path.resolve(__dirname + '/files/cyclic-dependency-check');
            protoBufPath = path.join(basePath, 'organization.proto');
            protoBufData = fs.readFileSync(protoBufPath).toString('utf-8');
        });

        it('should not return an error', function () {
            return Q.Promise(function (resolve, reject) {
                var fakeFile = new File({
                    contents: new Buffer(protoBufData),
                    path: protoBufPath,
                    base: basePath,
                    cwd : "/"
                });
                var plugin = gulpprotobuf({
                    path: basePath
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

    });

});
