<template>
  <div class="wrap">
    <!--header-->
    <com-header v-bind:active="active"></com-header>

    <div class="main-box">
      <p class="back-link"> <router-link to="/mine"><a-icon type="double-left" /> 返回个人中心</router-link></p>
      <div class="title">修改采购申请</div>
    </div>
    
    
   

    <!--提交信息按钮-->
    <div class="btn-box">
      <a-button type="primary" class="save-btn" @click="saveApply" :loading="saveLoad" :disabled="saveDisable">
        保存申请数据
      </a-button>
      <a-button type="primary"  class="sbt-btn" @click="submitApply" :loading="sbtLoad" :disabled="sbtDisable">
        提交采购申请
      </a-button>
    </div>
     
    <!--基础信息-->
    <div class="basic" v-if="user.name">
      <div class="item">申请日期：{{dateNow}}</div>
      <div class="item">申请人编号： {{user.username}}</div>
      <div class="item">申请人名称： {{user.name}}</div>
    </div>
     <!--申请部门-->
    <div class="term-box">
      申请部门： 
      <div v-if="!showChangeTeam" class="term-txt" >{{team.name}}  <a href="javascript:;" @click="showTeam()" class="link">切换部门</a></div>
      <div class="term-select" v-else>
        <a-select v-model="selectTeamId"
            style="width: 250px"
            placeholder="请选部门"
          >
            <a-select-option  v-for="item in teamList" :key="item.id" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
        <a-button type="primary" class="term-btn" @click="saveChangeTeam">
          确定
        </a-button>
        <a-button type="defalut" @click="cancelTeam()">
          取消
        </a-button>
      </div>

    </div>

    <!--选择业务类型 决定渲染哪个表单-->
      <div class="select-box">
        <div class="label">业务类型：</div>
        <a-select v-model="categoryName"
          :disabled = true
          @change = "changeCate"
          placeholder="请选择业务类型"
        >
          <a-select-option  v-for="item in typeList" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
        </a-select>
      </div>
      
      
      <a-form-model :model="form1" ref="OrderFormType"  :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }" class="form">
        <!-- <a-form-model-item  label="单据编号"  >
          <a-input
            :disabled = true
          />
        </a-form-model-item> -->
            
        <a-form-model-item label="备注" prop="remark">
          <a-textarea
            v-model="form1.remark"
            placeholder="请输入备注"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-model-item>
        <!-- <a-form-model-item  label="金额"  >
          <a-input :disabled = true
            type="number"
            prefix="￥" suffix="RMB"
          />
        </a-form-model-item> -->
      </a-form-model>




      <!--物料数据-->
      <div class="ma-box" >
        <!--添加物料数据-->
        <a-button type="default" icon="file-add" class="add-btn" @click="add" v-if="categoryName == 1">
          添加物料数据
        </a-button>
        <a-button type="default" icon="file-add" class="add-btn" @click="add" v-else-if="categoryName == 2">
          添加仪器数据
        </a-button>
        <a-button type="default" icon="file-add" class="add-btn" @click="add" v-else>
          添加服务数据
        </a-button>

        <!--物料/仪器表格-->
        <a-table v-if="categoryName!=3" bordered :columns="columns"  :data-source="material"  :pagination ="false" class="table" 
          :rowKey="(record,index) => index"
          :customRow="tableClick"
          :scroll="{ x: 2000, y: 300 }">
            <template slot="action" slot-scope="text, record, index">
              <a href="javascript:;" @click="() => modifyMa(index)">修改</a>
              <a-popconfirm title="确定删除这条信息?" ok-text="确定" cancel-text="取消" @confirm="() => deleteMa(index)">
                <a href="javascript:;" class="de-btn">删除</a>
              </a-popconfirm>
            </template>
            <template slot="date" slot-scope="text">
              {{text.substring(0, 10)}}
            </template>
        </a-table>

        <!--服务表格-->
        <a-table v-else bordered :columns="serviceColumns"  :data-source="material" :pagination ="false" class="table" 
          :rowKey="(record,index) => index"
          :customRow="tableClick"
          :scroll="{ x: 1920}">
            <template slot="action" slot-scope="text, record, index">
              <a href="javascript:;" @click="() => modifyMa(index)">修改</a>
              <a-popconfirm title="确定删除这条信息?" ok-text="确定" cancel-text="取消" @confirm="() => deleteMa(index)">
                <a href="javascript:;" class="de-btn">删除</a>
              </a-popconfirm>
            </template>
            <template slot="date" slot-scope="text">
              {{text.substring(0, 10)}}
            </template>
        </a-table>


      </div>
     


      <!--添加物料表单-->
      <add-form
      ref="addForm"
      :isNew = isNew
      :cate = categoryName
      :initData = maData
      :modfyIdx = modfyIdx
      :orderId = orderId
      v-on:MaCallBack = "MaCallBack"
      ></add-form>

    
  </div>
</template>

<style scoped>
.main-box{
  margin-top: 20px;
  margin-left: 30px;
}
.main-box .back-link{
  margin: 10px 0;
}
.main-box .title{
  font-size: 30px;
  line-height: 60px;
  text-align: center;
}
.form{
  width: 1000px;
}
.form .flex-item{
  display: flex;
}
.basic{
  width: 800px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  margin-left: 125px;
  margin-top: 20px;
}
.select-box{
  display: flex;
  align-items: center;
  margin: 20px 0;
}
.select-box .label{
  width: 125px;
  text-align: right;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
}
.select-box  .ant-select{
  width: 200px;
}
.add-btn{
  margin-left: 55px;
  margin-bottom: 20px;
}
.btn-box{
  margin-left: 125px;
  display: flex;
}
.btn-box .save-btn{
  margin-right: 20px;
}
.de-btn{
  color: #f5222d;
  margin-left: 10px;
}
.table /deep/ .ant-table-thead > tr > th, .table /deep/ .ant-table-tbody > tr > td{
  padding: 10px 5px;
}

.ma-box{
  padding-top: 15px;
  border-top: 1px dashed #ccc;
}
.term-box{
  margin-left: 125px;
  display: flex;
  align-items: center;
}
.term-txt .link{
  margin-left: 10px;
}
.term-box .term-select{
  display: flex;
}
.term-box .term-btn{
  margin-left: 20px;
  margin-right: 10px;
}

</style>

<script>
// @ is an alias to /src
import Api from "@/api/index.js";
import Http from "@/util/http.js";
import ComHeader from "@/components/ComHeader.vue"
import AddForm from "@/components/AddForm.vue"




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
  // {
  //   title: '行号（更新用）',
  //   dataIndex: 'amount',
  //   width: 200,
  // },
  
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
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
    title: '预算金额',
    dataIndex: 'fee',
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
  },
  
  {
    title: '操作',
    key: 'action',
    fixed: 'right',
    width: 200,
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
  },
];





  
export default {
  name: "modify",
  components: {
    ComHeader:ComHeader,
    AddForm: AddForm
  },
  data () {

    return {
      active: "", // 当前页
      formLayout: 'horizontal',
      categoryName: 1,
      form1: { // 耗材和仪器订单
        remark: "", // 备注
      },
      columns,
      serviceColumns,
      material: [], // 物料数据
      tableLoad: false,
      isNew: true, // 是否是新增物料数据
      typeList: [ //业务类型列表
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
      user: {},// 用户信息
      dateNow: "", // 当前日期
      orderId: -1, // 当前申请单编号
      maData: {}, // 物料初始数据
      modfyIdx: -1, // 修改table的第几个
      saveLoad: false,
      saveDisable: false,
      sbtLoad: false,
      sbtDisable: false,
      teamList: [], // 部门列表
      team: {
        id: "",
        name: ""
      }, // 部门信息
      showChangeTeam: false,
      selectTeamId: null,
     
      
    }
  },
  mounted(){
    if (!sessionStorage.getItem("token")) {
      this.$router.push({ name: "login"});
    } else {
      this.user = JSON.parse(sessionStorage.getItem("userInfo"));
      // this.dateNow = this.getNowFormatDate();
      if(this.$route.query.id) {
        this.orderId = parseInt(this.$route.query.id);
        this.renderPage();
      } else {
        this.$message.error("参数错误!");
      }
    }
  },
  methods: {
    renderPage() {
      let url = Api.orderDetail.replace(/%s/, this.orderId);
      Http.AJAXGET(this, url, "GET", (res)=>{
        if ((res.status!== 0) || res.appliedByUsername!== this.user.username) {
          this.$message.error("该申请单不可修改，1s后返回个人中心!");
          setTimeout(()=>{
            this.$router.push({path: "/mine"})
          }, 1500)

        } else {
          this.form1 = Object.assign( {}, this.form1, {
            remark:res.remark,
          })
          this.categoryName = res.categoryNum;
          this.dateNow = res.createdTime.substring(0, 10);
          this.team.id = res.reviewTeam.id;
          this.team.name = res.reviewTeam.name;
          this.selectTeamId = res.reviewTeam.id;
          if (res.categoryNum ==3) {
            this.material = res.services;
          } else{
            this.material = res.materials;
          }
        }
        
        
      })
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values);
        }
      });
    },
    add(){ // 新增物料数据
      this.modfyIdx = -1;
      this.maData = {};
      this.isNew = true;
      setTimeout(()=>{
        this.$refs.addForm.showDrawer();
      }, 0)
      
    },
    modifyMa(idx) { // 修改物料
      this.modfyIdx = idx;
      this.maData = this.material[idx];
      this.isNew = false;
      console.log(this.material[idx])
      setTimeout(()=>{
        this.$refs.addForm.showDrawer();
      },0)
     

    },
     tableClick(record, index){ // 表格双击事件
      return {
        on: {
            dblclick: () => {
              console.log(123)
             this.modifyMa(index)
            }
        }
      }
    },
    MaCallBack(data) { // 修改物料数据返回
      console.log(data);
      if (this.modfyIdx < 0 ) {
        this.material.push(data)
      } else {
        // this.material[this.modfyIdx]= data;
        this.$set(this.material,this.modfyIdx,data);
      }
      
    },

    deleteMa(idx) { // 删除物料
      if (this.material[idx].id == "") {
        this.material.splice(idx,1);
        this.$message.success("删除成功");
      } else {
        let url;
        if (this.categoryName == 3) {
          url = Api.deleteService.replace(/%s/, this.material[idx].id);
        } else {
          url = Api.deleteMaterials.replace(/%s/, this.material[idx].id);
        }
        Http.AJAXGET(this, url, "delete", (res)=>{
          if(res.message == '') {
            this.$message.error("此条信息已有修改记录，无法被删除！");
          } else {
            this.material.splice(idx,1);
            this.$message.success("删除成功");
          }
        }) 
      }
      
    },
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    saveApply() { // 保存申请数据
      // 先提交申请再提交物料信息
      let data;
      data =this.form1;
      data.categoryNum = this.categoryName;
      data.appliedByUsername = this.user.username;
      data.reviewTeamId = this.team.id;
      if(this.material.length == 0) {
        this.$message.error("物料或服务信息不能为空,请添加后保存!");
        return false;
      }
      // 提交申请
      console.log(data);
      this.saveLoad = true;
      this.saveDisable = true;
      // 判断是否已经生成orderID，如果已经生成，则是修改，否则是新建
      let url, type;
      if (this.orderId == -1) {
        url = Api.createOrder;
        type = "post";
      } else {
        url = Api.modifyOrder.replace(/%s/, this.orderId);
        type = "patch";
      }
      Http.AJAXPOST(this, url, type, data, (res)=>{
        
        if (type == "post") { // 新建
          this.orderId = res.id;
          // promise 提交物料数据
          var promiseArray = [];
          for(let i= 0; i<this.material.length; i++) {
            promiseArray.push(this.promiseItem(i));
            
          }
          Promise.all(promiseArray)
            .then((result) => {
              console.log(result);
              this.$message.success("恭喜您,申请单保存成功");
              this.saveDisable = false;
              this.saveLoad = false;
            })
          } else { //修改
            this.$message.success("恭喜您,申请单保存成功");
            this.saveDisable = false;
            this.saveLoad = false;
          }
        
      })
    },
    promiseItem(i) {
      console.log(this.orderId)
      let data = this.material[i];
      data.orderId = this.orderId;
      let url;
      if (this.categoryName == 3) {
        url = Api.createService
      } else {
        url = Api.createMaterials;
      }
      var p = new Promise((resolve, reject)=> {  //做一些异步操作
        Http.AJAXPOST(this,url, "post", data, (res)=>{
          resolve(i + "信息提交成功");
          console.log(res);
          this.material[i].id = res.id;
        }) 
      });
      return p; 
    },
  
    submitApply() { // 提交申请数据
      if(this.orderId == -1) {
        this.$message.error("请先点击保存申请数据,再提交!");
      } else {
        let url = Api.changeApplyStatus.replace(/%s/, this.orderId)
        let data = {
          status: 1,
          remark: ""
        }
        this.sbtLoad = true;
        this.sbtDisable = true;
        Http.AJAXPOST(this, url, "patch", data, (res)=>{
          // 提交成功 返回个人中心
          this.$message.success("恭喜您,申请单提交成功");
          setTimeout(()=>{
            this.$router.push({path: "/mine"})
          }, 1500)
        }, ()=>{
          this.sbtLoad = false;
          this.sbtDisable = false;
        })

      }
    },
    changeCate() { // 改变类型
      this.material = [];
    },
    showTeam() {
      this.showChangeTeam = true;
      if(this.teamList.length == 0) {
        this.getTeamList(); // 获取部门表列表
      }
    },
    cancelTeam() {
      this.showChangeTeam = false;
    },
    changeTeam(e) { // 切换部门
      console.log(e)
    },
    saveChangeTeam() { //保存切换的部门
      this.team = this.teamList.find(v => v.id === this.selectTeamId);
      this.showChangeTeam = false;
    },
    getTeamList() { // 获取所有部门
       let url = `${Api.getTeams}?page=1&limit=100`;
      Http.AJAXGET(this, url, "get", (res)=>{
        this.teamList = res.data;
      })
    },




    
  },
}
</script>
