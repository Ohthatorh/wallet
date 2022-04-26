//eslint-disable-next-line  no-undef
const path = require("path");
//eslint-disable-next-line  no-undef
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//eslint-disable-next-line  no-undef
const HtmlWebpackPlugin = require("html-webpack-plugin");
//eslint-disable-next-line  no-undef
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
//eslint-disable-next-line  no-undef
module.exports = {
  entry: "./src/script.js",
  output: {
    //eslint-disable-next-line  no-undef
    path: path.resolve(__dirname, "./dist"),
    filename: "main.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
    static: {
      //eslint-disable-next-line  no-undef
      directory: path.join(__dirname, "./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: "/node_modules",
      },
      {
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: {
                localIdentName: "[local]__[sha1:hash:hex:7]",
              },
            },
          },
        ],
      },
      {
        test: /^((?!\.module).)*css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  devtool: setupDevtool(),
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
    new HtmlWebpackPlugin({
      title: "Wallet",
      //eslint-disable-next-line  no-undef
      inject: true,
      template: "src/index.html",
      filename: "index.html",
    }),
  ],
};
