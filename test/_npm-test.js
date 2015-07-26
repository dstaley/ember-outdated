var rewire = require('rewire');
var chai = require('chai');
var should = chai.should(); // eslint-disable-line no-unused-vars

var _npm = rewire('../lib/_npm.js');

var standardize = _npm.__get__('standardize');
var replaceCliVersion = _npm.__get__('replaceCliVersion');

describe('npm module', function() {
  describe('standardize', function() {
    var cliDeps, installedCliDep, notInstalledCliDep, installedUserDep, notInstalledUserDep;

    before(function(done) {
      cliDeps = {
        "name": "<%= name %>",
        "version": "0.0.0",
        "description": "Small description for <%= name %> goes here",
        "private": true,
        "directories": {
          "doc": "doc",
          "test": "tests"
        },
        "scripts": {
          "start": "ember server",
          "build": "ember build",
          "test": "ember test"
        },
        "repository": "",
        "engines": {
          "node": ">= 0.10.0"
        },
        "author": "",
        "license": "MIT",
        "devDependencies": {
          "broccoli-asset-rev": "^2.0.2",
          "ember-cli": "<%= emberCLIVersion %>",
          "ember-cli-app-version": "0.3.3",
          "ember-cli-babel": "^5.0.0",
          "ember-cli-content-security-policy": "0.4.0",
          "ember-cli-dependency-checker": "^1.0.0",
          "ember-cli-htmlbars": "0.7.6",
          "ember-cli-ic-ajax": "0.1.1",
          "ember-cli-inject-live-reload": "^1.3.0",
          "ember-cli-qunit": "0.3.13",
          "ember-cli-uglify": "^1.0.1",
          "ember-data": "1.0.0-beta.18",
          "ember-disable-proxy-controllers": "^1.0.0",
          "ember-export-application-global": "^1.0.2"
        }
      };

      installedCliDep = [
        "/Users/dstaley/Desktop/test-bower",
        "ember-cli-app-version",
        "0.4.0",
        "0.4.0",
        "0.3.5",
        "0.4.0"
      ];
      notInstalledCliDep = [
        "/Users/dstaley/Desktop/test-bower",
        "ember-cli-app-version",
        null,
        "0.4.0",
        "0.3.5",
        "0.4.0"
      ];
      installedUserDep = [
        "/Users/dstaley/Desktop/test-bower",
        "ember-moment",
        "1.1.1",
        "1.1.1",
        "3.1.0",
        "1.1.1"
      ];
      notInstalledUserDep = [
        "/Users/dstaley/Desktop/test-bower",
        "ember-moment",
        null,
        "1.1.1",
        "3.1.0",
        "1.1.1"
      ];

      done();
    });

    it('should handle cli dependencies that aren\'t installed', function(done) {
      standardize(cliDeps, notInstalledCliDep).should.deep.equal({
        location: 'package.json',
        name: 'ember-cli-app-version',
        target: '0.4.0',
        cliVersion: '0.3.3',
        installed: null,
        latest: '0.3.5'
      });
      done();
    });

    it('should handle installed cli dependencies', function(done) {
      standardize(cliDeps, installedCliDep).should.deep.equal({
        location: 'package.json',
        name: 'ember-cli-app-version',
        target: '0.4.0',
        cliVersion: '0.3.3',
        installed: '0.4.0',
        latest: '0.3.5'
      });
      done();
    });

    it('should handle user dependencies that aren\'t installed', function(done) {
      standardize(cliDeps, notInstalledUserDep).should.deep.equal({
        location: 'package.json',
        name: 'ember-moment',
        target: '1.1.1',
        cliVersion: null,
        installed: null,
        latest: '3.1.0'
      });
      done();
    });

    it('should handle installed user dependencies', function(done) {
      standardize(cliDeps, installedUserDep).should.deep.equal({
        location: 'package.json',
        name: 'ember-moment',
        target: '1.1.1',
        cliVersion: null,
        installed: '1.1.1',
        latest: '3.1.0'
      });
      done();
    });
  });

  describe('replaceCliVersion', function() {
    var emberCli, tag, somethingElse;

    before(function(done) {
      tag = 'v1.13.1';
      emberCli = {
        "location": "package.json",
        "name": "ember-cli",
        "target": "0.2.7",
        "cliVersion": "<%= emberCLIVersion %>",
        "installed": "1.13.1",
        "latest": "1.13.1"
      };
      somethingElse = {
        "location": "package.json",
        "name": "ember-highcharts",
        "target": "0.0.1",
        "cliVersion": null,
        "installed": "0.0.1",
        "latest": "0.1.3"
      };
      done();
    });

    it('should replace ember-cli\'s version with a release tag', function(done) {
      replaceCliVersion(tag, emberCli).should.deep.equal({
        "location": "package.json",
        "name": "ember-cli",
        "target": "0.2.7",
        "cliVersion": "1.13.1",
        "installed": "1.13.1",
        "latest": "1.13.1"
      });
      done();
    });

    it('shouldn\'t affect any non-ember-cli dependency', function(done) {
      replaceCliVersion(tag, somethingElse).should.deep.equal(somethingElse);
      done();
    });
  });
});
