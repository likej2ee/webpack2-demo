// 核心包，引入一些常量定义、网站配置项、公共函数、公共样式
import './core.scss';

require('browser-polyfill');
require('./fn.js'); // 公共函数
window.$ = window.jQuery = require('jquery');
window.Vue = require('vue');
window.VueRouter = require('vue-router');

// if (__DEV__) {
//     console.log('开发环境输出');
// }
//
// if (__TEST__) {
//     console.log('测试环境输出');
// }
//
// if (__PRODUCTION__) {
//     console.log('生产环境输出');
// }
