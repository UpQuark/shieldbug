const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: 'source-map',
  entry: {
    background: "./src/background.ts",
    content: "./src/content.ts",
    popup: "./src/Popup/popup.tsx",
    settings: "./src/Settings/settings.tsx",
    block: './src/BlockPage/block.tsx'

  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/Popup/popup.html",
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/Settings/settings.html",
      filename: "settings.html",
      chunks: ["settings"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/BlockPage/block.html",
      filename: "block.html",
      chunks: ["block"],
    }),

    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/manifest.json', to: '.' },
        { from: 'src/assets', to: 'assets' }
      ]
    })
  ],
};
