var _npm = require('npm');
var github = require('./github.js');
var rsvp = require('rsvp');

/**
 * Converts npm dependencies into a standard format
 * @param  {Object} cliDeps The contents of ember-cli's package.json file
 * @param  {Array}  dep     An npm outdated array
 * @return {Object}         A standardized dependency object
 */
function standardize(cliDeps, dep) {
  var info = {
    location: 'package.json',
    name: dep[1],
    target: dep[5],
    cliVersion: cliDeps.devDependencies[dep[1]] || null,
    installed: dep[2] || null,
    latest: dep[4]
  };

  return info;
}

/**
 * Replaces ember-cli's version with the latest tag.
 * @param  {String} tag A Github release tag
 * @param  {Object} d   A standardized dependency
 * @return {Object}     A standardized dependency
 */
function replaceCliVersion(tag, d) {
  if (d.name === 'ember-cli') {
    d.cliVersion = tag.substring(1, tag.length);
  }

  return d;
}

/**
 * Returns a Promise that resolves to an array of standardized dependencies.
 * @return {Promise}
 */
function getPackageDependencies() {
  var p = new rsvp.Promise(function(resolve, reject) {
    // Get the latest release tag from Github
    github.getLatestRelease().then(function(tag) {
      // Get the package.json for the latest release
      github.getPackageJson(tag).then(function(packageJson) {
        _npm.load(function(error, npm) {
          if (error) {
            reject(error);
          }
          // Get the outdated dependencies from npm
          npm.commands.outdated({}, true, function(error, data) {
            if (error) {
              reject(error);
            }
            var deps = data
              .map(function(d) {
                return standardize(packageJson, d);
              })
              .map(function(d) {
                return replaceCliVersion(tag, d);
              });

            resolve(deps);
          });
        });
      });
    });
  });

  return p;
}

/**
 * Returns the result of npm outdated. Only for debugging;
 * @return {Promise}
 */
function debugNpm() {
  var p = new rsvp.Promise(function(resolve, reject) {
    _npm.load(function(error, npm) {
      if (error) {
        reject(error);
      }

      npm.commands.outdated({}, true, function(error, data) {
        if (error) {
          reject(error);
        }

        resolve(data);
      });
    });
  });

  return p;
}

module.exports = {
  getPackageDependencies: getPackageDependencies,
  debugNpm: debugNpm
};
