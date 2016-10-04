"use strict";

let path = require("path");
let multimatch = require("multimatch");
let uglifyJS = require("uglify-js");
let _ = require("lodash");

function plugin(options) {
  options = normalize(options);

  return function uglify(files, metalsmith, done) {
    if (!options.active) {
      done();
      return;
    }

    let filesTbProcessed = multimatch(Object.keys(files), options.src);

    filesTbProcessed.forEach(function(fileName) {
      let file = files[fileName];

      if (options.uglifyOptions.compress.warnings === true) {
        // uglify prints warnings to the console and without file names it doesn't make any sense
        console.log("Uglifiying " + fileName + "...");
      }

      var outName = options.override ? fileName : options.target(fileName);

      if (!_.isObject(files[outName]) || options.override) {
        let contents = file.contents.toString();
        let baseOpts = {
          fromString: true
        };
        let mergedOptions = _.extend(baseOpts, options.uglifyOptions);
        let result = uglifyJS.minify(contents, mergedOptions);
        files[outName] = {contents: new Buffer(result.code)};
      }

      if (options.deleteSources && !options.override) {
        delete files[fileName];
      }
    });

    done();
  };
}

function getMinifiedName(inFileName) {
  var extension = path.extname(inFileName);
  var onlyFilename = path.basename(inFileName, extension);
  var dirname = path.dirname(inFileName);
  var newFilename = onlyFilename + ".min" + extension;
  return path.join(dirname, newFilename);
}

function normalize(options) {
  var defaults = {
    src: ["**/*.js", "!**/*.min.js"],
    active: true,
    target: getMinifiedName,
    deleteSources: false,
    override: false,
    uglifyOptions: {
      mangle: false,
      compress: {}
    }
  };

  options = _.assign({}, defaults, options);

  return options;
}

module.exports = plugin;
