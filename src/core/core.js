// 核心包，引入一些常量定义、网站配置项、公共函数、公共样式
console.log('core.js..');
import './core.scss';
require('browser-polyfill');
window.$ = window.jQuery = require('jquery');
window.Vue = require('vue');

if (__DEV__) {
    console.log('开发环境输出');
}

if (__TEST__) {
    console.log('测试环境输出');
}

if (__PRODUCTION__) {
    console.log('生产环境输出');
}
