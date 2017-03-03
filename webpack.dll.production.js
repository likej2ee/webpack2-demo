var path = require('path');
var fs = require("fs");
var webpack = require('webpack');

// const CDN_DOMAIN = 'http://wpic.yidianchina.com';
const CDN_DOMAIN = '';
const ASSETS_DIRECTORY = '/assets/';
const PUBLIC_PATH = CDN_DOMAIN + ASSETS_DIRECTORY;
const WEBPACK_MANIFEST = './assets/webpack-manifest.json';

module.exports = {
    output: {
        publicPath: PUBLIC_PATH,
        filename: '[name]-[chunkhash].js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        // 生产压缩优化
        function() {
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
                            manifest[ASSETS_DIRECTORY + key + '.' + getFileExtension(item)] = PUBLIC_PATH + item;
                        }
                    } else {
                        manifest[ASSETS_DIRECTORY + key + '.' + getFileExtension(value)] = PUBLIC_PATH + value;
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
