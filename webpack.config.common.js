var path = require('path');
var webpack = require('webpack');
var extractTextPlugin = require('extract-text-webpack-plugin');

const INCLUDE_PATHS = path.resolve(__dirname, "./src/core");

module.exports = {
    module: {
        rules: [{
            test: /\.js$/, // include .js files
            enforce: 'pre',
            include: /^(?=.*views)|(?=.*ucenter)|(?=.*core)/,
            use: {
                loader: 'jshint-loader',
                options: {
                    // jshint errors are displayed by default as warnings
                    // set emitErrors to true to display them as errors
                    emitErrors: false,

                    // jshint to not interrupt the compilation
                    // if you want any file with jshint errors to fail
                    // set failOnHint to true
                    failOnHint: false,

                    // custom reporter function
                    // reporter: function (errors) {}
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
            loader: extractTextPlugin.extract({
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
