var webpack = require('webpack');
var path = require('path');
var HtmlWebPackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    entry: ['./main.js'],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            warnings: false,
          },
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new HtmlWebPackPlugin({
            template: './html/index.html'
        }),
        new ExtractTextPlugin('[name].css')
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style-loader", "css-loader")
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }]
    }
}
