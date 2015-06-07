var targets = require('./targets');

// Consts
const PLUGIN_NAME = 'gulp-protobufjs';

var gutil = require('gulp-util');

function PluginError(message) {
    return new gutil.PluginError(PLUGIN_NAME, message);
}

function verifyOptions(options) {
    options = options || {};
    var encoding = options.encoding || 'utf-8';
    var input = options.input || 'protobuf';
    var target = options.target || 'commonjs';
    if (input !== 'protobuf' && input !== 'json') {
        throw new PluginError('Input option only accepts protobuf or json as parameter');
    }

    if (!(target in targets)) {
        throw new PluginError('Target ' + target + ' not found');
    }

    options = {
        encoding: encoding,
        input: input,
        target: target,
        path: options.path
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
