var path = require('path');

module.exports = {
    constants: {
        sourceCodeRoot: 'page', // 开发源文件目录
        assetsPath: '/assets/', // 资源访问路径前缀
        publishRoot: 'assets', // webpack资源构建发布根目录
        webpackManifest: 'webpack-manifest.json', // 配合gulp任务管理资源cache的映射地址
        libManifest: 'lib-manifest.json' // 独立打包的库文件的映射地址
    },
    production: {
        assetsDomain: 'http://127.0.0.1:8899' // 资源所在位置的域名
    },
    test: {
        assetsDomain: ''
    },
    dev: {
        assetsDomain: ''
    }
}
