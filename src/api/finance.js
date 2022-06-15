import request from '@/utils/request'
//查询品类top
export function getCategoryTop(data){
    return request({
        url:'statistics/getTopNCategories',
        method:'GET',
        params:data,
    })
}
//查询品牌top
export function getTopNBrands(data){
    return request({
        url:'statistics/getTopNBrands',
        method:'GET',
        params:data,
    })
}
//查询商品top
export function getTopNCommodity(data){
    return request({
        url:'statistics/getTopNCommodities',
        method:'GET',
        params:data,
    })
}