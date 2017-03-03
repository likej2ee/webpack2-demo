var gulp = require('gulp');
var gutil = require('gulp-util');
var del = require('del');
var revReplace = require('gulp-rev-replace');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');

const WEBPACK_MANIFEST = './assets/webpack-manifest.json';
const BUILD_ASSETS_DIRECTORY = './assets/';
const BUILD_ASSETS_FILES = ['./assets/**/*.*'];
const HTML_FILES = ['./src/**/*.html', '!./src/lib/**/*'];

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
                    (/\.html$/.test(fileName) || /\/assets\//.test(fileName) || /\\assets\\/.test(fileName)));
            }
        },
        defaultFile: './src/views/index/index.html',
        // directoryListing: true,
        open: true,
        port: 8888
    };
    if (/^darwin/.test(process.platform)) {
        serverConfig.host = '0.0.0.0';
        serverConfig.livereload.port = 36666;
    }
    return gulp.src('./')
        .pipe(server(serverConfig));
});

// dev run webpack --watch
gulp.task('webpack-watch', function(callback) {
    var webpackConfig = require('./webpack.config.common.js');
    var webpackConfigDev = require('./webpack.config.dev.js');
    var config = webpackMerge(webpackConfig, webpackConfigDev);
    var finished = false;
    webpack(config).watch({
        aggregateTimeout: 300,
        ignored: /node_modules | src\/lib/
    }, function(err, stats) {
        if (err) {
            errorHandler('webpack-watch', err);
        }
        gutil.log('[webpack-build-watch]', stats.toString({
            colors: true,
            chunks: false
        }));
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
    var webpackConfigDll = require('./webpack.dll.dev.js');
    var config = webpackMerge(webpackConfigDll, {});
    webpack(config).run(function(err, stats) {
        if (err) {
            errorHandler('webpack-build-dll-dev', err);
        }
        gutil.log('[webpack-build-dll-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
});

// dev run webpack
gulp.task('webpack-build-dev', ['webpack-build-dll-dev'], function(callback) {
    var webpackConfig = require('./webpack.config.common.js');
    var webpackConfigDev = require('./webpack.config.dev.js');
    var config = webpackMerge(webpackConfig, webpackConfigDev);
    webpack(config).run(function(err, stats) {
        if (err) {
            errorHandler('webpack-build-dev', err);
        }
        gutil.log('[webpack-build-dev]', stats.toString({
            colors: true
        }));
        callback();
    });
});

/* >>>>>>>>>>>>>>>>>>>>>>>>>>> production begin <<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

// production 动态链接库
gulp.task('webpack-build-dll-production', function(callback) {
    var webpackConfigDll = require('./webpack.dll.dev.js');
    var webpackConfigDllProduction = require('./webpack.dll.production.js');
    var config = webpackMerge(webpackConfigDll, webpackConfigDllProduction);
    webpack(config).run(function(err, stats) {
        if (err) {
            errorHandler('webpack-build-dll-production', err);
        }
        gutil.log('[webpack-build-dll-production]', stats.toString({
            colors: true
        }));
        callback();
    });
});

// production run webpack
gulp.task('webpack-build-production', ['webpack-build-dll-production'], function(callback) {
    process.env.NODE_ENV = 'production'; // 为了使生产环境应用scss的压缩
    var webpackConfig = require('./webpack.config.common.js');
    var webpackConfigProduction = require('./webpack.config.production.js');
    var config = webpackMerge(webpackConfig, webpackConfigProduction);
    webpack(config).run(function(err, stats) {
        if (err) {
            errorHandler('webpack-build-production', err);
        }
        gutil.log('[webpack-build-production]', stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task('release-html', function() {
    return gulp.src(HTML_FILES)
        .pipe(revReplace({
            manifest: gulp.src('./assets/webpack-manifest.json'),
            replaceInExtensions: ['.html']
        }))
        .pipe(gulp.dest('./assets-html'));
});

/* >>>>>>>>>>>>>>>>>>>>>>>>>>> production end <<<<<<<<<<<<<<<<<<<<<<<<<<<<< */

// 启动开发环境，包含自动重编译，开发服务器和自动重载
// This will run in this order:
// * clean
// ...
// * xxx and xxx in parallel 写法['', '']
// * webserver
// * Finally call the callback function
gulp.task('dev', function(callback) {
    runSequence('clean',
        'webpack-build-dev',
        'webpack-watch',
        'webserver',
        callback);
});

gulp.task('production', function(callback) {
    runSequence('clean',
        'webpack-build-production',
        'release-html',
        callback);
});

// gulp 默认任务
gulp.task('default', ['dev']);
