/*
 * @Author: dontry
 * @Date:   2016-05-01 17:44:31
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-05-19 17:39:36
 */

'use strict';

var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsPlugin = webpack.optimize.CommonChunkPlugin;



module.exports = {
    devtool: 'cheap-eval-source-map',
    entry: {
        vendor: ['jquery', 'mustache', 'backbone', 'bootstrap'],
        index: ['webpack-dev-server/client?http://localhost:8080',
            'webpack/hot/dev-server',
            './entry_index'
        ],
        info: ['webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './entry_info'],
        quiz: ['webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './entry_quiz']
    },
    output: {
        path: path.join(__dirname, 'dist/src'),
        filename: '[name].js',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CommonsPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity
        }),
        new htmlWebpackPlugin({
            template: './html/index.html',
            filename: 'index.html',
            title: '问卷首页'
        }),
        new htmlWebpackPlugin({
        	template: './html/info.html',
        	filename: 'info.html'
        }),
        new htmlWebpackPlugin({
        	template: './html/questionaire.html',
        	filename: 'questionaire.html'
        }),
        new ExtractTextPlugin('style[id].css' {
            allChunks: true
        })
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url-loader?limit=8192'
        }, {
            test: /\.(woff|woff2|eot|svg|ttf)$/,
            loader: 'url-loader?limit=10000&minetype=application/font'
        }]
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        inline: true,
        progress: true
    }
}
