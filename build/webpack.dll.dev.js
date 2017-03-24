var path = require('path');
var webpack = require('webpack');
var config = require('../config');

const SOURCE_CODE_ROOT = config.constants.sourceCodeRoot;
const ASSETS_ROOT = config.constants.assetsRoot;
const LIB_MANIFEST = '../' + ASSETS_ROOT + '/' + config.constants.libManifest;

module.exports = {
    resolve: {
        extensions: ['.js'],
        modules: [
            path.join(__dirname, '../' + SOURCE_CODE_ROOT)
        ]
    },
    entry: {
        'lib': [
            'lib/jquery/dist/jquery',
            'lib/vue/dist/vue',
            'lib/babel-polyfill/browser-polyfill'
        ]
    },
    output: {
        path: path.resolve(__dirname, '../' + ASSETS_ROOT),
        filename: '[name].js',
        publicPath: '/assets/',
        library: '[name]_[hash]'
    },
    plugins: [
        new webpack.DllPlugin({
            context: path.resolve(__dirname, '../' + SOURCE_CODE_ROOT),
            path: path.resolve(__dirname, LIB_MANIFEST),
            name: '[name]_[hash]'
        })
    ]
};
