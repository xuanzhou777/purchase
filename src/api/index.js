// const API_SERVER = "http://192.168.60.81:9001/bio_analysis" // 测试环境
const API_SERVER ="http://192.168.100.176:3003" // 正式环境



module.exports = {
  // API 接口
  login: `http://192.168.100.176:3001/api/v1/auth/logins`, // 登录
  createOrder: `${API_SERVER}/api/v1/orders`, // 创建订单
  modifyOrder: `${API_SERVER}/api/v1/orders/%s`, // 修改订单
  deleteOrder:  `${API_SERVER}/api/v1/orders/%s`, // 删除订单
  createMaterials: `${API_SERVER}/api/v1/materials`, // 创建物料
  modifyMaterials: `${API_SERVER}/api/v1/materials/%s`, // 修改物料
  deleteMaterials: `${API_SERVER}/api/v1/materials/%s`, // 删除物料
  orderDetail: `${API_SERVER}/api/v1/orders/%s`, // 获取采购订单详情
  k3Materials: `${API_SERVER}/api/v1/k3-materials`, // 获取金蝶物料信息
  k3Suppliers: `${API_SERVER}/api/v1/k3-suppliers`, // 获取金蝶供应商信息
  changeApplyStatus: `${API_SERVER}/api/v1/orders/%s/status`, // 修改申请单状态
  orderList:  `${API_SERVER}/api/v1/orders`, // 获取申请单列表
  createService: `${API_SERVER}/api/v1/services`, // 创建服务
  modifyService: `${API_SERVER}/api/v1/services/%s`, // 修改服务
  deleteService: `${API_SERVER}/api/v1/services/%s`, // 删除服务
  // agreeOrder:  `${API_SERVER}/api/v1/orders/%s/audits/forwards`, // 审核同意采购申请
  // refuseOrder: `${API_SERVER}/api/v1/orders/%s/audits/backwards`, // 驳回同意采购申请
  sbtK3: `${API_SERVER}/api/v1/orders/%s/submissions`, // 提交至金蝶系统
  getTeams:  `http://192.168.100.176:3001/api/v1/teams`, // 获取部门列表
  getPros: `http://192.168.100.176:3002/api/v1/projects`, // 获取项目列表
}
