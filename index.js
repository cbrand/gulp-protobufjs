var path = require('path');
var through = require('through2');
var Q = require('q');
var ProtoBuf = require('protobufjs');
var util = require('protobufjs/cli/pbjs/util');
var File = require('vinyl');

var optionsHandling = require('./options');
var targets = require('./targets');
var jsonParser = require('./parser/json');
var protobufParser = require('./parser/protobuf');

var PluginError = optionsHandling.PluginError;

// Plugin level function(dealing with files)
function gulpProtobufJs(options) {
    options = optionsHandling.verify(options);

    // Creating a stream through which each file will pass
    return through.obj(function (file, enc, cb) {
        var self = this;
        if (file.isNull()) {
            // return empty file
            cb(null, file);
            return;
        }

        Q.Promise(function (resolve) {
            if (file.isBuffer()) {
                resolve(file.contents);
            }
            if (file.isStream()) {
                var bufs = [];
                file.contents.on('data', function (d) {
                    bufs.push(d);
                });
                file.contents.on('end', function () {
                    resolve(Buffer.concat(bufs));
                });
            }
        }).then(function (buffer) {
            return buffer.toString(options.encoding);
        }).then(function (protobufString) {
            if (options.input === 'protobuf') {
                return protobufParser.parseString(protobufString, options);
            } else if (options.input === 'json') {
                return jsonParser.parseString(protobufString, options);
            }
            throw new PluginError('input ' + options.input + ' not found.');
        }).then(function (jsonData) {
            var builder = ProtoBuf.newBuilder(util.getBuilderOptions(options, 'using'));
            ProtoBuf.loadJson(jsonData, builder, file.name);
            return builder;
        }).then(function (builder) {
            return targets[options.target](builder, options);
        }).then(function (buildData) {

            var filePath = file.path;
            var dirName = file.base;
            var fileName;
            if (filePath) {
                fileName = path.basename(filePath, options.ext);
                filePath = path.join(dirName, fileName + options.ext);
            }


            return new File({
                cwd: file.cwd,
                base: file.base,
                path: filePath,
                contents: new Buffer(buildData)
            });
        }).then(function (newFile) {
            cb(null, newFile);
        }).catch(function (err) {
            self.emit(
                'error',
                PluginError(err, { showStack: true, error: err }),
                file
            );
        });

    });

}

// Exporting the plugin main function
module.exports = gulpProtobufJs;
