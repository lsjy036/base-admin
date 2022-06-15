import request from '@/utils/request'
//请求所有活动，不分上线或下线
export function queryAllActivities(data){
    return request({
        url:'/activity/queryAllByPage',
        method:'POST',
        data
    })
}
//改变活动状态
export function changeStatus(data){
    return request({
        url:'/activity/updateStatus',
        method:'POST',
        data
    })
}
//仅查看上线活动
export function queryOnline(data){
    return request({
        url:'/activity/queryOnlineByPage',
        method:'POST',
        data
    })
}
//新增活动
export function insertAct(data){
    return request({
        url:'/activity/insert',
        method:'POST',
        data
    })
}