var path = require('path');

module.exports = {
    constants: {
        assetsRoot: 'assets', // 资源根目录
        webpackManifest: 'webpack-manifest.json', // 配合gulp任务管理资源cache的映射地址
        libManifest: 'lib-manifest.json' // 独立打包的库文件的映射地址
    },
    production: {
        assetsDomain: 'http://wpic.yidianchina.com' // 资源所在位置的域名

    },
    dev: {
        assetsDomain: ''
    }
}
