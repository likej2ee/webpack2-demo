var path = require('path');
var webpack = require('webpack');

module.exports = {
    resolve: {
        extensions: ['.js'],
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ]
    },
    entry: {
        'lib': [
            'lib/jquery/dist/jquery',
            'lib/vue/dist/vue',
            'babel-polyfill'
        ]
    },
    output: {
        path: path.join(__dirname, 'assets'),
        filename: '[name].js',
        publicPath: '/assets/',
        library: '[name]_[hash]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'assets', 'lib-manifest.json'),
            name: '[name]_[hash]'
        })
    ]
};
