var path = require('path');
var fs = require("fs");
var webpack = require('webpack');
var config = require('../config');

const ASSETS_DOMAIN = config.production.assetsDomain;
const ASSETS_ROOT = config.constants.assetsRoot;
const WEBPACK_MANIFEST = '../' + ASSETS_ROOT + '/' + config.constants.webpackManifest;

module.exports = {
    output: {
        publicPath: ASSETS_DOMAIN + '/' + ASSETS_ROOT + '/',
        filename: '[name]-[chunkhash].js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // 生产压缩优化
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
                            manifest['/' + ASSETS_ROOT + '/' + key + '.' + getFileExtension(item)] = publicPath + item;
                        }
                    } else {
                        manifest['/' + ASSETS_ROOT + '/' + key + '.' + getFileExtension(value)] = publicPath + value;
                    }
                }
                fs.writeFileSync(
                    path.resolve(__dirname, WEBPACK_MANIFEST),
                    JSON.stringify(manifest));
            });
        },
        new webpack.optimize.UglifyJsPlugin({
            minimize: true,
            compress: {
                warnings: false,
                drop_console: false,
            }
        })
    ]
};
