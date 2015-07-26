var rewire = require('rewire');
var chai = require('chai');
var should = chai.should(); // eslint-disable-line no-unused-vars
var fs = require('fs');
var path = require('path');

var github = rewire('../lib/github.js');
var root = process.cwd();
var dataDir = path.join(root, 'test', 'data');

var latestNonPrereleaseTag = github.__get__('latestNonPrereleaseTag');
var buildUrl = github.__get__('buildUrl');
var isNotJson = github.__get__('isNotJson');

describe('github module', function() {
  describe('latestNonPrereleaseTag', function() {
    var releases;

    before(function(done) {
      process.chdir(dataDir);
      releases = JSON.parse(fs.readFileSync('github_releases.json', {
        encoding: 'utf8'
      }));
      done();
    });

    after(function(done) {
      process.chdir(root);
      done();
    });

    it('should find latest non-prerelease', function(done) {
      latestNonPrereleaseTag(releases).should.equal('v1.13.1');
      done();
    });
  });

  describe('buildUrl', function() {
    var optionsWithQueryString, optionsWithoutQueryString;

    before(function(done) {
      optionsWithQueryString = {
        url: 'https://api.github.com/repos/ember-cli/ember-cli/contents/blueprints/app/files/package.json',
        qs: {
          ref: 'v1.13.1'
        }
      };
      optionsWithoutQueryString = {
        url: 'https://api.github.com/repos/ember-cli/ember-cli/contents/blueprints/app/files/package.json'
      };
      done();
    });

    it('should return a url with a query string', function(done) {
      buildUrl(optionsWithQueryString).should.equal('https://api.github.com/repos/ember-cli/ember-cli/contents/blueprints/app/files/package.json?ref=v1.13.1');
      done();
    });

    it('shouldn\'t return a URL with a query string if no query strings are specified', function(done) {
      buildUrl(optionsWithoutQueryString).should.equal('https://api.github.com/repos/ember-cli/ember-cli/contents/blueprints/app/files/package.json');
      done();
    });
  });

  describe('isNotJson', function() {
    var jsonResponse, notJsonResponse;

    before(function(done) {
      jsonResponse = {
        headers: {
          'content-type': 'application/json; charset=utf-8'
        }
      };

      notJsonResponse = {
        headers: {
          'content-type': 'application/vnd.github.v3.raw'
        }
      };
      done();
    });

    it('should return false if the content-type is application/json', function(done) {
      isNotJson(jsonResponse).should.be.false;
      done();
    });

    it('should return true if the content-type is not application/json', function(done) {
      isNotJson(notJsonResponse).should.be.true;
      done();
    });
  });
});
