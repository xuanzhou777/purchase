<template>
  <div class="wrap">
    <!--header-->
    <com-header v-bind:active="active"></com-header>
    <div class="spin-box" v-if="!isLoad">
      <a-spin size="large" tip="页面加载中..." />
    </div>
    <div class="main-box" v-else>
      <p class="back-link"> <router-link :to="backurl"><a-icon type="double-left" /> 返回</router-link></p>
      <!--审核模块-->
      <div class="review-box form" v-if="(status==1 && isChecker) || (status>1 && status<8 && isReviewer)">
        <div class="main-cnt">
          <a-form-model :model="review" :label-col="{ span: 4 }" :wrapper-col="{ span: 14}">
            <a-form-model-item label="审核结果">
              <a-radio-group v-model="review.res">
                <a-radio :value= 1>
                  通过
                </a-radio>
                <a-radio :value= 2>
                  驳回
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="理由">
              <a-input v-model="review.reason" type="textarea" />
            </a-form-model-item>
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-button type="primary" @click="onReviewSubmit" :loading="sbtLoad" :disabled="sbtDisable">
                提交
              </a-button>
            </a-form-model-item>
          </a-form-model>
        </div>
       
      </div>
      <!--修改审核人模块-->
      <!-- <div class="modify-box form">
        <div class="main-cnt">
          <a-form-model  :label-col="{ span: 4 }" :wrapper-col="{ span: 14}">
            <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
              <a-popconfirm title="确定跳过此步审核?" ok-text="确定" cancel-text="取消" @confirm="() => onJumpSubmit()">
                <a-button type="primary">
                  跳过此步审核
                </a-button>
              </a-popconfirm>
              
            </a-form-model-item>
            <a-form-model-item label="更改审核人" >
              <a-tree-select
                v-model="value"
                tree-data-simple-mode
                style="width: 50%;display:inline-block;"
                :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                :tree-data="treeData"
                placeholder="请选择审核人"
                :load-data="onLoadData"
              />
              <a-button type="primary"  style="display:inline-block;margin-left: 10px" @click="changeReviewer">
                确定更改
              </a-button>
            </a-form-model-item>
          
          </a-form-model>
        </div>
      </div> -->
      
      <!--未提交申请前 可修改删除-->
      <div class="fun-box" v-if="(status==0 || status==10)&& (user.username == orderData.appliedByUsername)">
        <a-button type="primary" icon="form" @click="modifyApply">
          修改
        </a-button>
        <a-popconfirm  v-if="!orderData.audit" title="确定删除这条采购申请单?" ok-text="确定" cancel-text="取消" @confirm="() => deleteOrder()">
          <a-button type="danger"  icon="delete" style="margin-left: 15px;" :loading="deleteLoading" :disabled="deleteDisable"> 
            删除
          </a-button>
        </a-popconfirm>
       
      </div>
      <!--生成金蝶采购订单-->
      <a-button type="primary" class="jindieBtn" icon="check-circle"  :loading="jdLoad" :disabled="jdDisable" @click="jindieFun" v-if="status==8 && isChecker">
        生成金蝶采购订单
      </a-button>


      <!--订单详情-->
      <div class="order-box">
        <div class="title">采购申请详情</div>
        <div class="order-detail">
          <a-card title="采购基础信息" class="info-box">
            <div class="type1">
              <div class="line">
                <p class="two"><span>单据编号：</span>{{orderData.num}}</p>
                <p class="two"><span>申请日期：</span>{{orderData.appliedTime.substring(0, 10)}}</p>
              </div>
              <div class="line">
                <p class="two"><span >业务类型：</span>{{typeList[orderData.categoryNum].text}}</p>
                <p class="two"><span >单据状态：</span>{{statusList[orderData.status+1].text}}</p>
              </div>
              <div class="line">
                <p class="two"><span>申请人：</span>{{orderData.appliedBy.name}} {{orderData.appliedByUsername}}</p>
                <p class="two"><span>申请部门：</span>{{orderData.reviewTeam.name}}</p>
              </div>
              <div class="line">
                <p><span >备注：</span>{{orderData.remark}}</p>
              </div>
              <div class="line">
                <p><span>总金额：</span>{{orderData.fee}}</p>
              </div>
            </div>
              
          </a-card>
          
          <a-card title="审核进度条" class="time-line" v-if="status >= 2 && status <10">
            <a-timeline>
              <a-timeline-item v-for="(item, i) in orderData.audit.auditSteps" :key="i" :color="orderData.audit.currentStep >item.step? 'green' : 'gray'" >
                <a-icon slot="dot" type="check-circle-o" style="font-size: 16px;" v-if="orderData.audit.currentStep > item.step" />
                <a-icon slot="dot" type="double-right-o" style="font-size: 16px; color: orange" v-if="orderData.audit.currentStep == item.step" />
                <div>{{item.time}} {{item.username}} {{item.userName}} {{item.name}} {{item.result}} </div>
                <div v-if="item.reason!= ''">理由：{{item.reason}}</div>
              </a-timeline-item>
            </a-timeline>
          </a-card>

          <!--被驳回的情况-->
          <a-card title="申请单日志" class="time-line" v-if="status == 10 || status == 11">
            <a-timeline>
              <a-timeline-item v-for="(item, i) in auditList" :key="i"  >
                <div>{{item.time}} {{item.username}} {{item.userName}} {{item.name}} {{item.result}} </div>
                <div v-if="item.reason!= ''">理由：{{item.reason}}</div>
              </a-timeline-item>
            </a-timeline>
          </a-card>

        </div>
      </div>

    

      <!--服务信息-->
      <div class="ma-box" v-if="cate==3">
        <div class="ma-tit">
          服务信息
          <div class="hit" v-if="(status ==1 || status==3) && isChecker">双击表格进行修改</div>
        </div>
        <!--表格-->
        <a-table bordered :columns="serviceColumns"  :data-source="data" :pagination ="false" class="table" 
          :loading = "tableLoad"
          :rowKey="(record,index) => index"
          :customRow="tableClick"
          :scroll="{ x: 2000}">
          <template slot="date" slot-scope="text">
            {{text.substring(0, 10)}}
          </template>
        </a-table>
      </div>

      <!--物料信息-->
      <div class="ma-box" v-else>
        <div class="ma-tit">
          物料信息
          <div class="hit" v-if="(status ==1 || status==3) && isChecker">双击表格进行修改</div>
        </div>
        <!--表格-->
        <a-table bordered :columns="columns"  :data-source="data" :pagination ="false" class="table" 
          :loading = "tableLoad"
          :rowKey="(record,index) => index"
          :customRow="tableClick"
          :scroll="{ x: 2000}">
          <template slot="date" slot-scope="text">
            {{text.substring(0, 10)}}
          </template>
        </a-table>
      </div>

      
    </div>

    <!--修改物料信息组件-->
    <add-form
      ref="addForm"
      :isNew = false
      :cate = cate
      :initData = maData
      :modfyIdx = modfyIdx
      :orderId = id
      :disableSbt = disableSbt
      :projectList = projectList
      v-on:MaCallBack = "MaCallBack"
    ></add-form>
  
  </div>
</template>

<style scoped>
.spin-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  width: 100%;
  height: 100vh;
}
.main-box{
  margin-top: 20px;
  margin-left: 30px;
}
.main-box .back-link{
  margin: 10px 0;
}
.main-box .title{
  font-size: 26px;
  line-height: 60px;
  text-align: center;
}
.review-box, .huoStatus{
  border-bottom: 1px solid #eaeaea;
}
.modify-box{
  padding-top: 20px;
  border-bottom: 1px solid #eaeaea;
}
.main-cnt{
  width: 1000px;
}
.jindieBtn{
  margin: 20px 0;
}
.order-box{
  width: 1000px;
}
.order-box .order-detail{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.order-detail .info-box{
  width: 500px;
}
.order-detail .time-line{
  width: 400px;
}
.info-box .line{
  display: flex;
}
.info-box .line p.two{
  width: 50%;
}
.info-box .line span{
  font-weight: bold;
}
.ma-box{
  padding-bottom: 30px;
}
.ma-box .ma-tit{
  margin: 20px 0;
  font-size: 18px;
  font-weight: bold;
}
.ma-box .ma-tit .hit{
  font-size: 12px;
}
.table /deep/ .ant-table-thead > tr > th, .table /deep/ .ant-table-tbody > tr > td{
  padding: 10px 5px;
}
.fun-box{
  display: flex;
  margin: 20px 0;
}
</style>

<script>

const columns = [
  {
    title: '供应商代码',
    dataIndex: 'supplierNum',
    width: 150,
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 300,
  },
 
  {
    title: '物品编号',
    dataIndex: 'k3MaterialNum',
    width: 100,
  },
  {
    title: '物品编名称',
    dataIndex: 'name',
    width: 200,
  },
  {
    title: '货号',
    dataIndex: 'itemNumber',
    width: 100,
  },
  {
    title: '规格型号',
    dataIndex: 'modelNumber',
    width: 200,
  },
  {
    title: '单位',
    dataIndex: 'unit',
    width: 100,
  },
  {
    title: '品牌',
    dataIndex: 'brand',
    width: 200,
  },
  {
    title: '技术要求',
    dataIndex: 'specification',
    width: 200,
  },
  {
    title: '数量',
    dataIndex: 'amount',
    width: 100,
  },
  {
    title: '单价',
    dataIndex: 'price',
    width: 200,
  },
  {
    title: '金额',
    dataIndex: 'fee',
    width: 200,
  },
  {
    title: '项目编号',
    dataIndex: 'projectNum',
    width: 100,
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    width: 200,
  },
  {
    title: '申请采购原因及用途',
    dataIndex: 'reason',
    width: 400,
  },
  {
    title: '需要到货时间',
    dataIndex: 'expectArrivalDate',
    width: 100,
    scopedSlots: { customRender: 'date' },
  },
  {
    title: '金蝶采购订单号',
    dataIndex: 'k3poNum',
    width: 200,
  },
];

const serviceColumns = [
  
  {
    title: '供应商代码',
    dataIndex: 'supplierNum',
    width: 150,
  },
  {
    title: '供应商名称',
    dataIndex: 'supplierName',
    width: 300,
  },
 
  {
    title: '项目编号',
    dataIndex: 'projectNum',
    width: 100,
  },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    width: 200,
  },
  {
    title: '项目地址',
    dataIndex: 'projectAddress',
    width: 200,
  },
  {
    title: '计划完成日期',
    dataIndex: 'dueDate',
    width: 100,
    scopedSlots: { customRender: 'date' },
  },
  {
    title: '需求内容',
    dataIndex: 'specification',
    width: 300,
  },
  {
    title: '备注',
    dataIndex: 'remark',
  }
];

// @ is an alias to /src
import Api from "@/api/index.js";
import Http from "@/util/http.js";
import { mapState } from "vuex";
import ComHeader from "@/components/ComHeader.vue"
import AddForm from "@/components/AddForm.vue"


export default {
  name: "Detail",
  components: {
    ComHeader:ComHeader,
    AddForm:AddForm
  },
  data () {
  
    return {
      active: "", // 当前页
      loading: false,
      disabled: false,
      backurl: "/mine",
      orderData: {}, // 订单数据
      review: {
        res: 1,
        reason: ""
      }, // 审核结果
      value: undefined,
      treeData: [
        { id: 1, pId: 0, value: '1', title: 'Expand to load' },
        { id: 2, pId: 0, value: '2', title: 'Expand to load' },
        { id: 3, pId: 0, value: '3', title: 'Tree Node', isLeaf: true },
      ],
      columns,
      serviceColumns,
      data:[], // 表格数据
      tableLoad: false,
      isLoad: false,
      user: {}, // 用户信息
      id: -1, // 申请id
      cate: -1, // 类别
      isChecker: false, // 是否有采购复核的权限
      isReviewer: false, // 是否有审核者权限
      status: "", // 申请单状态
      modfyIdx: -1,
      maData: {}, // 表格数据
      sbtLoad: false,
      sbtDisable: false,
      deleteDisable: false,
      deleteLoading: false,
      jdLoad: false,
      jdDisable: false,
      auditList: [], // 审核列表
      disableSbt: false,
      projectList: [], // 项目列表
    }
  },
  computed: {
    ...mapState({
      typeList: state => state.typeList,
      statusList: state => state.statusList,
    }),
  },
  watch: {
    value(value) {
      console.log(value);
    },
  },
  mounted(){
    if (!sessionStorage.getItem("token")) {
      this.$router.push({ name: "login"});
    } else {
      this.user = JSON.parse(sessionStorage.getItem("userInfo"));
      this.judgeChecker();
      if(this.$route.query.id) {
        this.id = parseInt(this.$route.query.id);
        this.renderPage();
      } else {
        this.$message.error("参数错误!");
      }
    }
  },
  methods: {
    renderPage() { // 渲染页面
      let url = Api.orderDetail.replace(/%s/, this.id);
      Http.AJAXGET(this, url, "GET", (res)=>{
        this.orderData = res;
        this.cate = res.categoryNum;
        this.status = res.status;
       
        if(res.status > 1) {
          this.disableSbt = true;
        }
        if(res.audit) { // 有审核流的情况
          console.log('sss')
          this.renderAuditList(res.audit.auditSteps);
        } else if(this.status == 10 && !res.audit) { // 没审核流，被采购驳回的
          console.log('sss111')
          this.renderLogs(res.logs);
        }
        
        if (res.categoryNum ==3) {
          this.data = res.services;
        } else{
          this.data = res.materials;
        }
        if (this.isChecker) {
          this.getProjectList();
        }
        if(res.status > 1 && res.status < 8) {
          this.judgeReview();
        }
        
        this.isLoad = true;
        
      })
    },
    onReviewSubmit() { // 提交审核信息
      
      // 审核
      let nextStatus; // 下一步审核的状态
      if (this.status == 1 ) { // 财务审核之前
        nextStatus = 2;
       
      } else { // 获取下一步审核状态
        nextStatus = this.getNextStatus();
      }
      console.log(nextStatus)
      let data = {};
      if (this.review.res === 1) { // 成功
        data = {
          status: nextStatus,
          remark: this.review.reason
        }
      } else { // 失败
        data = {
          status: 10,
          remark: this.review.reason
        }
      }
      
      let url = Api.changeApplyStatus.replace(/%s/, this.id)
      this.sbtLoad = true;
      this.sbtDisable = true;
      Http.AJAXPOST(this, url, "patch", data, (res)=>{
        // 提交成功 返回个人中心
        this.$message.success("申请单审核成功！");
        setTimeout(()=>{
          this.$router.push({path: "/mine"})
        }, 1500)
      }, ()=>{
        this.sbtLoad = false;
        this.sbtDisable = false;
      })

    },
    genTreeNode(parentId, isLeaf = false) {
      const random = Math.random()
        .toString(36)
        .substring(2, 6);
      return {
        id: random,
        pId: parentId,
        value: random,
        title: isLeaf ? 'Tree Node' : 'Expand to load',
        isLeaf,
      };
    },
    onLoadData(treeNode) {
      return new Promise(resolve => {
        const { id } = treeNode.dataRef;
        setTimeout(() => {
          this.treeData = this.treeData.concat([
            this.genTreeNode(id, false),
            this.genTreeNode(id, true),
          ]);
          resolve();
        }, 300);
      });
    },
    changeReviewer() { // 更改审核人 todo

    },
    onJumpSubmit() { // 跳过此步审核 todo

    },
    jindieFun() { // 生成金蝶采购订单
      this.jdDisable = true;
      this.jdLoad = true;
      let data = {
        status: 9,
        remark: ""
      }
      let url = Api.changeApplyStatus.replace(/%s/, this.id);
      Http.AJAXPOST(this, url, "patch", data, (res)=>{
        // 提交成功 返回个人中心
        this.$message.success("物料信息已发送至金蝶系统！");
        setTimeout(()=>{
          this.$router.push({path: "/mine"})
        }, 1500)
      }, ()=>{
        this.jdDisable = false;
        this.jdLoad = false;
      })
    },
    tableClick(record, index){ // 表格双击事件
      return {
        on: {
            dblclick: () => {
              console.log(record,index);
              if(this.isChecker) {
                this.maData = this.data[index];
                this.modfyIdx = index;
                setTimeout(()=>{
                  this.$refs.addForm.showDrawer();
                },0);
              }
              
            }
        }
      }
    },
    deleteOrder() { // 删除订单
      // 先删除 物料信息 再删除订单
      this.deleteDisable = true;
      this.deleteLoading = true;
      if (this.data.length > 0) {
        var promiseArray = [];
          for(let i= 0; i<this.data.length; i++) {
            promiseArray.push(this.promiseItem(i));
            
          }
          Promise.all(promiseArray)
            .then((result) => {
              console.log(result);
              let url = Api.deleteOrder.replace(/%s/, this.id);
              Http.AJAXGET(this, url, "delete", (res)=>{
                this.$message.success("申请单删除成功！");
                setTimeout(()=>{
                  this.$router.push({path: "/mine"})
                }, 1500)
              },()=>{
                this.deleteDisable = false;
                this.deleteLoading = false;
              }) 
              
            })
      } else {
        console.log(1)
        let url = Api.deleteOrder.replace(/%s/, this.id);
        Http.AJAXGET(this,url, "delete", (res)=>{
          this.$message.success("申请单删除成功！");
          setTimeout(()=>{
            this.$router.push({path: "/mine"})
          }, 1500);

        },()=>{
          this.deleteDisable = false;
          this.deleteLoading = false;
        }) 
      }

    },
    modifyApply() { // 修改采购申请
      this.$router.push({path: `/modify?id=${this.id}`})

    },
    judgeChecker() { // 判断是否有采购复核的权限
      if(this.user.roles.length > 0) {
        let perList = this.user.roles[0].perms; 
        for(let item of perList){
          if(item.name === "pa_order_review" ){
            this.isChecker = true;
            break;
          }
        }
      }
      
    },
    judgeReview() { // 判断是否有审核权限
      let current = this.orderData.audit.currentStep;
      if(this.orderData.audit.auditSteps[current-1].username === this.user.username ){
        this.isReviewer = true;
      }
    },
    MaCallBack(data) {
      console.log(data);
      this.$set(this.data,this.modfyIdx,data);
      // 计算总金额
      let num =0
      for (let item of this.data) {
        num = num + item.fee;
      }
      this.orderData.fee = num;
      console.log(this.orderData.fee)
    },
    promiseItem(i) {
      let url;
      if (this.cate == 3) {
        url = Api.deleteService.replace(/%s/, this.data[i].id)
      } else {
        url = Api.deleteMaterials.replace(/%s/, this.data[i].id);
      }
      var p = new Promise((resolve, reject)=> {  //做一些异步操作
        Http.AJAXGET(this,url, "delete", (res)=>{
          resolve(i + "信息删除成功");
          console.log(res);
        }) 
      });
      return p; 
    },
    renderAuditList(list) { // 渲染审核流列表
      list.sort(function(a, b){return a.step - b.step});
      for(let i =0 ;i<list.length; i++){
        list[i].time = "";
        list[i].result = "";
        list[i].reason = "";
        list[i].userName = list[i].user? list[i].user.name : "";
        if (list[i].name == "新建") {
          list[i].time = this.formatTime(this.orderData.appliedTime);
        } 
        if (list[i].logs.length > 0) {
          list[i].time = this.formatTime(list[i].logs[list[i].logs.length -1].createdTime);
          list[i].result = list[i].logs[list[i].logs.length -1].action === 7 ? "驳回" : "通过";
          list[i].reason = list[i].logs[list[i].logs.length -1].content;
        } 
      }
      
      this.auditList = list;
      console.log(list)
    },
    formatTime(str) { // 格式化时间
      var date = new Date(str);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
      var D = date.getDate() < 10 ?  '0'+date.getDate()+ ' ' : date.getDate()+ ' ';
      var h = date.getHours() < 10 ? '0'+date.getHours()+ ':' : date.getHours()+ ':';
      var m = date.getMinutes() < 10 ? '0'+date.getMinutes()+ ':' : date.getMinutes()+ ':';
      var s = date.getSeconds()< 10 ? '0'+date.getSeconds() : date.getSeconds();
      return Y+M+D+h+m+s;
    },

    getProjectList(){ // 获取项目列表
      let user = this.orderData.appliedByUsername;
      let url = `${Api.getPros}?memberUsername=${user}`;
      Http.AJAXGET(this, url, "get", (res)=>{
        this.projectList = res.data;
        let item = {
          num: "公用",
          name: "自定义项目名称"
        }
        this.projectList.unshift(item);
      })

    },
    getNextStatus() { // 获取下一个状态
      let current = this.orderData.audit.currentStep;
      console.log(this.auditList)
      if (this.auditList[current].status == 8) {
        return 8
      } else if (this.auditList[current].status == 9) {
        return 9
      } else {
        while (!this.auditList[current].username ) {
          current ++ ;
          if(this.auditList[current].status == 8 || this.auditList[current].status == 9) {
            break;
          }
        }
        return this.auditList[current].status;
      }
      
    },
    renderLogs(list) { // 被采购驳回的情况
      let obj = [];
      obj[0] = {
        name: "新建",
        reason: "",
        result: "",
        username: list[0].createdByUsername,
        userName: this.orderData.appliedBy.name,
        time: this.formatTime(list[0].createdTime)
      };
      obj[1] = {
        name: "采购复核",
        reason: list[1].content,
        result: "驳回",
        username: list[1].createdByUsername,
        userName: "",
        time: this.formatTime(list[0].createdTime)
      };
      this.auditList = obj;
    },
  },
}
</script>
