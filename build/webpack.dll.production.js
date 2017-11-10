var path = require('path');
var fs = require("fs");
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('../config');

const ASSETS_DOMAIN = config.production.assetsDomain;
const ASSETS_PATH = config.constants.assetsPath;
const PUBLISH_ROOT = config.constants.publishRoot;
const WEBPACK_MANIFEST = '../' + PUBLISH_ROOT + '/' + config.constants.webpackManifest;

module.exports = {
    output: {
        publicPath: ASSETS_DOMAIN + ASSETS_PATH,
        filename: '[name]-[chunkhash].js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name]-[contenthash:20].css'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false,
                drop_console: false,
            }
        }),
        function() {
            var publicPath = this.options.output.publicPath;

            // 获取文件后缀明
            var getFileExtension = function(fileName) {
                var array = fileName.split('.');
                return array[array.length - 1];
            }

            // 生成manifest文件
            this.plugin('done', function(stats) {
                var manifest = {},
                    assets = stats.toJson().assetsByChunkName;
                for (var key in assets) {
                    var value = assets[key];
                    if (value instanceof Array) {
                        for (var i in value) {
                            var item = value[i];
                            manifest[ASSETS_PATH + key + '.' + getFileExtension(item)] = publicPath + item;
                        }
                    } else {
                        manifest[ASSETS_PATH + key + '.' + getFileExtension(value)] = publicPath + value;
                    }
                }
                fs.writeFileSync(
                    path.resolve(__dirname, WEBPACK_MANIFEST),
                    JSON.stringify(manifest));
            });
        }
    ]
};
