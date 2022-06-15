import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import store from '@/store'
import './permission' // permission control
import './icons'
import TreeTable from "vue-table-with-tree-grid";
import * as echarts from "echarts";
Vue.prototype.$echarts = echarts
Vue.use(Element)

Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
