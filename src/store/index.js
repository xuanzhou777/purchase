import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: { 
    typeList: [ //业务类型列表
      {
        value: undefined,
        text: "全部"
      },
      {
        value: 1,
        text: "耗材"
      },
      {
        value: 2,
        text: "仪器"
      },
      {
        value: 3,
        text: "服务"
      },
    ],
    statusList: [ // 单据状态
      {
        value: undefined,
        text: "全部"
      },
      {
        value: 0,
        text: "创建或驳回"
      },
      {
        value: 1,
        text: "采购复核"
      },
      {
        value: 2,
        text: "审批中"
      },
      {
        value: 3,
        text: "审批完成"
      },
      {
        value: 4,
        text: "已生成采购订单"
      }

    ],
    
    
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
