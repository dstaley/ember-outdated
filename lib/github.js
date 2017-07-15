var request = require('request');
var rsvp = require('rsvp');
var trivial = require('trivialdb');
var qs = require('querystring');

var USER_AGENT = 'Ember-Outdated';

var EMBER_CLI = 'ember-cli/ember-cli';
var GITHUB_API = 'https://api.github.com';
var EMBER_CLI_REPO = GITHUB_API + '/repos/' + EMBER_CLI;

var EMBER_CLI_RELEASES = EMBER_CLI_REPO + '/releases';
var EMBER_CLI_FILES = EMBER_CLI_REPO + '/contents/blueprints/app/files';

var EMBER_CLI_BOWER = EMBER_CLI_FILES + '/bower.json';
var EMBER_CLI_PACKAGE = EMBER_CLI_FILES + '/package.json';

var FILES = {
  'bower': EMBER_CLI_BOWER,
  'package': EMBER_CLI_PACKAGE
};

var FINAL_BOWER_RELEASE = 'v2.12.3';

// Use a simple TrivialDB to cache results so we don't hit Github's API limits.
var DB = trivial.db('cache', {
  rootPath: __dirname,
  prettyPrint: false
});

/**
 * Returns the latest release that is not marked as a prerelease.
 * @param  {Array} releases An array of Github release objects
 * @return {String}         The release string
 */
function latestNonPrereleaseTag(releases) {
  for (var i = 0; i < releases.length; i++) {
    if (!releases[i].prerelease) {
      return releases[i].tag_name;
    }
  }

  return null;
}

/**
 * Creates a URL with the provided query string
 * @param  {Object} options An object of the form { url: url, qs: { key: value }}
 * @return {String}         URL with a querystring
 */
function buildUrl(options) {
  if (options.hasOwnProperty('qs')) {
    return options.url + '?' + qs.stringify(options.qs);
  }

  return options.url;
}

/**
 * Returns true if the content-type of the response is not application/json.
 * @param  {Object}  response A request response object
 * @return {Boolean}
 */
function isNotJson(response) {
  return response.headers['content-type'] !== 'application/json; charset=utf-8';
}

/**
 * Returns the Github API response based on the provided options
 * @param  {Object} options A request options object
 * @return {Promise}
 */
function getGithubData(options) {
  var url = buildUrl(options);
  var p = new rsvp.Promise(function(resolve, reject) {
    DB.get(url).then(function(value) {
      if (value) {
        options.headers['If-None-Match'] = value.headers.etag;

        // Ask Github if the data we have is the most up-to-date.
        request(options, function(error, response, body) {
          if (error) {
            reject(error);
          } else if (response.statusCode === 304) {
            // We have the latest information, so just return what's in the
            // cache.
            if (isNotJson(value)) {
              resolve(JSON.parse(value.body));
            } else {
              resolve(value.body);
            }
          } else if (response.statusCode === 200) {
            // Github gave us some new information, so cache it for later.
            DB.store(url, response);
            if (isNotJson(response)) {
              resolve(JSON.parse(body));
            } else {
              resolve(body);
            }
          } else {
            reject(response);
          }
        });
      } else {
        // The cache doesn't have an existing response for the provided URL
        request(options, function(error, response, body) {
          if (error) {
            reject(error);
          } else if (response.statusCode === 200) {
            // Cache Github's response
            DB.store(url, response);
            if (isNotJson(response)) {
              resolve(JSON.parse(body));
            } else {
              resolve(body);
            }
          } else {
            reject(response);
          }
        });
      }
    });
  });

  return p;
}

/**
 * Returns the latest non-prerelease tag for ember-cli.
 * @return {Promise}
 */
function getLatestRelease() {
  var options = {
    url: EMBER_CLI_RELEASES,
    json: true,
    headers: {
      'User-Agent': USER_AGENT
    }
  };

  return getGithubData(options).then(function(data) {
    return latestNonPrereleaseTag(data);
  });
}

/**
 * Returns the raw file from Github for the given filename and tag
 * @param  {String} tag  A Github release tag
 * @param  {String} name Either bower.json or package.json
 * @return {Promise}
 */
function getFile(tag, name) {
  var options = {
    url: FILES[name],
    qs: {
      ref: tag
    },
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'application/vnd.github.v3.raw'
    }
  };

  return getGithubData(options);
}

/**
 * Returns the contents of bower.json for a given tag
 * @param  {String} tag A Github release tag
 * @return {Promise}
 */
function getBowerJson() {
  return getFile(FINAL_BOWER_RELEASE, 'bower');
}

/**
 * Returns the contents of package.json for a given tag
 * @param  {String} tag A Github release tag
 * @return {Promise}
 */
function getPackageJson(tag) {
  if (typeof tag === 'undefined') {
    throw new Error('A tag must be provided');
  }

  return getFile(tag, 'package');
}

module.exports = {
  getLatestRelease: getLatestRelease,
  getPackageJson: getPackageJson,
  getBowerJson: getBowerJson
};
