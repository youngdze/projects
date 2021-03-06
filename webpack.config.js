const path = require('path');
const webpack = require('webpack');

const ENV = process.env.NODE_ENV;

let plugins = [];
if (ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        drop_console: true,
        warnings: false
      }
    })
  );
}


module.exports = {
  context: __dirname,
  entry: {
    'bundle': [path.join(__dirname, 'index')]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
    chunkFilename: '[id].chunk.js',
    publicPath: 'build'
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.ts', '.js', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins
};
