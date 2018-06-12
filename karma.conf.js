const mainWebpackConfig = require("./webpack.config.js");
const path = require("path");

const files = ["test/index.test.js"];

const preprocessors = {
  "test/index.test.js": ["webpack"]
};

const karmaWebpackConfig = Object.assign({}, mainWebpackConfig(), {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      }
    ]
  },
  optimization: {},
  devtool: false
});

module.exports = function karmaConfig(config) {
  const configuration = {
    singleRun: true,
    webpack: karmaWebpackConfig,
    webpackServer: { noInfo: true },
    basePath: "",
    frameworks: ["jasmine"],
    files,
    preprocessors,
    reporters: ["spec"], // This line is extra important, it enabled the green checkmarks in the specs
    specReporter: {
      maxLogLines: 5, // limit number of lines logged per test
      suppressErrorSummary: true, // do not print error summary
      suppressFailed: false, // print information about failed tests
      suppressPassed: false, //  print information about passed tests
      suppressSkipped: false, // print information about skipped tests
      showSpecTiming: true // print the time elapsed for each spec
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browserNoActivityTimeout: 60000,
    // browsers: ["ChromeHeadless"],
    browsers: ['Chrome_without_security'],
    customLaunchers: {
      Chrome_without_security: {
        base: 'Chrome',
        flags: ['--disable-web-security'],
        displayName: 'Chrome w/o security'
      }
    },
    concurrency: Infinity
  };

  config.set(configuration);
};
