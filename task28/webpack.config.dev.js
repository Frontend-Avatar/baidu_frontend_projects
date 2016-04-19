var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'cheap-eval-source-map',
    entry: ['webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/dev-server',
        './main'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            template: './html/index.html'
        })
    ],
    module: {
        loaders: [{
            test: /\.css$/,
            loaders: ['style', 'css']
        }, {
            test: /\.(png|jpg)$/,
            loader: 'url-loader?limit=8192'
        }]
    },
    devServer: {
        contentBase: './dist',
        hot: true
    }
}
