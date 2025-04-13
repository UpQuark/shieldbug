const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: "development",
  devtool: 'source-map',
  entry: {
    background: "./src/background.ts",
    popup: "./src/Components/Popup/popup.tsx",
    settings: "./src/Components/Settings/settings.tsx",
    block: './src/Components/BlockPage/block.tsx'
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
        test: /\.json$/,
        use: 'json-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: '[name].[ext]',
              outputPath: 'assets/deterrentPictures/',
              publicPath: 'assets/deterrentPictures/'
            }
          },
        ],
      },
      // SCSS loader
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass'),
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/Components/Popup/popup.html",
      filename: "popup.html",
      chunks: ["popup"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/Components/Settings/settings.html",
      filename: "settings.html",
      chunks: ["settings"],
    }),
    new HtmlWebpackPlugin({
      template: "./src/Components/BlockPage/block.html",
      filename: "block.html",
      chunks: ["block"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'assets',
          globOptions: {
            ignore: ['**/*.scss']
          }
        },
        {
          from: 'src/assets/deterrentImages/spiders',
          to: 'assets/deterrentImages/spiders'
        }
      ]
    }),
  ],
};
