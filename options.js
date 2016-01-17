var targets = require('./targets');
var defaultFileExtensions = require('./defaultFileExtensions');

// Consts
const PLUGIN_NAME = 'gulp-protobufjs';

var gutil = require('gulp-util');

function PluginError(message, options) {
    return new gutil.PluginError(PLUGIN_NAME, message, options || {});
}

function verifyOptions(options) {
    options = options || {};
    var encoding = options.encoding || 'utf-8';
    var input = options.input || 'protobuf';
    var target = options.target || 'commonjs';
    var extension = options.ext || null;
    var noErrorReporting = options.noErrorReporting || false;
    var showStack = options.showStack || false;

    if (input !== 'protobuf' && input !== 'json') {
        throw new PluginError('Input option only accepts protobuf or json as parameter');
    }

    if (!(target in targets)) {
        throw new PluginError('Target ' + target + ' not found');
    }

    if (extension === null) {
        extension = defaultFileExtensions[target] || '.js';
    }

    options = {
        encoding: encoding,
        input: input,
        target: target,
        path: options.path,
        ext: extension,
        noErrorReporting: noErrorReporting,
        showStack: showStack
    };
    if (options.path !== undefined && !Array.isArray(options.path)) {
        options.path = [options.path];
    }

    return options;
}

module.exports = {
    verify: verifyOptions,
    pluginName: PLUGIN_NAME,
    PluginError: PluginError
};
