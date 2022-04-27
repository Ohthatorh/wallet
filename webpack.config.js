//eslint-disable-next-line no-undef
const path = require("path");
//eslint-disable-next-line no-undef
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//eslint-disable-next-line no-undef
const HtmlWebpackPlugin = require("html-webpack-plugin");
//eslint-disable-next-line no-undef
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
//eslint-disable-next-line no-undef
const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === "development";
const IS_PROD = NODE_ENV === "production";

function setupDevtool() {
  if (IS_DEV) {
    return "eval";
  }
  if (IS_PROD) {
    return false;
  }
}
//eslint-disable-next-line no-undef
module.exports = {
  entry: "./src/script.js",
  output: {
    //eslint-disable-next-line no-undef
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules",
      },
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|avif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  devtool: setupDevtool(),
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
    new HtmlWebpackPlugin({
      //eslint-disable-next-line no-undef
      template: path.resolve(__dirname, "./src/index.html"),
      filename: "index.html",
    }),
    new CleanWebpackPlugin(),
  ],
};
