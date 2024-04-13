const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/application.ts',
  output: {
    filename: 'multibrot-set.js',
    path: __dirname + '/build',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  stats: {
    children: true,
  },
  performance: {
    maxAssetSize: 1000000, // bytes
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' },
      { test: /\.glsl$/, use: 'raw-loader' },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        template: 'src/html/index.html'
      }
    ),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' }
      ],
    }),
  ],
};