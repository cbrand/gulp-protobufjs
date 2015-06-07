require('should');

var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

var parser = require('../../parser/json');

describe('protobufParser', function() {

    var jsonBasePath;
    var jsonPath;
    var jsonData;

    beforeEach(function() {
        jsonBasePath = path.resolve(__dirname + '/../files');
        jsonPath = path.join(jsonBasePath, 'imports.json');
        jsonData = fs.readFileSync(jsonPath).toString('utf-8');
    });

    it('should parse protobuf data', function() {
        var data = parser.parseString(jsonData);
        expect(data).to.be.a('object');
    });

    it('should parse protobuf files', function() {
        var data = parser.parse(jsonPath);
        expect(data).to.be.a('object');
    });

});
