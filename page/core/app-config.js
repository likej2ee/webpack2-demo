window.AGL = window.AGL || {};

if (__DEV__) {
    window.AGL.appConfig = {
        service: 'http://127.0.0.1/api/',
        domain: 'http://www.xxx.com'
    }
}

//
// if (__TEST__) {
//     console.log('测试环境输出');
// }

if (__PRODUCTION__) {
    window.AGL.appConfig = {
        service: '/api/',
        domain: 'http://www.xxx.com'
    }
}
