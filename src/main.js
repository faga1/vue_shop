import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/css/iconfont.css'
// 导入NProgress包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在request 拦截器中显示进度条NProgress.start()
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
// 在resopnse拦截器中隐藏进度条NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.component('tree-table', TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
