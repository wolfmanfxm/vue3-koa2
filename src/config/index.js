/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || 'prod';

const EnvConfig = {
    dev: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/8a45fea4ba79f24ae9c00bdb0980a56c/api'
    },
    test: {
        baseApi: '//test.future.com/api',
        mockApi: 'https://www.fastmock.site/mock/8a45fea4ba79f24ae9c00bdb0980a56c/api'
    },
    prod: {
        baseApi: '//future.com/api',
        mockApi: ''
    },
}


export default {
    env,
    mock: true,
    namespace: 'vue3Koa2',
    ...EnvConfig[env]
}