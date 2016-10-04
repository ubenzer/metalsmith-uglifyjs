metalsmith-uglifyjs
===============
[![Gitter](https://img.shields.io/gitter/room/ubenzer/metalsmith-uglifyjs.svg?maxAge=2592000&style=flat-square)](https://gitter.im/ubenzer/metalsmith-uglifyjs)
[![Travis](https://img.shields.io/travis/ubenzer/metalsmith-uglifyjs.svg?maxAge=3600&style=flat-square)](https://travis-ci.org/ubenzer/metalsmith-uglifyjs)
[![David](https://img.shields.io/david/ubenzer/metalsmith-uglifyjs.svg?maxAge=3600&style=flat-square)](https://david-dm.org/ubenzer/metalsmith-uglifyjs)
[![David](https://img.shields.io/david/dev/ubenzer/metalsmith-uglifyjs.svg?maxAge=3600&style=flat-square)](https://david-dm.org/ubenzer/metalsmith-uglifyjs#info=devDependencies)
[![Codecov](https://img.shields.io/codecov/c/github/ubenzer/metalsmith-uglifyjs.svg?maxAge=3600&style=flat-square)](https://codecov.io/gh/ubenzer/metalsmith-uglifyjs)
[![npm](https://img.shields.io/npm/v/metalsmith-uglifyjs.svg?maxAge=3600&style=flat-square)](https://www.npmjs.com/package/metalsmith-uglifyjs)
[![npm](https://img.shields.io/npm/dt/metalsmith-uglifyjs.svg?maxAge=3600&style=flat-square)](https://www.npmjs.com/package/metalsmith-uglifyjs)

An [Uglifyjs2](http://lisperator.net/uglifyjs/) plugin for [Metalsmith](http://metalsmith.io/).

## Installation

```sh
npm install --save metalsmith-uglifyjs
```

## Getting Started

If you haven't checked out [Metalsmith](http://metalsmith.io/) before, head over to their website and check out the
documentation.

## Usage

```js
var uglifyjs = require("metalsmith-uglifyjs");

metalsmith
  .use(uglifyjs({
    src: ["**/*.js", "!**/*.min.js"],
    target: function(inFile) { return inFile + ".customMinFileName.js"; },
    deleteSources: true,
    uglifyOptions: {
      mangle: true,
      compress: {
        unused: false,
        warnings: true
      }
    }
  }))
```

## Options
You can check the tests out to see some usage examples.

### src
A [multimatch](https://www.npmjs.com/package/multimatch) expression that can be used to limit the files
that will be uglified. Default is `["**/*.js", "!**/*.min.js"]` Please note that IT IS YOUR JOB to EXCLUDE
already minified files using `src` setting if you are using a customized name convention.

### target
A `function` that takes a file name as input and expected to return minified file name as output. Default
function adds `.min.` before extension. _(i.e. a.js -> a.min.js)_

### override
If `true`, then compressed JS will be written into the same files that were compressed. The `target`
and `deleteSources` options are discarded in this case.

Default: `false`

### deleteSources
A boolean, if true original files will be deleted, if false original files will be kept as-is. Default: `false`


### active
A boolean flag, when set to false this whole stuff will be disabled. This can be used to disable uglify based on
some variable. (e.g. Don't run this on dev but run this on prod.) 

Default: `true`

### uglifyOptions
A valid config that will be passed to uglifyjs. Please see [here](https://github.com/mishoo/UglifyJS2#compressor-options) for your options. Default:
```js
uglifyOptions: {
  mangle: false,
  compress: {}
}
```
This means use default compress options and do not mangle.

## Contributing
Just open an issue or prepare a pull request.
