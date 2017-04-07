var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var config = require('../config');

const SOURCE_CODE_ROOT = config.constants.sourceCodeRoot;
const ASSETS_ROOT = config.constants.assetsRoot;
const PUBLIC_PATH = '/' + ASSETS_ROOT + '/';
const LIB_MANIFEST = '../' + ASSETS_ROOT + '/' + config.constants.libManifest;
const INCLUDE_PATHS = path.resolve(__dirname, './' + SOURCE_CODE_ROOT + '/core');

module.exports = {
    module: {
        rules: [{
            enforce: 'pre',
            test: /\.js$/, // include .js files
            include: /^(?=.*views)|(?=.*ucenter)|(?=.*core)/,
            use: {
                loader: 'eslint-loader',
                options: {
                    emitWarning: false, // (default: false) Loader will always return warnings if option is set to true.
                    failOnWarning: false, // (default: false) Loader will cause the module build to fail if there are any eslint warnings.
                    failOnError: false // (default: false) Loader will cause the module build to fail if there are any eslint errors.
                }
            }
        }, {
            include: /^(?=.*views)|(?=.*ucenter)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['es2015']
                }
            }
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
        }]
    },
    resolve: { // 解决路径问题，可简化 alias entry 的路径配置
        modules: [
            // 'node_modules',
            path.join(__dirname, '../' + SOURCE_CODE_ROOT)
        ],
        extensions: ['.js'],
        alias: {
            'browser-polyfill$': 'lib/babel-polyfill/browser-polyfill.js',
            'vue$': 'lib/vue/dist/vue.js',
            'vue-router$': 'lib/vue-router/dist/vue-router.min.js',
            'axios$': 'lib/axios/dist/axios.min.js',
            'jquery$': 'lib/jquery/dist/jquery.js',
            'lodash$': 'lib/lodash/dist/lodash.min.js',
            'velocity$': 'lib/velocity/velocity.min.js',
            'tween$': 'lib/tween.js/src/Tween.js',
            'iSlider$': 'lib/iSlider/build/index.bundle.js',
            // 'a$': 'lib/a',
            // 'b$': 'lib/b',
            // 'c$': 'lib/c'
        }
    },
    entry: {
        'core': 'core/core.js',
        // 'base': 'views/_base/base.js',
        // 'index/index': 'views/index/index.js',
        // 'one/one': 'views/one/one.js',
        // 'two/two': 'views/two/two.js',
        'clear/clear': 'views/clear/clear.js',
        'demo/demo': 'views/demo/demo.js'
    },
    output: {
        path: path.join(__dirname, '../' + ASSETS_ROOT),
        publicPath: PUBLIC_PATH,
        filename: '[name].js'
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, '../' + SOURCE_CODE_ROOT),
            manifest: require(path.resolve(__dirname, LIB_MANIFEST)),
        })
    ]
};
