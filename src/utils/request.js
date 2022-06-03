/**
 * axios 二次封装
 */

import axios from "axios";
import config from "../config";
import { ElMessage } from "element-plus";
import router from "../router";

const TOKEN_INVALID = 'Token authenticating failed, try to login again'
const NETWORK_ERROR = 'Network request failed, please try next time'

// 创建 axios 实例对象，添加全局配置
const service = axios.create({
    baseURL: config.baseApi,
    timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
    // TODO: token
    const headers = req.headers;
    if (!headers.Authorization) headers.Authorization = 'Bear Fang'
    return req;
})

// 响应拦截
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data;
    console.log('code =>', code)
    if (code == 200) { return data; }
    else if (code === 40001) {
        ElMessage.error(TOKEN_INVALID);
        setTimeout(() => {
            router.push('/login')
        }, 2000);
        return Promise.reject(TOKEN_INVALID)
    } else {
        ElMessage.error(msg || NETWORK_ERROR);
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

/**
 * 项目 request 封装核心函数
 * @param {*} options 请求配置
 */
function request(options) {
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data;
    }
    if (typeof options.mock != 'undefined') {
        config.mock = options.mock;
    }

    if (config.env === 'prod') {
        service.defaults.baseURL = config.baseApi
    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }

    return service(options);
}

// 部分项目组人员习惯使用 request.get() 方式，给 request 函数增加属性，拓展使用
['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    request[item] = (url, data, options) => {
        return request({
            method: item,
            url,
            data,
            ...options
        })
    }
})

export default request;
