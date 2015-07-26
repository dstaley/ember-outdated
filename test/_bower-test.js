var rewire = require('rewire');
var chai = require('chai');
var should = chai.should(); // eslint-disable-line no-unused-vars
var expect = chai.expect; // eslint-disable-line no-unused-vars

var _bower = rewire('../lib/_bower.js');

var isPrerelease = _bower.__get__('isPrerelease');
var latestNonPrerelease = _bower.__get__('latestNonPrerelease');
var removeSource = _bower.__get__('removeSource');
var getCliVersion = _bower.__get__('getCliVersion');
var standardize = _bower.__get__('standardize');

describe('_bower module', function() {
  describe('isPrerelease', function() {
    it('should detect prereleases', function(done) {
      isPrerelease('1.0.0-alpha.1').should.be.okay;
      isPrerelease('1.0.0-alpha1').should.be.okay;
      isPrerelease('1.0.0-alpha1+compat').should.be.okay;
      isPrerelease('1.0.0-rc.6.1').should.be.okay;
      isPrerelease('1.0.0+1').should.be.okay;
      isPrerelease('1.0.0-pre').should.be.okay;
      done();
    });

    it('should detect releases', function(done) {
      isPrerelease('1.0.0').should.not.be.okay;
      done();
    });
  });

  describe('latestNonPrerelease', function() {
    var prereleaseVersions, noReleaseVersions;
    before(function(done) {
      prereleaseVersions = [
        "2.0.0-beta.3",
        "2.0.0-beta.2",
        "2.0.0-beta.1",
        "1.13.5",
        "1.13.4",
        "1.13.3"
      ];
      noReleaseVersions = [
        "2.0.0-beta.3",
        "2.0.0-beta.2",
        "2.0.0-beta.1"
      ];
      done();
    });

    it('should find latest non-prerelease', function(done) {
      latestNonPrerelease(prereleaseVersions).should.equal('1.13.5');
      done();
    });

    it('should return null if all versions are prerelease', function(done) {
      expect(latestNonPrerelease(noReleaseVersions)).to.be.null;
      done();
    });
  });

  describe('removeSource', function() {
    it('should remove source from version', function(done) {
      removeSource('ember-cli/ember-load-initializers#0.1.5').should.equal('0.1.5');
      done();
    });
  });

  describe('getCliVersion', function() {
    var cliDeps;

    before(function(done) {
      cliDeps = {
        "name": "<%= name %>",
        "dependencies": {
          "ember": "1.13.5",
          "ember-cli-shims": "ember-cli/ember-cli-shims#0.0.3",
          "ember-cli-test-loader": "ember-cli-test-loader#0.1.3",
          "ember-data": "1.13.5",
          "ember-load-initializers": "ember-cli/ember-load-initializers#0.1.5",
          "ember-qunit": "0.4.6",
          "ember-qunit-notifications": "0.0.7",
          "ember-resolver": "~0.1.18",
          "jquery": "^1.11.1",
          "loader.js": "ember-cli/loader.js#3.2.0",
          "qunit": "~1.17.1"
        }
      };
      done();
    });

    it('should find correct cli version', function(done) {
      getCliVersion(cliDeps, 'ember').should.equal('1.13.5');
      getCliVersion(cliDeps, 'ember-load-initializers').should.equal('0.1.5');
      done();
    });

    it('should return null for anything missing', function(done) {
      expect(getCliVersion(cliDeps, 'moment')).to.be.null;
      done();
    });
  });

  describe('standardize', function() {
    var cliDeps, notInstalledCliDep, installedCliDep, notInstalledUserDep, installedUserDep;

    before(function(done) {
      cliDeps = {
        "name": "<%= name %>",
        "dependencies": {
          "ember": "1.13.5",
          "ember-cli-shims": "ember-cli/ember-cli-shims#0.0.3",
          "ember-cli-test-loader": "ember-cli-test-loader#0.1.3",
          "ember-data": "1.13.5",
          "ember-load-initializers": "ember-cli/ember-load-initializers#0.1.5",
          "ember-qunit": "0.4.6",
          "ember-qunit-notifications": "0.0.7",
          "ember-resolver": "~0.1.18",
          "jquery": "^1.11.1",
          "loader.js": "ember-cli/loader.js#3.2.0",
          "qunit": "~1.17.1"
        }
      };

      notInstalledCliDep = {
        "endpoint": {
          "name": "jquery",
          "source": "jquery",
          "target": "^1.11.1"
        },
        "missing": true,
        "nrDependants": 1,
        "versions": [
          "3.0.0-alpha1+compat",
          "3.0.0-alpha1",
          "2.1.4",
          "2.1.3",
          "2.1.2",
          "2.1.1",
          "2.1.1-rc2",
          "2.1.1-rc1",
          "2.1.1-beta1",
          "2.1.0",
          "2.1.0-rc1",
          "2.1.0-beta3",
          "2.1.0-beta2",
          "2.1.0-beta1",
          "2.0.3",
          "2.0.2",
          "2.0.1",
          "2.0.0",
          "2.0.0-beta3",
          "1.11.3",
          "1.11.2",
          "1.11.1",
          "1.11.1-rc2",
          "1.11.1-rc1",
          "1.11.1-beta1",
          "1.11.0",
          "1.11.0-rc1",
          "1.11.0-beta3",
          "1.11.0-beta2",
          "1.11.0-beta1",
          "1.10.2",
          "1.10.1",
          "1.10.0",
          "1.10.0-beta1",
          "1.9.1",
          "1.9.0",
          "1.8.3+1",
          "1.8.3",
          "1.8.2",
          "1.8.1",
          "1.8.0",
          "1.7.2",
          "1.7.1",
          "1.7.0",
          "1.6.4",
          "1.6.3",
          "1.6.2",
          "1.6.1",
          "1.6.0",
          "1.5.2",
          "1.5.1",
          "1.5.0",
          "1.4.4",
          "1.4.3",
          "1.4.2",
          "1.4.1",
          "1.4.0",
          "1.3.2",
          "1.3.1",
          "1.3.0",
          "1.2.6",
          "1.2.5",
          "1.2.4",
          "1.2.3",
          "1.2.2",
          "1.2.1",
          "1.1.4",
          "1.1.3",
          "1.1.2",
          "1.1.1",
          "1.0.4",
          "1.0.3",
          "1.0.2",
          "1.0.1"
        ],
        "update": {
          "target": "1.11.3",
          "latest": "3.0.0-alpha1+compat"
        }
      };
      installedCliDep = {
        "endpoint": {
          "name": "jquery",
          "source": "jquery",
          "target": "^1.11.1"
        },
        "canonicalDir": "/Users/dstaley/Desktop/test-bower/bower_components/jquery",
        "pkgMeta": {
          "name": "jquery",
          "version": "1.11.3",
          "main": "dist/jquery.js",
          "license": "MIT",
          "ignore": [
            "**/.*",
            "build",
            "dist/cdn",
            "speed",
            "test",
            "*.md",
            "AUTHORS.txt",
            "Gruntfile.js",
            "package.json"
          ],
          "devDependencies": {
            "sizzle": "2.1.1-jquery.2.1.2",
            "requirejs": "2.1.10",
            "qunit": "1.14.0",
            "sinon": "1.8.1"
          },
          "keywords": [
            "jquery",
            "javascript",
            "library"
          ],
          "homepage": "https://github.com/jquery/jquery",
          "_release": "1.11.3",
          "_resolution": {
            "type": "version",
            "tag": "1.11.3",
            "commit": "1472290917f17af05e98007136096784f9051fab"
          },
          "_source": "git://github.com/jquery/jquery.git",
          "_target": "^1.11.1",
          "_originalSource": "jquery"
        },
        "dependencies": {},
        "nrDependants": 1,
        "versions": [
          "3.0.0-alpha1+compat",
          "3.0.0-alpha1",
          "2.1.4",
          "2.1.3",
          "2.1.2",
          "2.1.1",
          "2.1.1-rc2",
          "2.1.1-rc1",
          "2.1.1-beta1",
          "2.1.0",
          "2.1.0-rc1",
          "2.1.0-beta3",
          "2.1.0-beta2",
          "2.1.0-beta1",
          "2.0.3",
          "2.0.2",
          "2.0.1",
          "2.0.0",
          "2.0.0-beta3",
          "1.11.3",
          "1.11.2",
          "1.11.1",
          "1.11.1-rc2",
          "1.11.1-rc1",
          "1.11.1-beta1",
          "1.11.0",
          "1.11.0-rc1",
          "1.11.0-beta3",
          "1.11.0-beta2",
          "1.11.0-beta1",
          "1.10.2",
          "1.10.1",
          "1.10.0",
          "1.10.0-beta1",
          "1.9.1",
          "1.9.0",
          "1.8.3+1",
          "1.8.3",
          "1.8.2",
          "1.8.1",
          "1.8.0",
          "1.7.2",
          "1.7.1",
          "1.7.0",
          "1.6.4",
          "1.6.3",
          "1.6.2",
          "1.6.1",
          "1.6.0",
          "1.5.2",
          "1.5.1",
          "1.5.0",
          "1.4.4",
          "1.4.3",
          "1.4.2",
          "1.4.1",
          "1.4.0",
          "1.3.2",
          "1.3.1",
          "1.3.0",
          "1.2.6",
          "1.2.5",
          "1.2.4",
          "1.2.3",
          "1.2.2",
          "1.2.1",
          "1.1.4",
          "1.1.3",
          "1.1.2",
          "1.1.1",
          "1.0.4",
          "1.0.3",
          "1.0.2",
          "1.0.1"
        ],
        "update": {
          "target": "1.11.3",
          "latest": "3.0.0-alpha1+compat"
        }
      };
      notInstalledUserDep = {
        "endpoint": {
          "name": "JavaScript-MD5",
          "source": "JavaScript-MD5",
          "target": "~1.1.0"
        },
        "missing": true,
        "nrDependants": 1,
        "versions": [
          "1.1.1",
          "1.1.0",
          "1.0.3",
          "1.0.2",
          "1.0.1"
        ],
        "update": {
          "target": "1.1.1",
          "latest": "1.1.1"
        }
      };
      installedUserDep = {
        "endpoint": {
          "name": "JavaScript-MD5",
          "source": "JavaScript-MD5",
          "target": "~1.1.0"
        },
        "canonicalDir": "/Users/dstaley/Desktop/test-bower/bower_components/JavaScript-MD5",
        "pkgMeta": {
          "name": "blueimp-md5",
          "version": "1.1.1",
          "title": "JavaScript MD5",
          "description": "JavaScript MD5 implementation.",
          "keywords": [
            "javascript",
            "md5"
          ],
          "homepage": "https://github.com/blueimp/JavaScript-MD5",
          "author": {
            "name": "Sebastian Tschan",
            "url": "https://blueimp.net"
          },
          "maintainers": [{
            "name": "Sebastian Tschan",
            "url": "https://blueimp.net"
          }],
          "contributors": [{
            "name": "Paul Johnston",
            "url": "http://pajhome.org.uk/crypt/md5"
          }],
          "repository": {
            "type": "git",
            "url": "git://github.com/blueimp/JavaScript-MD5.git"
          },
          "bugs": "https://github.com/blueimp/JavaScript-MD5/issues",
          "license": "MIT",
          "main": "js/md5.js",
          "ignore": [
            "/*.*",
            "css",
            "js/demo.js",
            "test"
          ],
          "_release": "1.1.1",
          "_resolution": {
            "type": "version",
            "tag": "1.1.1",
            "commit": "f6d59c44053c65cab63b6e8329c731af632249e8"
          },
          "_source": "git://github.com/blueimp/JavaScript-MD5.git",
          "_target": "~1.1.0",
          "_originalSource": "JavaScript-MD5"
        },
        "dependencies": {},
        "nrDependants": 1,
        "versions": [
          "1.1.1",
          "1.1.0",
          "1.0.3",
          "1.0.2",
          "1.0.1"
        ],
        "update": {
          "target": "1.1.1",
          "latest": "1.1.1"
        }
      };
      done();
    });

    it('should handle cli dependencies that aren\'t installed', function(done) {
      standardize(cliDeps, notInstalledCliDep).should.deep.equal({
        location: 'bower.json',
        name: 'jquery',
        target: '^1.11.1',
        cliVersion: '^1.11.1',
        installed: null,
        latest: '2.1.4'
      });
      done();
    });

    it('should handle installed cli dependencies', function(done) {
      standardize(cliDeps, installedCliDep).should.deep.equal({
        location: 'bower.json',
        name: 'jquery',
        target: '^1.11.1',
        cliVersion: '^1.11.1',
        installed: '1.11.3',
        latest: '2.1.4'
      });
      done();
    });

    it('should handle user dependencies that aren\'t installed', function(done) {
      standardize(cliDeps, notInstalledUserDep).should.deep.equal({
        location: 'bower.json',
        name: 'JavaScript-MD5',
        target: '~1.1.0',
        cliVersion: null,
        installed: null,
        latest: '1.1.1'
      });
      done();
    });

    it('should handle installed user dependencies', function(done) {
      standardize(cliDeps, installedUserDep).should.deep.equal({
        location: 'bower.json',
        name: 'JavaScript-MD5',
        target: '~1.1.0',
        cliVersion: null,
        installed: '1.1.1',
        latest: '1.1.1'
      });
      done();
    });
  });
});
