/**
 * api 管理
 */

import request from '@/utils/request'

export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
        })
    },
    noticeCount() {
        return request({
            url: '/users/counts',
            method: 'get',
            data: {},
            mock: true
        })
    },
    menuList(params) {
        return request({
            url: '/menu/list',
            method: 'get',
            data: params,
            // mock: true
        })
    },
    menuOperate(params) {
        return request({
            url: '/menu/operate',
            method: 'post',
            data: params,
        })
    },
    userList(params) {
        return request({
            url: '/users/list',
            method: 'get',
            data: params,
        })
    },
    userDelete(params) {
        return request({
            url: '/users/delete',
            method: 'post',
            data: params,
        })
    },
    /**
     * 
     * @param {...user, action} params : action 传 edit 为修改，add 为新增
     * @returns 
     */
    userOperate(params) {
        return request({
            url: '/users/operate',
            method: 'post',
            data: params,
        })
    },
    roleList() {
        return request({
            url: '/roles/list',
            method: 'get',
            data: {},
        })
    },
    roleOperate(params) {
        return request({
            url: '/roles/operate',
            method: 'post',
            data: params,
        })
    },
    deptList() {
        return request({
            url: '/dept/list',
            method: 'get',
            data: {},
            mock: true
        })
    }
}