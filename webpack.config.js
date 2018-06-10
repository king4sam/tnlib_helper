const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = function webpackConfig() {
  const config = {
    resolve: {
      alias: {
        script: path.join(__dirname, "script")
      },
      modules: ["./script", "./node_modules"]
    },
    entry: {
      background: "./script/background.js",
      sum:"./script/sum.js"
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "all"
          }
        }
      }
    },
    output: {
      path: `${__dirname}/dist`,
      filename: "[name].js"
    },
    module: {
      rules: [
        {
          test: /\.(jsx|js)$/,
          exclude: [/node_modules/],
          loaders: ["babel-loader"]
        },
        {
          test: /\.(html)$/,
          use: {
            loader: "html-loader"
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.ModuleConcatenationPlugin(),
      new CopyWebpackPlugin([
        {
          from: "script"
        },
        {
          context: "srcipt/modes",
          from: "**/default.json",
          to: "default_[folder].json"
        },
        {
          context: "srcipt/modes",
          from: "**/config.json",
          to: "config_[folder].json"
        }
      ])
    ]
  };

  return config;
};
