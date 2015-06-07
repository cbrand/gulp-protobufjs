/**
 * Parser from pbjs for outputing parsed data.
 */

var requireProtobufTarget = function(targetName) {
    return require('protobufjs/cli/pbjs/targets/' + targetName);
};
var parsers = {
    amd: requireProtobufTarget('amd'),
    commonjs: requireProtobufTarget('commonjs'),
    js: requireProtobufTarget('js'),
    json: requireProtobufTarget('json'),
    proto: requireProtobufTarget('proto')
};

module.exports = parsers;
