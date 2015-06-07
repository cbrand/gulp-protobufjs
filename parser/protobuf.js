/**
 * Basic logic borrowed from the pbjs implementation.
 *
 * https://github.com/dcodeIO/ProtoBuf.js/blob/master/cli/pbjs/sources/proto.js
 */
var fs = require('fs');
var path = require('path');
var nodePath = path;
var ProtoBuf = require('protobufjs');
var util = require('protobufjs/cli/pbjs/util');

var optionsHandler = require('../options');
var parseProtobufString;
var parseProtobuf;

parseProtobuf = function (protoBufPath, options, loaded) {
    options = optionsHandler.verify(options);
    protoBufPath = path.resolve(protoBufPath);
    var data = fs.readFileSync(protoBufPath, options.encoding || 'utf-8');
    return parseProtobufString(data, options, loaded);
};

parseProtobufString = function (protoBufString, options, loaded) {
    options = optionsHandler.verify(options);
    var parser = new ProtoBuf.DotProto.Parser(protoBufString);
    var data = parser.parse();
    loaded = loaded || {};
    if (Array.isArray(data.imports)) {
        var imports = data.imports;
        for (var i = 0; i < imports.length; i++) {
            // Skip pulled imports and legacy descriptors
            if (typeof imports[i] !== 'string' || (util.isDescriptor(imports[i]) && !options.legacy)) {
                continue;
            }
            // Merge imports, try include paths
            var fileFound = false;
            var path = options.path || [];
            for (var j = 0; j < path.length; ++j) {
                var importFilename = nodePath.resolve(path[j] + '/', imports[i]);
                if (!fs.existsSync(importFilename)) {
                    continue;
                }
                imports[i] = parseProtobuf(importFilename, options, loaded);
                fileFound = true;
                break;
            }
            if (!fileFound) {
                throw Error('File not found: ' + imports[i]);
            }

        }
    }
    return data;
};

module.exports = {
    parse: parseProtobuf,
    parseString: parseProtobufString
};
