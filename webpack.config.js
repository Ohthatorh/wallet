const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const NODE_ENV = process.env.NODE_ENV;
const IS_DEV = NODE_ENV === "development";
const IS_PROD = NODE_ENV === "production";

function setupDevTool() {
  if (IS_DEV) return "eval";
  if (IS_PROD) return false;
}

module.exports = {
  mode: NODE_ENV ? NODE_ENV : "development",
  entry: {
    indexEntry: "./src/assets/public/index/index.js",
    cabinetEntry: "./src/assets/public/cabinet/cabinet.js",
    accountEntry: "./src/assets/public/account/account.js",
    atmsEntry: "./src/assets/public/atms/atms.js",
    currencyEntry: "./src/assets/public/currency/currency.js",
    historyEntry: "./src/assets/public/history/history.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    filename: "[name].bundle.js",
    chunkFilename: "[id].bundle_[chunkhash].js",
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      favicon: "src/assets/img/favicon.svg",
      filename: "index.html",
      template: "src/assets/public/index.html",
      chunks: ["indexEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      favicon: "src/assets/img/favicon.svg",
      filename: "cabinet.html",
      template: "src/assets/public/cabinet.html",
      chunks: ["cabinetEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      favicon: "src/assets/img/favicon.svg",
      filename: "account.html",
      template: "src/assets/public/account.html",
      chunks: ["accountEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      favicon: "src/assets/img/favicon.svg",
      filename: "atms.html",
      template: "src/assets/public/atms.html",
      chunks: ["atmsEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      favicon: "src/assets/img/favicon.svg",
      filename: "currency.html",
      template: "src/assets/public/currency.html",
      chunks: ["currencyEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new HtmlWebpackPlugin({
      favicon: "src/assets/img/favicon.svg",
      filename: "history.html",
      template: "src/assets/public/history.html",
      chunks: ["historyEntry"],
      inject: "head",
      scriptLoading: "blocking",
    }),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    port: 5050,
    open: true,
    hot: IS_DEV,
  },
  devtool: setupDevTool(),
};
