var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const INCLUDE_PATHS = path.resolve(__dirname, "./src/core");

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
            loader: ExtractTextPlugin.extract({
                loader: [
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
                fallbackLoader: 'style-loader' // use style-loader extract css file
            })
        }]
    },
    resolve: {
        modules: [
            // 'node_modules',
            path.resolve(__dirname, 'src')
        ],
        extensions: ['.js'],
        alias: {
            'jquery$': 'lib/jquery/dist/jquery',
            'vue$': 'lib/vue/dist/vue'
            // 'a$': 'lib/a',
            // 'b$': 'lib/b',
            // 'c$': 'lib/c'
        }
    },
    entry: {
        'core': './src/core/core.js',
        'base': './src/views/_base/base.js',
        'index/index': './src/views/index/index.js',
        'one/one': './src/views/one/one.js',
        'two/two': './src/views/two/two.js'
    },
    output: {
        path: path.join(__dirname, 'assets'),
        publicPath: '/assets/',
        filename: '[name].js'
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(path.join(__dirname, 'assets/lib-manifest.json')),
        })
    ]
};
