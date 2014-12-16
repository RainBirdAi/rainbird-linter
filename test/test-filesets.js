var expect = require('expect.js');
var filesets = require('../lib/filesets.js');

describe('Filesets', function() {
    it('should ignore invalid include filesets', function(done) {
        filesets.include(['initial']);
        filesets.include(1);
        expect(filesets.platoIncludes()).to.eql(['initial']);
        done();
    });

    it('should ignore include filesets with invalid content', function(done) {
        filesets.include(['initial']);
        filesets.include([1, 2]);
        expect(filesets.platoIncludes()).to.eql(['initial']);
        done();
    });

    it('should ignore invalid exclude filesets', function(done) {
        filesets.exclude(['initial']);
        filesets.exclude(1);
        expect(filesets.jshintExcludes()).to.eql(['initial']);
        done();
    });

    it('should ignore exclude filesets with invalid content', function(done) {
        filesets.exclude(['initial']);
        filesets.exclude([1, 2]);
        expect(filesets.jshintExcludes()).to.eql(['initial']);
        done();
    });

    it('should return the plato include fileset as is', function(done) {
        filesets.include(['a', 'b', 'c/']);
        expect(filesets.platoIncludes()).to.eql(['a', 'b', 'c/']);
        done();
    });

    it('should convert the plato exclude fileset to a regexp', function(done) {
        var expected = new RegExp('a|b|c\/');
        filesets.exclude(['a', 'b', 'c/']);

        expect(filesets.platoExcludes()).to.eql(expected);
        done();
    });

    it('should convert jshint include to a globbing format', function(done) {
        filesets.include(['a', 'b', 'c/']);
        expect(filesets.jshintIncludes()).to.eql(['a', 'b', 'c/**/*.js']);
        done();
    });

    it('should convert jshint exclude to a globbing format', function(done) {
        filesets.exclude(['a', 'b', 'c/']);
        expect(filesets.jshintExcludes()).to.eql(['a', 'b', 'c/**/*.js']);
        done();
    });

    it('should return null if there are no plato exclude files',
        function(done) {
            filesets.exclude([]);
            expect(filesets.platoExcludes()).to.be(null);
            done();
        }
    );

    it('should filter plato filesets but not jshint ones', function(done) {
        filesets.include(['a', 'b', 'c/'], ['c/']);
        expect(filesets.jshintIncludes()).to.eql(['a', 'b', 'c/**/*.js']);
        expect(filesets.platoIncludes()).to.eql(['a', 'b']);
        done();
    });
});