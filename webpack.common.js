const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const pathsToClean = [
  'build',
];

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/index.js'],
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[chunkhash].js',
    // 添加 chunkFilename
    publicPath: '/',
    chunkFilename: '[name].[chunkhash:5].chunk.js',
  },
  resolve: {
    alias: {
      jquery: 'jquery-slim'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './template/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
      },
      hash: isProduction,
    }),
    new ExtractTextPlugin({ filename: '[name].[contenthash].css', allChunks: false }),
    new CleanWebpackPlugin(pathsToClean),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
          },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            bypassOnDebug: true,
          },
        },
        ],
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            minimize: true,
          },
        }],
      }],
  },
};
