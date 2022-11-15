const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/report-html.js",
  output: {
    filename: "reportHtml.min.js",
    path: path.resolve(process.cwd(), "dist"),
    libraryTarget: "commonjs",
  },

  plugins: [new CleanWebpackPlugin()],

  module: {
    rules: [
      {
        test: /\.ejs/,
        type: "asset/source",
      },
    ],
  },
};
