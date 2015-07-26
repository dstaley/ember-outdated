var chai = require('chai');
var should = chai.should(); // eslint-disable-line no-unused-vars

var util = require('../lib/util');

describe('utility functions', function() {
  describe('differentFromCli', function() {
    var cliDependency, userDependency;

    before(function(done) {
      cliDependency = {
        location: 'bower.json',
        name: 'jquery',
        target: '^1.11.1',
        cliVersion: '^1.11.1',
        installed: null,
        latest: '2.1.4'
      };
      userDependency = {
        location: 'package.json',
        name: 'ember-moment',
        target: '1.1.1',
        cliVersion: null,
        installed: null,
        latest: '3.1.0'
      };
      done();
    });

    it('returns false if target is the same as cliVersion', function(done) {
      util.differentFromCli(cliDependency).should.be.false;
      done();
    });

    it('returns true if there is no cliVersion', function(done) {
      util.differentFromCli(userDependency).should.be.true;
      done();
    });
  });

  describe('notSatisfiedBySemver', function() {
    var currentDependency, outdatedDependency;

    before(function(done) {
      currentDependency = {
        location: 'package.json',
        name: 'ember-cli-babel',
        target: '^5.0.0',
        cliVersion: null,
        installed: null,
        latest: '5.1.3'
      };
      outdatedDependency = {
        location: 'package.json',
        name: 'ember-moment',
        target: '1.1.1',
        cliVersion: null,
        installed: null,
        latest: '3.1.0'
      };
      done();
    });

    it('should return false if the latest version satisfies semver', function(done) {
      util.notSatisfiedBySemver(currentDependency).should.be.false;
      done();
    });

    it('should return true if the latest version doesn\'t satisfy semver', function(done) {
      util.notSatisfiedBySemver(outdatedDependency).should.be.true;
      done();
    });
  });

  describe('null to blank string', function() {
    var o;

    before(function(done) {
      o = {
        a: null,
        b: '',
        c: 'Hello',
        d: 25,
        e: []
      };
      done();
    });

    it('should convert all nulls to blank strings', function(done) {
      util.nullToBlankString(o).should.deep.equal({
        a: '',
        b: '',
        c: 'Hello',
        d: 25,
        e: []
      });
      done();
    });
  });
});
