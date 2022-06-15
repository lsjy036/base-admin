import { getGoods,getBrands,getCategory,insertGood,deleteById } from "@/api/manage";
const state = {
    goods: [],
    brands:[],
    categoryLevel2:[],
    categoryLevel1:[],
    categoryLevel3:[],
}
const mutations={
    SET_GOODS(state,goods){
        state.goods = goods
    },
    SET_BRANDS(state,brands){
        state.brands = brands
    },
    SET_CATEGORY_LEVEL1(state,category){
        state.categoryLevel1 = category
    },
    SET_CATEGORY_LEVEL2(state,category){
        state.categoryLevel2= category
    },
    SET_CATEGORY_LEVEL3(state,category){
        state.categoryLevel3= category
    }
}
const actions={
    async getGoods({commit},data){
        let res = await getGoods(data)
        if(res.code === 0){
            commit('SET_GOODS',res.result)
            return Promise.resolve(res.totalNum)
        }
        else{
            return Promise.reject(res.message || 'error')
        }
    },
    async getBrands({commit}){
        let res = await getBrands()
        if(res.code === 0){
            commit('SET_BRANDS',res.result)
            return Promise.resolve(res.totalNum)
        }
        else{
            return Promise.reject(res.message || 'error')
        }
    },
    async getCategory({commit},data){
        let res = await getCategory(data)
        if(res.code === 0){
            if(data.level === 1) commit('SET_CATEGORY_LEVEL1',res.result)
            else if(data.level == 2 ) commit('SET_CATEGORY_LEVEL2',res.result)
            else commit('SET_CATEGORY_LEVEL3',res.result)
            return Promise.resolve()
        }
        else{
            return Promise.reject(res.message || 'error')
        }
    },
    async insertGood({},data){
        let res = await insertGood(data)
        if(res.code === 0){
            return Promise.resolve()
        }
        else{
            return Promise.reject(res.message || 'error')
        }
    },
    //删除品牌
    async deleteBrand({dispatch},data){
        let res = await deleteById(data)
        if(res.code === 0){
            dispatch('goods/getBrands').then((val)=>{
                return val
            }).catch(
                (val)=>{return val}
            )
        }
        else{
            return Promise.reject(res.message || 'error')
        }
    },
    //根据筛选条件选择商品
    async screenGood({commit},data){
        let res = await getGoods(data)
        if(res.code === 0){
            commit('SET_GOODS',res.result)
            console.log('筛选条件得到结果',res)
            return Promise.resolve(res.totalNum)
        }
        else{
            return Promise.reject(res.message || 'error')
        }
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}
