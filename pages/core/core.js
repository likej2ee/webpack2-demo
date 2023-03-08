// 核心包，引入一些常量定义、网站配置项、公共函数、公共样式
import './core.scss';

// 处理全局对象兼容性
// import 'browser-polyfill';
// import URLSearchParams from 'url-search-params-polyfill';
// window.URLSearchParams = URLSearchParams;

// 引入公共脚本
import './app-config.js'; // 项目配置参数
import './global-constant.js'; // 公共常量
import './global-fn.js'; // 公共函数
import Vue from 'vue';
// import VueRouter from 'vue-router';

// 暴露全局定义
// Vue.use(VueRouter)
window.Vue = Vue;
// window.VueRouter = VueRouter;

if (__PRODUCTION__) {
    console.log('production');
}
