import axios from 'axios';

axios.defaults.baseURL = window.AGL.appConfig.service;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;

// Add a request interceptor
axios.interceptors.request.use(function(config) {
    // Do something before request is sent
    config.data = config.data.toString()
    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function(response) {
    // Do something with response data
    var res = {
        data: response.data,
        _response: response
    }
    return res;
}, function(error) {
    // Do something with response error
    return Promise.reject(error);
});

/**
 * 设置header参数
 * @param {Object} params 参数对象
 */
function setHeader(params) {
    axios.defaults.headers.common = Object.assign(axios.defaults.headers.common, params)
}

/**
 * 业务成功失败的验证方法
 * @return {Boolean} 返回业务成功or失败
 */
function validate() {
    var result = true;
    return result;
}

export default {
    post: axios.post,
    get: axios.get,
    setHeader: setHeader,
    validate: setHeader
}
