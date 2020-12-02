import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import axios from "axios"
import VueAxios from "vue-axios"
import globalVariable from "@/util/global_variable.js";

Vue.config.productionTip = false
Vue.use(Antd);
Vue.use(VueAxios,axios);
Vue.prototype.GLOBAL = globalVariable

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
