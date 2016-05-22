/*
 * @Author: dontry
 * @Date:   2016-05-03 13:58:50
 * @Last Modified by:   dontry
 * @Last Modified time: 2016-05-19 20:47:08
 */

'use strict';

var path = require('path');
var webpack = require('webpack');
var htmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CommonsPlugin = webpack.optimize.CommonChunkPlugin;


module.exports = {
    devtool: 'source-map',
    entry: {
        vendor: ['bootstrap', 'mustache', 'backbone', 'jquery','echarts'],
        index: './entry_index',
        info: './entry_info',
        quiz: './entry_quiz'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'js/[name].js',
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compressor: {
        //         warnings: false
        //     },
        // }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new CommonsPlugin({
            name: 'vendor',
            filename: 'js/vendor.js',
            minChunks: Infinity
        }),
        new htmlWebpackPlugin({
            template: './html/index.html',
            filename: 'index.html',
            title: '问卷首页',
            chunks: ['vendor', 'index'],
            cache: true
        }),
        new htmlWebpackPlugin({
            template: './html/info.html',
            filename: 'info.html',
            title: '问卷数据分析',
            chunks: ['vendor', 'info'],
            cache: true
        }),
        new htmlWebpackPlugin({
            template: './html/quiz.html',
            filename: 'quiz.html',
            title: '问卷编辑',
            chunks: ['vendor', 'quiz'],
            cache: true
        }),
        new ExtractTextPlugin('css/[name].css' {
            allChunks: true
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            _: 'underscore'
        })
    ],
    module: {
        loaders[{
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
        }, {
            test: /\.(png|jpg|jpeg|gif)$/,
            loader: 'url-loader?limit=8192'
        }, {
            test: /\.(woff|woff2|eot|svg|ttf)$/,
            loader: 'url-loader?limit=10000&minetype=application/font'
        }, {
            test: require.resolve('jquery'),
            loader: 'expose?jQuery'
        }, {
            test: require.resolve('underscore'),
            loader: 'expose?underscore'
        }, {
            test: require.resolve('bootstrap'),
            loader: 'expose?boostrap'
        }]
    }
}
