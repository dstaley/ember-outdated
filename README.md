# ember-outdated

This command-line tool helps identify which dependencies in an [Ember CLI](https://github.com/ember-cli/ember-cli) project are out-of-date.

## Install

`ember-outdated` can either be installed locally or in each Ember project you'd like to use it in.

### Global Install

`npm install -g ember-outdated`

### Per-Project Install

`npm install ember-outdated --save-dev`

## Usage

If you installed globally, run `ember-outdated` from within an Ember CLI application that has already had its dependencies installed.

```
$ cd my-awesome-ember-cli-app
$ ember-outdated
```

If you installed directly in your project:

```
$ cd my-awesome-ember-cli-app
$ ./node-modules/bin/ember-outdated
```

## npx

`ember-outdated` also works beautifully with [`npx`](https://github.com/zkat/npx).

```
$ cd my-awesome-ember-cli-app
$ npx ember-outdated
```


## Example

Here's the output of running `ember-outdated` against the [frontend for Wordset](https://github.com/wordset/wordset-ui).
![ember-outdated for Wordset](http://i.imgur.com/zdEfSOp.png)

## How to Interpret

The output of `ember-outdated` is divided into four columns, `Location`, `Package`, `Target`, `Latest`, and `ember-cli`.

- `Location`: Either `package.json` (for npm dependencies) or `bower.json` (for Bower dependencies).
- `Package`: The name of the package.
- `Target`: The specific version tag listed in your `package.json` or `bower.json`.
- `Latest`: The latest non-prerelease version of the package according to npm or bower.
- `ember-cli`: If the package is part of Ember CLI's default `package.json` or `bower.json`, this column will show the specific version tag for that package.

It's important to note that newer isn't always better, so don't update all your packages just for the sake of updating. Take the time to research each new version, test against your codebase, and determine if you want to upgrade. This is especially true if the latest version is much newer than the target version.

## I think something's broken

If something doesn't work the way you think it should, please open an issue! There's small edge cases I know exist, but just haven't run into them myself.

When you open an issue, it would be super helpful if you'd also link to the output of the debug mode, which can be invoked with the `--debug` flag. **HOWEVER**, please check the output to make sure there's nothing in it that you don't feel comfortable making public. It returns the raw output of the `npm outdated` and `bower list` commands, along with the contents of Ember CLI's `package.json` and `bower.json` files.

## Working on ember-outdated

If you're thinking about contributing to `ember-outdated` I'd absolutely love to work with you. However, before making big changes (such as modifying the conditions under which a package is listed as outdated), please open an issue for discussion.

## Tests

`ember-outdated` uses mocha for testing and the `Expect/Should` assertions from chai. `Should` is preferred, but `Expect` can be used where necessary.

### Areas for Improvement

Right now the core functionality (that is, the bits of `ember-outdated` that interface with npm and bower) aren't tested. Breaking up those areas into smaller, more testable units would be awesome.
