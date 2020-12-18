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
        text: "创建"
      },
      {
        value: 1,
        text: "采购复核"
      },
      {
        value: 2,
        text: "财务审批"
      },
      {
        value: 3,
        text: "一级部门审批"
      },
      {
        value: 4,
        text: "二级部门审批"
      },
      {
        value: 5,
        text: "三级部门审批"
      },
      {
        value: 6,
        text: "CEO审批"
      },
      {
        value: 7,
        text: "董事会审批"
      },
      {
        value: 8,
        text: "提交至金蝶"
      },
      {
        value: 9,
        text: "完成"
      },
      {
        value: 10,
        text: "驳回"
      },
      {
        value: 11,
        text: "作废"
      },

    ],
    
    
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
