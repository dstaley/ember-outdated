#! /usr/bin/env node

var _npm = require('./_npm');
var _bower = require('./_bower');
var rsvp = require('rsvp');
var Table = require('cli-table');
var _ = require('lodash');
var PleasantProgress = require('pleasant-progress');
var cli = require('commander');
var github = require('./github');
var util = require('./util');

var PROGRESS_MESSAGES = [
  'Reticulating splines',
  'Herding cats',
  'Breeding bits',
  'Determining the gravitational constant in your locale',
  'Warming up Large Hadron Collider',
  'Hang on a sec, I know your data is here somewhere'
];

// Nice, minimal table
var t = new Table({
  head: ['Location', 'Package', 'Target', 'Latest', 'ember-cli'],
  colWidths: [15, 25, 12, 12, 12],
  chars: {
    'top': '',
    'top-mid': '',
    'top-left': '',
    'top-right': '',
    'bottom': '',
    'bottom-mid': '',
    'bottom-left': '',
    'bottom-right': '',
    'left': '',
    'left-mid': '',
    'mid': '',
    'mid-mid': '',
    'right': '',
    'right-mid': '',
    'middle': ' '
  },
  style: {
    'padding-left': 0,
    'padding-right': 0
  }
});

rsvp.on('error', function(reason) {
  console.assert(false, reason); // eslint-disable-line no-console
});

cli
  .version('1.0.0-alpha.1')
  .option('-d, --debug', 'Print debugging info')
  .parse(process.argv);

var progress = new PleasantProgress();

if (!cli.debug) {
  progress.start(PROGRESS_MESSAGES[Math.floor(Math.random() * PROGRESS_MESSAGES.length)]);
}

var promises = {
  'bower.json': _bower.getBowerDependencies(),
  'package.json': _npm.getPackageDependencies()
};

if (cli.debug) {
  promises['ember-cli-bower.json'] = github.getLatestRelease()
    .then(function(tag) {
      return github.getBowerJson(tag);
    });

  promises['ember-cli-package.json'] = github.getLatestRelease()
    .then(function(tag) {
      return github.getPackageJson(tag);
    });

  promises['debug-npm'] = _npm.debugNpm();
  promises['debug-bower'] = _bower.debugBower();
}

rsvp.hash(promises).then(function(results) {
  if (cli.debug) {
    console.log(JSON.stringify(results)); // eslint-disable-line no-console
  } else {
    var packages = results['package.json'].concat(results['bower.json']);
    packages = _(packages)
      .filter(util.differentFromCli)
      .filter(util.notSatisfiedBySemver)
      .map(util.nullToBlankString)
      .value();

    _.each(packages, function(d) {
      t.push([d.location, d.name, d.target, d.latest, d.cliVersion]);
    });

    progress.stop();
    console.log(t.toString()); // eslint-disable-line no-console
  }
});
