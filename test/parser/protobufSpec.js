require('should');

var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;

var parser = require('../../parser/protobuf');

describe('protobufParser', function() {

    var protoBufBasePath;
    var protoBufPath;
    var protoBufData;

    beforeEach(function() {
        protoBufBasePath = path.resolve(__dirname + '/../files');
        protoBufPath = path.join(protoBufBasePath, 'person.proto');
        protoBufData = fs.readFileSync(protoBufPath).toString('utf-8');
    });

    it('should parse protobuf data', function() {
        var data = parser.parseString(protoBufData);
        expect(data).to.be.a('object');
    });

    it('should parse protobuf files', function() {
        var data = parser.parse(protoBufPath);
        expect(data).to.be.a('object');
    });

    describe('when handling imports', function() {

        beforeEach(function() {
            protoBufPath = path.join(__dirname, '../files/organization.proto');
            protoBufData = fs.readFileSync(protoBufPath).toString('utf-8');
        });

        it('should parse protobuf data', function() {
            var data = parser.parseString(protoBufData, {
                path: protoBufBasePath
            });
            expect(data).to.be.a('object');
        });

        it('should parse protobuf files', function() {
            var data = parser.parse(protoBufPath, {
                path: protoBufBasePath
            });
            expect(data).to.be.a('object');
        });

    });

});
