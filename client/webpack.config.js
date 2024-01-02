const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
// TODO: Add and configure workbox plugins for a service worker and manifest file.
// TODO: Add CSS loaders and babel to webpack.
// export the webpack configuration
module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // webpack-dev-server configuration going to the index.html file
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'),
      title: 'Webpack Plugin',
    }),
    // using the mini css extract plugin to extract the css into a separate file
    new MiniCssExtractPlugin(),
    new InjectManifest({
      swSrc: path.resolve(__dirname, 'src-sw.js'),
      swDest: 'service-worker.js',
    }),
    // using the copy plugin to copy the images to the dist folder
    new CopyPlugin({
      patterns: [
        { from: 'favicon.png', to: 'favicon.png' }, 
        { from: 'manifest.json', to: 'manifest.json' }, 
        { from: 'src/images', to: 'images'}
      ],
    }),
  ],
  // configuring the webpack dev server here to serve the index.html file
  module: {
    // adding the css loader to the webpack configuration
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        // adding the babel loader to the webpack configuration
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
