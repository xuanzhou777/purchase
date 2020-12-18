<template>
  <div class="wrap">
    <!--header-->
    <com-header v-bind:active="active"></com-header>

    <div class="main-box">
      <div class="ser-box">
        <a-form class="ant-advanced-search-form" :form="search" @submit="handleSearch">
            <a-row :gutter="24">
              <a-col
                :span="6"
              >
                <a-form-item label="开始申请日期">
                <a-date-picker
                  v-decorator="['startTime']"
                  placeholder="请选择开始申请日期"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :span="6"
              >
                <a-form-item label="结束申请日期">
                  <a-date-picker  
                    v-decorator="['endTime']"
                    placeholder="请选择结束申请日期"
                   />
                </a-form-item>
              </a-col>

              <a-col
                :span="6"
              >
                <a-form-item label="单据编号">
                  <a-input
                    v-decorator="['num']"
                    placeholder="请输入单据编号"
                  />
                </a-form-item>
              </a-col>

              <a-col
                :span="6"
              >
                <a-form-item label="业务类型">
                  <a-select 
                    v-decorator="[
                      'categoryNum']"
                    placeholder="请选择业务类型"
                  >
                    <a-select-option  v-for="item in typeList" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

            </a-row>
            <a-row :gutter="24">
              <a-col
                :span="6"
              >
                <a-form-item label="单据状态">
                  <a-select 
                    v-decorator="[
                      'status']"
                    placeholder="请选择单据状态"
                  >
                    <a-select-option  v-for="item in statusList" :key="item.value" :value="item.value">{{item.text}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col
                :span="5"
              >
                <a-form-item label="申请人">
                  <a-input
                    v-decorator="['appliedByUsername']"
                    placeholder="QSXXX"
                  />
                </a-form-item>
              </a-col>
              <a-col
                :span="5"
              >
                <a-form-item label="供应商">
                  <a-input
                    v-decorator="['supplierName']"
                    placeholder="请输入供应商"
                  />
                </a-form-item>
              </a-col>

               <a-col
                :span="8"
              >
                <a-button icon="search" type="primary" @click="handleSearch">
                  查找
                </a-button>
                <!-- <a-button icon="logout" type="primary"  style="margin: 0 10px">
                  导出excel
                </a-button>
                <a-button icon="printer" type="primary" >
                  打印
                </a-button> -->
              </a-col>


            </a-row>
          
        </a-form>
      </div>
       
         
      <!--表格-->
      <a-table  bordered :columns="columns"  :data-source="data" :pagination ="false" class="table" 
        :loading = "tableLoad"
        :rowKey="(record,index) => record.id"
        :customRow="tableClick"
        >
        
        <a-table v-if="record.categoryNum !=3"
          class="table"
          style="width: 3300px"
          slot="expandedRowRender"
          slot-scope="record"
          :columns="maColumns"
          :data-source="record.materials"
          :rowKey="(record,index) => index" 
          :pagination="false"
        >
        </a-table>
        <a-table v-else
          class="table"
          style="width: 1920px"
          slot="expandedRowRender"
          slot-scope="record"
          :columns="serviceColumns"
          :data-source="record.services"
          :rowKey="(record,index) => index" 
          :pagination="false"
        >
        </a-table>
      </a-table>
      <!--分页-->
      <a-pagination class="pagination" @change="changePage" v-model="page" :total="total" show-less-items   :show-total="total => `共 ${total} 条数据`"/>
         
         
          
       
    </div>
    
  
  </div>
</template>

<style scoped>
.main-box{
  margin-top: 20px;
  margin-left: 30px;
}
.main-box .ser-box{
  width: 1200px;
}

.table{
  margin: 20px 0;
  min-width: 1400px;
}
.pagination{
  float: right;
  margin-right: 30px;
}
.table /deep/ .ant-table-thead > tr > th, .table /deep/ .ant-table-tbody > tr > td{
  padding: 10px 5px;
}
.ant-advanced-search-form .ant-form-item {
  display: flex;
}
.ant-advanced-search-form /deep/ .ant-select-selection{
  width: 150px;
}
</style>
deep/
<script>
// @ is an alias to /src
import Api from "@/api/index.js";
import Http from "@/util/http.js";
import { mapState } from "vuex";
import ComHeader from '@/components/ComHeader.vue'



const maColumns = [
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
    customRender: expectArrivalDate => expectArrivalDate.substring(0, 10)
  },
  {
    title: '是否到货',
    dataIndex: 'isArrived',
    width: 100,
    customRender: isArrived => isArrived? '是' : '否'
  },
  {
    title: '到货周期',
    dataIndex: 'arrivalTat',
    width: 200,
  },
  {
    title: '金蝶采购订单号',
    dataIndex: 'k3poNum',
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
    title: '预算金额',
    dataIndex: 'fee',
    width: 200,
  },
  {
    title: '计划完成日期',
    dataIndex: 'dueDate',
    width: 150,
    customRender: dueDate => dueDate.substring(0, 10)
  },
  {
    title: '需求内容',
    dataIndex: 'specification',
    width: 300,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
  }
];



export default {
  name: "All",
  components: {
    ComHeader:ComHeader,
  },
  data () {

    return {
      active: "all", // 当前页
      loading: false,
      disabled: false,
      columns: [
        {
          title:'申请单号',
          dataIndex: 'num',
          width: 200,
        },
        {
          title: '状态',
          dataIndex: 'status',
          width: 130,
          customRender:  (text)=> {
            return this.statusList[text+1].text
          }
        },
        {
          title: '业务类型',
          dataIndex: 'categoryNum',
          width: 100,
          customRender:  (text)=> {
            return this.typeList[text].text;
          }
        },
        {
          title: '申请日期',
          dataIndex: 'createdTime',
          width: 150,
          customRender: createdTime => createdTime.substring(0, 10)
        },
        {
          title: '申请人编号',
          dataIndex: 'appliedByUsername',
          width: 120,
        },
        {
          title: '申请人名称',
          dataIndex: 'name',
          width: 150,
          customRender: (text, record) => record.appliedBy.name
        },
        {
          title: '申请部门',
          dataIndex: 'department',
          width: 150,
          customRender: (text, record) => record.reviewTeam.name
        },
        {
          title: '金额',
          dataIndex: 'fee',
          width: 120,
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 220
        },
      
      ],
      maColumns,
      serviceColumns,
      data:[],
      tableLoad: false,
      page: 1,
      search: this.$form.createForm(this, { name: 'advanced_search' }),
      
      user: {}, // 用户信息
      total: 0,
    }
  },
  computed: {
    ...mapState({
      typeList: state => state.typeList,
      statusList: state => state.statusList,
    }),
  },
  mounted(){ // 一进入页面的操作
    if (!sessionStorage.getItem("token")) {
      this.$router.push({ name: "login"});
    } else {
      this.user = JSON.parse(sessionStorage.getItem("userInfo"));
      this.getList();
    }
  },
  methods: {
    handleSearch(e) { // 搜索页面
      // e.preventDefault();
      console.log("seee")
      this.search.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
        
        let str = this.queryString(values);
        console.log(str)
        this.tableLoad = true;
        let url = `${Api.orderList}?page=${this.page}&limit=${this.GLOBAL.len}${str}`;
        Http.AJAXGET(this, url, "get", (res)=>{
          this.total= res.total;
          this.data = res.data;
        }, ()=>{
          this.tableLoad = false;
        })
        
      });
    },
    getList() { // 获取数据
      this.tableLoad = true;
      let url = `${Api.orderList}?page=${this.page}&limit=${this.GLOBAL.len}`;
      Http.AJAXGET(this, url, "GET", (res)=>{
        this.total= res.total;
        this.data = res.data;
      }, ()=>{
        this.tableLoad = false;
        
      })

    },
    renderTxt(num, list) { // 渲染字符
      console.log(1)
      let txt = "";
      for(let item of list){
        if(item.value === num ){
          txt = item.text; 
          break;
        }
      }
      return txt;
    },
    queryString(values) { // 返回搜索string
      let str = "";
      for(let i in values) {
        if(values[i]!= undefined ) {
          if(i == "endTime" || i == "startTime") {
            values[i] = values[i].toISOString();
          }
          str = str + `&${i}=${values[i]}`
        }
      }
      return str;
    },
    tableClick(record, index){ // 表格双击事件
      return {
        on: {
            dblclick: () => {
              // 跳转到详情页面
              this.$router.push({path: `/detail?id=${record.id}`})
              
            }
        }
      }
    },
    changePage(page) {
      this.handleSearch();
    }
    
  },
  
}
</script>
