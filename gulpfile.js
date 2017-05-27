var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var minimist = require('minimist');
var config = require('./config');

const SOURCE_CODE_ROOT = config.constants.sourceCodeRoot;
const ASSETS_PATH = config.constants.assetsPath;
const PUBLISH_ROOT = config.constants.publishRoot;
const WEBPACK_MANIFEST = './' + PUBLISH_ROOT + '/' + config.constants.webpackManifest;

const DEPLOY_DIRECTORY = './www/'; // 演示多页应用最终发布的静态资源(包含html)
const BUILD_ASSETS_DIRECTORY = ['./' + PUBLISH_ROOT + '/', DEPLOY_DIRECTORY];
const BUILD_ASSETS_FILES = ['./' + PUBLISH_ROOT + '/**/*.*'];
const HTML_FILES = ['./' + SOURCE_CODE_ROOT + '/**/*.html', '!./' + SOURCE_CODE_ROOT + '/lib/**/*'];
const LIB_FILES = ['./src/core/**/*.scss'] // 库文件

// 错误处理函数
function errorHandler(src, e) {
    // 控制台发生，错误时beep一下
    gutil.beep();
    if (src) {
        throw new gutil.PluginError(src, e);
    } else {
        gutil.log(src, e);
    }
}

// 清理之前生成的构建文件
gulp.task('clean', function() {
    // Return the Promise from del()
    // 'return' This is the key here, to make sure asynchronous tasks are done!
    return del(BUILD_ASSETS_DIRECTORY);
});

// 启动开发服务器
gulp.task('webserver', function() {
    var server = require('gulp-server-livereload');
    var serverConfig = {
        livereload: {
            enable: true,
            filter: function(fileName, callback) { // 路径区分mac和window
                callback(!/\.svn/.test(fileName) &&
                    (/\.html$/.test(fileName) ||
                        new RegExp('/' + PUBLISH_ROOT + '/').test(fileName) || // mac目录分隔符 '/'
                        new RegExp('\\\\' + PUBLISH_ROOT + '\\\\').test(fileName))); // win目录分隔符 '\'
            }
        },
        defaultFile: './' + SOURCE_CODE_ROOT + '/views/demo/demo.html',
        fallback: './' + SOURCE_CODE_ROOT + '/views/demo/demo.html',
        // directoryListing: true,
        open: true,
        port: 8899
    };
    if (/^darwin/.test(process.platform)) {
        serverConfig.host = '127.0.0.1';
        serverConfig.livereload.port = 36666;
    }
    return gulp.src('./')
        .pipe(server(serverConfig));
});

// dev run webpack --watch
gulp.task('webpack-watch', ['webpack-build-dll-dev'], function(callback) {
    var webpackConfigCommon = require('./build/webpack.config.common.js');
    var webpackConfigDev = require('./build/webpack.config.dev.js');
    var merageConfig = webpackMerge(webpackConfigCommon, webpackConfigDev);
    var finished = false;
    webpack(merageConfig).watch({
        aggregateTimeout: 300,
        ignored: /node_modules | (?=.*lib)/
    }, function(err, stats) {
        if (err) {
            errorHandler('webpack-watch', err);
        }
        // win系统输出全部日志会明显增加触发浏览器热部署的时间
        gutil.log('webpack-build-watch', stats.compilation.errors.toString({
            colors: true
        }), stats.compilation.warnings.toString({
            colors: true
        }));
        var diffTime = stats.endTime - stats.startTime + ' ms';
        gutil.log('Finished', '\'' + gutil.colors.cyan('webpack-watch') + '\'',
            'after', gutil.colors.magenta(diffTime));
        if (!finished) {
            // Use the callback in the async function
            // 'callback()' This is what lets gulp know this task is complete!
            callback();
            finished = true;
        }
    });
});

// dev 动态链接库
gulp.task('webpack-build-dll-dev', function(callback) {
    var webpackConfigDll = require('./build/webpack.dll.dev.js');
    var merageConfig = webpackMerge(webpackConfigDll, {});
    webpack(merageConfig).run(function(err, stats) {
        if (err) {
            errorHandler('webpack-build-dll-dev', err);
        }
        gutil.log('webpack-build-dll-dev', stats.toString({
            colors: true
        }));
        callback();
    });
});

// dev run webpack
gulp.task('webpack-build-dev', ['webpack-build-dll-dev'], function(callback) {
    var webpackConfigCommon = require('./build/webpack.config.common.js');
    var webpackConfigDev = require('./build/webpack.config.dev.js');
    var merageConfig = webpackMerge(webpackConfigCommon, webpackConfigDev);
    webpack(merageConfig).run(function(err, stats) {
        if (err) {
            errorHandler('webpack-build-dev', err);
        }
        gutil.log('webpack-build-dev', stats.toString({
            colors: true
        }));
        callback();
    });
});

// gulp监听lib
gulp.task('gulp-watch-lib', function() {
    return gulp.watch(LIB_FILES, ['webpack-build-dev'])
})

/* >>>>>>>>>>>>>>>>>>>>>>>>>>> production begin <<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

// production 动态链接库
gulp.task('webpack-build-dll-production', function(callback) {
    process.env.NODE_ENV = 'production'; // 设置生产环境标志，部分webpack配置区分环境
    var webpackConfigDll = require('./build/webpack.dll.dev.js');
    var webpackConfigDllProduction = require('./build/webpack.dll.production.js');
    var merageConfig = webpackMerge(webpackConfigDll, webpackConfigDllProduction);
    // 获取参数，制定测试环境资源发布地址
    var options = minimist(process.argv.slice(2));
    if (options.deploy === 'test') {
        merageConfig.output.publicPath = config.test.assetsDomain + ASSETS_PATH;
    }
    webpack(merageConfig).run(function(err, stats) {
        if (err) {
            errorHandler('webpack-build-dll-production', err);
        }
        gutil.log('webpack-build-dll-production', stats.toString({
            colors: true
        }));
        callback();
    });
});

// production run webpack
gulp.task('webpack-build-production', ['webpack-build-dll-production'], function(callback) {
    process.env.NODE_ENV = 'production'; // 设置生产环境标志，部分webpack配置区分环境
    var webpackConfigCommon = require('./build/webpack.config.common.js');
    var webpackConfigProduction = require('./build/webpack.config.production.js');

    // 获取参数，指定测试环境资源发布地址
    var options = minimist(process.argv.slice(2));
    if (options.deploy === 'test') {
        webpackConfigProduction.output.publicPath = config.test.assetsDomain + ASSETS_PATH;
        webpackConfigProduction.plugins.shift();
        webpackConfigProduction.plugins.unshift(new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
            __DEV__: false,
            __TEST__: true,
            __PRODUCTION__: false
        }));
    }

    var merageConfig = webpackMerge(webpackConfigCommon, webpackConfigProduction);
    webpack(merageConfig).run(function(err, stats) {
        if (err) {
            errorHandler('webpack-build-production', err);
        }
        gutil.log('webpack-build-production', stats.toString({
            colors: true
        }));
        callback();
    });
});

/* >>>>>>>>>>>>>>>>>>>>>>>>>>> production end <<<<<<<<<<<<<<<<<<<<<<<<<<<<< */


/* >>>>>>>>>>>>>>>>>>>>>>>> 发布资源 begin <<<<<<<<<<<<<<<<<<<<<<<<<< */

gulp.task('release-html', function() {
    return gulp.src(HTML_FILES)
        .pipe(revReplace({
            manifest: gulp.src(WEBPACK_MANIFEST),
            replaceInExtensions: ['.html']
        }))
        .pipe(gulp.dest(DEPLOY_DIRECTORY + '/' + SOURCE_CODE_ROOT))
});

// 发布资源
gulp.task('release-assets', function() {
    return gulp.src(['./' + PUBLISH_ROOT + '/**/*'])
        .pipe(gulp.dest(DEPLOY_DIRECTORY + '/' + PUBLISH_ROOT + '/'));
});

// // 生成check.html文件，用于健康检查监测服务器是否存活中
// gulp.task('create-check', function() {
//     var path = require('path');
//     require('fs').writeFileSync(
//         path.join(__dirname, './' + PUBLISH_ROOT + '/check.html'), new Date().toString());
// });

/* >>>>>>>>>>>>>>>>>>>>>>>> 发布资源 end <<<<<<<<<<<<<<<<<<<<<<<<<< */

// 安装脚本框架
gulp.task('install', function() {
    var bower = require('bower');
    return bower.commands.install()
        .on('log', function(data) {
            gutil.log('install-bower', gutil.colors.cyan(data.id), data.message);
        });
});

// 发布文件 gulp release --deploy dev/test/production
gulp.task('release', function(callback) {
    // 获取参数
    var options = minimist(process.argv.slice(2));
    if (options.deploy === 'dev') {
        runSequence('webpack-build-dev', [], callback);
    } else {
        runSequence('webpack-build-production', ['release-html', 'release-assets'], callback);
    }
});

// 启动开发环境，包含自动重编译，开发服务器和自动重载
// This will run in this order:
// * clean
// ...
// * xxx and xxx in parallel 写法['', '']
// * webserver
// * Finally call the callback function
gulp.task('dev', function(callback) {
    runSequence('clean', ['webpack-watch', 'gulp-watch-lib'],
        'webserver',
        callback);
});

// gulp 默认任务，不启动监听任务
gulp.task('default', function(callback) {
    runSequence('clean', 'webpack-build-dev', callback);
});
