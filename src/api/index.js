/**
 * api 管理
 */

import request from './../utils/request'

export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
            // mock: false
        })
    },
    noticeCount() {
        return request({
            url: '/users/counts',
            method: 'get',
            data: {},
        })
    },
    menuList() {
        return request({
            url: '/menu/list',
            method: 'get',
            data: {},
        })
    }
}