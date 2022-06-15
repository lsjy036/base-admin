import Cookie from 'js-cookie'
const state = {
    sidebar: {
        isCollapse: Cookie.get('sidebarStatus') ? !!+Cookie.get('sidebarStatus') : false,
        withoutAnimation: false
    },
    width: Cookie.get('sidebarStatus') ? "68px" : "200px"
}
const mutations = {
    TOGGLE_SIDEBAR:  (state)=> {
        state.sidebar.isCollapse = !state.sidebar.isCollapse
        if (state.sidebar.isCollapse) {
            Cookie.set('sidebarStatus', 1)
            state.width = "68px" 
        }
        else {
            Cookie.set('sidebarStatus', 0)
            state.width = "200px" 
        }
    },

}
const actions = {
    toggleSideBar({ commit }) {
        commit('TOGGLE_SIDEBAR')
    },
    setWidth({commit}){
        commit('SET_WIDTH')
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions
}