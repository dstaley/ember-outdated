var bower = require('bower');
var semver = require('semver');
var _ = require('lodash');
var github = require('./github.js');
var rsvp = require('rsvp');

/**
 * Checks to see if a version is a prerelease
 * @param  {String}  version A semver version string
 * @return {Boolean}
 */
function isPrerelease(version) {
  var parsed = semver.parse(version);

  return parsed && parsed.prerelease && parsed.prerelease.length;
}

/**
 * Returns the latest non-prerelease from a list of versions
 * @param  {Array} versions An array of semver versions
 * @return {String}         A semver version
 */
function latestNonPrerelease(versions) {
  for (var i = 0; i < versions.length; i++) {
    if (!isPrerelease(versions[i])) {
      return versions[i];
    }
  }

  return null;
}

/**
 * Removes the user and repo from a version string
 * @param  {String} target A version string (ember/ember#2.0.0)
 * @return {String}        A semver version string
 */
function removeSource(target) {
  var s = target.split('#');
  if (s.length > 1) {
    return s[1];
  }

  return s[0];
}

/**
 * Returns the ember-cli version of a given dependency if it's an ember-cli
 * 	dependency.
 * @param  {Object} cliDeps     The content's of ember-cli's default bower.json
 *   file
 * @param  {String} packageName The name of a dependency
 * @return {String}             A semver version string
 */
function getCliVersion(cliDeps, packageName) {
  if (cliDeps.dependencies.hasOwnProperty(packageName)) {
    return removeSource(cliDeps.dependencies[packageName]);
  }

  return null;
}

/**
 * Converts bower dependencies into a standard format
 * @param  {Object} cliDeps The contents of ember-cli's bower.json file
 * @param  {Array}  dep     A bower dependency
 * @return {Object}         A standardized dependency object
 */
function standardize(cliDeps, dep) {
  var info = {
    location: 'bower.json',
    name: dep.endpoint.name,
    target: dep.endpoint.target,
    cliVersion: getCliVersion(cliDeps, dep.endpoint.name)
  };

  // If the package is installed, use the installed version, otherwise null.
  if (dep.hasOwnProperty('pkgMeta')) {
    info.installed = dep.pkgMeta.version;
  } else {
    info.installed = null;
  }

  if (dep.hasOwnProperty('update')) {
    if (isPrerelease(dep.update.latest)) {
      // Set latest version to latest non-prerelease version in the event that
      // the latest version is a prerelease.
      info.latest = latestNonPrerelease(dep.versions);
    } else {
      info.latest = dep.update.latest;
    }
  } else {
    info.latest = latestNonPrerelease(dep.versions);
  }

  return info;
}

/**
 * Returns a Promise that resolves to an array of standardized dependencies
 * @return {Array} An array of standardized dependencies
 */
function getBowerDependencies() {
  var p = new rsvp.Promise(function(resolve, reject) {
    // Get the latest release tag from Github
    github.getLatestRelease().then(function(tag) {
      // Get the package.json for the latest release
      github.getBowerJson(tag).then(function(bowerJson) {
        // Get all dependencies from npm
        bower.commands.list().on('end', function(results) {
          // We use lodash here since bower returns an object with package name
          // keys.
          var deps = _(results.dependencies)
            // Bower dependencies are keyed by package name, so just convert it
            // to a normal array.
            .map(function(d) {
              return d;
            })
            .map(function(d) {
              return standardize(bowerJson, d);
            })
            .value();

          resolve(deps);
        });
      });
    });
  });

  return p;
}

/**
 * Returns the result of bower list. Only for debugging.
 * @return {Promise}
 */
function debugBower() {
  var p = new rsvp.Promise(function(resolve, reject) {
    bower.commands.list().on('end', function(results) {
      resolve(results);
    });
  });

  return p;
}

module.exports = {
  getBowerDependencies: getBowerDependencies,
  debugBower: debugBower
};
