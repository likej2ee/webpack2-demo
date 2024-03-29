var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('../config');

const SOURCE_CODE_ROOT = config.constants.sourceCodeRoot;
const PUBLISH_ROOT = config.constants.publishRoot;
const ASSETS_PATH = config.constants.assetsPath;
const LIB_MANIFEST = '../' + PUBLISH_ROOT + '/' + config.constants.libManifest;
const INCLUDE_PATHS = path.resolve(__dirname, './' + SOURCE_CODE_ROOT + '/core');

module.exports = {
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.ts|\.js$/, // include .js files
            // exclude: /^(?=.*lib)/,
            use: {
                loader: 'eslint-loader',
                options: {
                    emitWarning: false, // (default: false) Loader will always return warnings if option is set to true.
                    failOnWarning: false, // (default: false) Loader will cause the module build to fail if there are any eslint warnings.
                    failOnError: false // (default: false) Loader will cause the module build to fail if there are any eslint errors.
                }
            }
        }, {
            test: /\.js$/,
            exclude: /^(?=.*lib)/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.tsx?$/,
            exclude: /^(?=.*lib)/,
            use: 'ts-loader'
        }, {
            test: /\.css$/,
            use: [
                'style-loader', // creates style nodes from JS strings
                'css-loader', // translates CSS into CommonJS
                'postcss-loader'
            ]
        }, {
            test: /\.scss$/,
            include: /^(?=.*_base)|(?=.*core)/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                {
                    loader: 'sass-loader', // compiles Sass to CSS
                    options: {
                        outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'nested',
                        includePaths: [INCLUDE_PATHS]
                    }
                }
            ]
        }, {
            test: /\.scss$/,
            include: /^(?=.*views)(?!.*_base)|(?=.*ucenter)(?!.*_base)/,
            use: ExtractTextPlugin.extract({
                use: [
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'nested',
                            includePaths: [INCLUDE_PATHS]
                        }
                    }
                ],
                fallback: 'style-loader' // use style-loader extract css file
            })
        }, {
            test: /\.html$/,
            use: 'html-loader'
        }, {
            test: /(\.png)|(\.jpg)|(\.jpeg)|(\.gif)$/,
            exclude: /^(?=.*lib)/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 7000,
                    name: 'staticimg/[name].[hash:7].[ext]'
                }
            }
        }, {
            test: /(\.ttf)|(\.eot)|(\.svg)|(\.woff)$/,
            include: /^(?=.*fonts)/,
            use: {
                loader: 'file-loader',
                options: {
                    name: 'static/fonts/[name].[hash:7].[ext]'
                }
            }
        }]
    },
    resolve: { // 解决路径问题，可简化 alias entry 的路径配置
        modules: [
            'node_modules',
            path.join(__dirname, '../' + SOURCE_CODE_ROOT)
        ],
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            // 'url-search-params-polyfill$': 'lib/url-search-params/build/url-search-params.amd.js',
            // 'browser-polyfill$': 'lib/babel-polyfill/browser-polyfill.js',
            'vue$': 'vue/dist/vue.js',
            // 'vue-router$': 'lib/vue-router/dist/vue-router.min.js',
            // 'axios$': 'lib/axios/dist/axios.min.js',
            // 'jquery$': 'lib/jquery/dist/jquery.js',
            // 'lodash$': 'lib/lodash/dist/lodash.min.js',
            // 'velocity$': 'lib/velocity/velocity.min.js',
            // 'tween$': 'lib/tween.js/src/Tween.js',
            // 'iSlider$': 'lib/iSlider/build/index.bundle.js',
            // 'toastr$': 'lib/toastr/toastr.js',
            // 'toastrcss$': 'lib/toastr/toastr.min.css',
            // 'rangeslider$': 'lib/rangeslider.js/dist/rangeslider.js',
            // 'rangeslidercss$': 'lib/rangeslider.js/dist/rangeslider.css',

            // 自定义插件
            'audio$': 'lib-manual/audio.js',

            // service
            'apiService$': 'service/_api.js'
        }
    },
    entry: {
        'core': 'core/core',
        // 'base': 'views/_base/base',
        'index/index': 'views/index/index', // 入口页
        'demo/demo': 'views/demo/demo', // demo页
        'ts/index': 'views/ts/index', // typescript联系
        'archive/product-multi-spec/product-multi-spec': 'views/archive/product-multi-spec/product-multi-spec' // 商品一品多规格
    },
    output: {
        path: path.join(__dirname, '../' + PUBLISH_ROOT),
        publicPath: ASSETS_PATH,
        filename: '[name].js'
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, '../' + SOURCE_CODE_ROOT),
            manifest: require(path.resolve(__dirname, LIB_MANIFEST)),
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
