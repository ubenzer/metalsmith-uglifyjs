"use strict";
let should = require("should");
let sinon = require("sinon");
let fs = require("fs");
let path = require("path");
let Metalsmith = require("metalsmith");
let uglifyjs = require("../lib/index.js");
let assertDirsEqual = require("assert-dir-equal");

describe("metalsmith-uglifyjs", function() {
  let sandbox = null;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    sandbox.stub(console, "log");
    sandbox.stub(console, "error");
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("should work with default options, not minifying a file that already has a minified version", function(done) {
    Metalsmith("test/fixtures/basic")
      .use(uglifyjs())
      .build(function(err) {
        should(err).be.null();
        assertDirsEqual("test/fixtures/basic/build", "test/fixtures/basic/expected1");
        return done();
      });
  });

  it("should let customized multimatch sources to be provided", function(done) {
    Metalsmith("test/fixtures/basic")
      .use(uglifyjs({
        src: ["**/*.js", "!**.min.js", "!**/b.js"]
      }))
      .build(function(err) {
        should(err).be.null();
        assertDirsEqual("test/fixtures/basic/build", "test/fixtures/basic/expected2");
        return done();
      });
  });

  it("should let customized minified file name generator function to be provided", function(done) {
    Metalsmith("test/fixtures/basic")
      .use(uglifyjs({
        src: ["**/*.js"],
        target: function customTargetFn(inFileName) {
          return inFileName + "LOL.xd";
        }
      }))
      .build(function(err) {
        should(err).be.null();
        assertDirsEqual("test/fixtures/basic/build", "test/fixtures/basic/expected3");
        return done();
      });
  });

  it("should delete the original sources if requested", function(done) {
    Metalsmith("test/fixtures/basic")
      .use(uglifyjs({
        deleteSources: true
      }))
      .build(function(err) {
        should(err).be.null();
        assertDirsEqual("test/fixtures/basic/build", "test/fixtures/basic/expected4");
        return done();
      });
  });

  it("should pass uglify options to the library as-is", function(done) {
    Metalsmith("test/fixtures/basic")
      .source("src2")
      .use(uglifyjs({
        uglifyOptions: {
          mangle: true,
          compress: {
            unused: false
          }
        }
      }))
      .build(function(err) {
        should(err).be.null();
        assertDirsEqual("test/fixtures/basic/build", "test/fixtures/basic/expected5");
        return done();
      });
  });

  it("should pass log file names if warn settings is enabled", function(done) {
    Metalsmith("test/fixtures/basic")
      .source("src2")
      .use(uglifyjs({
        uglifyOptions: {
          mangle: false,
          compress: {
            warnings: true
          }
        }
      }))
      .build(function(err) {
        should(err).be.null();
        sinon.assert.calledTwice(console.log);
        sinon.assert.calledOnce(console.error);
        sinon.assert.calledWithExactly(console.log.firstCall, "Uglifiying a.js...");
        sinon.assert.calledWithExactly(console.log.secondCall, "Uglifiying b.js...");
        sinon.assert.calledWithExactly(console.error, "WARN: %s", "Dropping unused variable x [0:2,6]");
        return done();
      });
  });

  it("should override source files, if we set override setting to true", function(done) {
    Metalsmith("test/fixtures/basic")
      .use(uglifyjs({
        override: true
      }))
      .build(function(err) {
        should(err).be.null();
        assertDirsEqual("test/fixtures/basic/build", "test/fixtures/basic/expected6");
        return done();
      });
  });

  it("should do nothing if it is disabled by active:false flag", function(done) {
    Metalsmith("test/fixtures/basic")
      .use(uglifyjs({
        active: false
      }))
      .build(function(err) {
        should(err).be.null();
        assertDirsEqual("test/fixtures/basic/build", "test/fixtures/basic/build");
        return done();
      });
  });
});
