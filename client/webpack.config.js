const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');
// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
// added the dev server configuration to serve the content from the dist folder but need to add manifest info, once launched the app did not have a manifest
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,'index.html'),
      title: 'Webpack Plugin',
    }),
    // added the mini css extract plugin to extract the css into a separate file
    new MiniCssExtractPlugin(),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src-sw.js'), 
      swDest: 'service-worker.js',
    }),
  ],
  module: {
    rules: [
      {
        // added the css loader to load css files
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        // added the file loader to load image files
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        // added the babel loader to load js files
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};

