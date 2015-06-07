/**
 * Most of the stuff borrowed from the original pbjs sources implementation
 * https://github.com/dcodeIO/ProtoBuf.js/blob/master/cli/pbjs/sources/json.js
 *
 * @type {*|exports|module.exports}
 */

var fs = require('fs');
var ProtoBuf = require('protobufjs');
var util = require('protobufjs/cli/pbjs/util');

/**
 * pbjs source: Plain JSON descriptor
 * @exports pbjs/sources/json
 * @function
 * @param {string} filename Source file
 * @param {!Object.<string,*>=} options Options
 * @returns {!ProtoBuf.Builder}
 */
var json = function (filename, options) {
    options = options || [];
    var builder = ProtoBuf.newBuilder(util.getBuilderOptions(options, 'using'));
    var data = json.load(filename, options);
    ProtoBuf.loadJson(data, builder, filename);
    return builder;
};

var description = 'Plain JSON descriptor';

/**
 * Module description.
 * @type {string}
 */
json.description = description;

/**
 * Loads a JSON descriptor including imports.
 * @param {string} filename Source file
 * @param {!Object.<string,*>} options Options
 * @returns {*} JSON descriptor
 */
json.load = function (filename, options) {
    var data = fs.readFileSync(filename).toString('utf-8');
    return json.loadString(data, options);
};

/**
 * Loads a JSON descriptor from a string including imports
 * @param {string} jsonString
 * @param {!Object.<string,*>} options Options
 * @returns {*} JSON descriptor
 */
json.loadString = function (jsonString, options) {
    var data = JSON.parse(jsonString);
    var imports = data.imports;
    if (Array.isArray(imports)) {
        for (var i = 0; i < imports.length; ++i) {
            // Skip pulled imports and legacy descriptors
            if (typeof imports[i] !== 'string' || (util.isDescriptor(imports[i]) && !options.legacy)) {
                continue;
            }
            // Merge imports, try include paths
            var path = options.path || [];
            var fileFound = false;
            for (var j = 0; j < path.length; ++j) {
                try {
                    imports[i] = json.load(path[j] + '/' + imports[i], options);
                    fileFound = true;
                    break;
                } catch (e) {

                }
            }
            if (!fileFound) {
                throw Error('File not found: ' + imports[i]);
            }
        }
    }
    return data;
};

module.exports = {
    parse: json.load,
    parseString: json.loadString
};
