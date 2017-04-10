// 核心包，引入一些常量定义、网站配置项、公共函数、公共样式
import './core.scss';

require('browser-polyfill');
require('./config.js'); // 项目配置参数
require('./global-constant.js'); // 公共常量
require('./global-fn.js'); // 公共函数

window.Vue = require('vue');
window.VueRouter = require('vue-router');

// if (__PRODUCTION__) {
//
// }
