window.AGL = window.AGL || {};

if (__DEV__) {
    window.AGL.appConfig = {
        service: 'http://127.0.0.1/api/',
        domain: 'http://www.xxx.com'
    }
}


if (__TEST__) {
    window.AGL.appConfig = {
        service: 'http://127.0.0.1/api/',
        domain: 'http://twww.xxx.com'
    }
}

if (__PRODUCTION__) {
    window.AGL.appConfig = {
        service: '/api/',
        domain: 'http://www.xxx.com'
    }
}
