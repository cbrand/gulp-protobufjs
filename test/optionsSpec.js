var expect = require('chai').expect;
var opt = require('../options');

require('should');

describe('gulp-protobufjs options', function () {

    var options;
    beforeEach(function () {
        options = {};
    });

    var verifyOptions = function () {
        return opt.verify(options);
    };

    describe('encoding', function () {

        it('should default to utf-8', function () {
            verifyOptions().encoding.should.equal('utf-8');
        });

        it('should be able to overwrite the default encoding', function () {
            options.encoding = 'latin-1';
            verifyOptions().encoding.should.equal('latin-1');
        });

    });

    describe('input', function () {
        it('should default to the protobuf input', function () {
            verifyOptions().input.should.equal('protobuf');
        });

        it('should accept the protobuf input', function () {
            options.input = 'protobuf';
            verifyOptions().input.should.equal('protobuf');
        });

        it('should accept the json input', function () {
            options.input = 'json';
            verifyOptions().input.should.equal('json');
        });

        it('should throw an error if an input could not be parsed', function () {
            options.input = 'not_json_nor_protobuf';
            expect(verifyOptions).to.throw(Error);
        });
    });

    describe('targets', function () {

        it('should default to the commonjs output', function () {
            verifyOptions().target.should.equal('commonjs');
        });

        it('should accept commonjs as a option', function () {
            options.target = 'commonjs';
            verifyOptions().target.should.equal('commonjs');
        });

        it('should accept js as a option', function () {
            options.target = 'js';
            verifyOptions().target.should.equal('js');
        });

        it('should accept js as a option', function () {
            options.target = 'js';
            verifyOptions().target.should.equal('js');
        });

        it('should accept amd as a option', function () {
            options.target = 'amd';
            verifyOptions().target.should.equal('amd');
        });

        it('should accept json as a option', function () {
            options.target = 'json';
            verifyOptions().target.should.equal('json');
        });

        it('should accept proto as a option', function () {
            options.target = 'proto';
            verifyOptions().target.should.equal('proto');
        });

        it('should not accept any other option', function () {
            options.target = 'Nothing_useful';
            expect(verifyOptions).to.throw(Error);
        });
    });

    describe('path', function () {

        it('should not set any path if none has been passed', function () {
            expect(verifyOptions().path).to.be.an('undefined');
        });

        it('should adjust a path to an array', function () {
            options.path = __dirname;
            expect(verifyOptions().path).to.be.an('array');
            verifyOptions().path.length.should.be.exactly(1);
            verifyOptions().path[0].should.equal(__dirname);
        });

        it('should not modify if the passed path is already an array', function () {
            options.path = [__dirname];
            expect(verifyOptions().path).to.be.an('array');
            verifyOptions().path.length.should.be.exactly(1);
            verifyOptions().path[0].should.equal(__dirname);
        });
    });

});
