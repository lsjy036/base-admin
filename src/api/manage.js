import request from '@/utils/request'
//筛选条件获取商品
export function getGoods(data){
    return request({
        url:'/commodity/queryCommodityByConditionByPage',
        method: 'POST',
        data
    })
}
//获取全部品牌
export function getBrands(){
    return request({
        url:'/brand/queryAll',
        method:'GET',
    })
}
//获取品类
/**
 * 
 * @param {level:number} data 
 * @returns 
 */
export function getCategory(data){
    return request({
        url:'/category/queryByLevel',
        method:'GET',
        params:data
    })
}
//新增品类
export function insertCategory(data){
    return request({
        url:'/category/insert',
        method:'POST',
        data
    })
}
//新增商品
export function insertGood(data){
    return request({
        url:'/commodity/insert',
        method:'POST',
        data,
    })
}
//删除品牌
export function deleteById(data){
    return request({
        url:'/brand/deleteById',
        method:'GET',
        params:data
    })
}
//新增品牌
export function insertBrand(data){
    return request({
        url:'/brand/insert',
        method:'POST',
        params:data
    })
}
//查询所有品类
export function categoryMap(){
    return request({
        url:'category/queryMap',
        method:'GET',
    })
}
//删除品类
export function deleteCategory(data){
    return request({
        url:'category/delete',
        method:'GET',
        params:data,
    })
}
//根据商品id查询商品信息
export function queryGood(data){
    return request({
        url:'commodity/queryById',
        method:'GET',
        params:data,
    })
}
//删除商品
export function deleteCommodity(data){
    return request({
        url:'commodity/deleteCommodity',
        method:'GET',
        params:data,
    })
}
//上架商品
export function putOnSaleById(data){
    return request({
        url:'commodity/putOnSaleById',
        method:'GET',
        params:data,
    })
}
//下架商品
export function putOfflineById(data){
    return request({
        url:'commodity/putOfflineById',
        method:'GET',
        params:data,
    })
}
//更新商品基本信息
export function updateCommodity(data){
    return request({
        url:'commodity/updateCommodity',
        method:'POST',
        data,
    })
}
//请求商品的主图
export function getMainPicOfGood(data){
    return request({
        url:"commoditypic/queryMainPicByCommodityId",
        method:"GET",
        params:data,
    })
}
//请求商品的详情图
export function getDetailPicOfGood(data){
    return request({
        url:"commoditypic/queryDetailPicByCommodityId",
        method:"GET",
        params:data,
    })
}
//请求全部订单
export function getOrders(data){
    return request({
        url:'orderInfo/queryAllByPage',
        method:"POST",
        data
    })
}
//通过订单用户名搜索商品订单
export function searchOrdersByName(data){
    return request({
        url:"orderInfo/queryByCustomerNameByPage",
        method:"POST",
        data
    })
}
//通过时间搜索商品订单
export function searchOrdersByTime(data){
    return request({
        url:"orderInfo/queryByTimeByPage",
        method:"POST",
        data
    })
}
//请求全部退货订单
export function queryAllOrdersBack(data){
    return request({
        url:'backOrderInfo/queryAllByPage',
        method:'POST',
        data
    })
}

//请求全部进货订单
export function queryAllStock(data){
    return request({
        url:'stock/queryAllByPage',
        method:'POST',
        data,
    })
}


