var semver = require('semver');

/**
 * Checks to see if a dependency is the same as ember-cli
 * @param  {Object} d A standardized dependency object
 * @return {Boolean}
 */
function differentFromCli(d) {
  if (d.cliVersion) {
    return d.target !== d.cliVersion;
  }

  return true;
}

/**
 * Checks to see if the latest version satisfies the semver target
 * @param  {Object} d A standardized dependency object
 * @return {Boolean}
 */
function notSatisfiedBySemver(d) {
  return !semver.satisfies(d.latest, d.target);
}

/**
 * Converts all null properties to blank strings since cli-table doesn't like null values.
 * @param  {Object} d
 * @return {Boolean}
 */
function nullToBlankString(d) {
  for (var key in d) {
    if (d.hasOwnProperty(key) && d[key] === null) {
      d[key] = '';
    }
  }

  return d;
}

module.exports = {
  differentFromCli: differentFromCli,
  notSatisfiedBySemver: notSatisfiedBySemver,
  nullToBlankString: nullToBlankString
};
