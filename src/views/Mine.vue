<template>
  <div class="wrap">
    <!--header-->
    <com-header v-bind:active="active"></com-header>

    <div class="main-box">
      <!--发起申请按钮-->
      
      <a-button type="primary" icon="file-add" class="add-btn" @click="add">
        新建采购申请
      </a-button>

      <!--被驳回的提示-->
      <div class="refuse-hit" v-if="refuseNum > 0"><a-icon type="alert" /> 近三个月内，您有{{refuseNum}}条申请单被驳回，详见《我发起的采购申请》查询！</div>

      <!--标签页-->
      <a-tabs type="card" @change="changeCard" :activeKey="activeKey">
        <a-tab-pane key="review" tab="待审核采购申请" class="todo-wrap" v-if="!isChecker">
          <!--刷新按钮-->
          <a-button type="primary" class="refresh-btn" @click="refresh(0)" :loading="loading" :disabled = "disabled">
            刷新
          </a-button>
          <div class="has-data" v-if="reviewList.length > 0">
            <div class="hit">
              <a-icon type="sound" />
              您{{reviewTotal}}张单据未审核
            </div>
            <!--表格-->
            <a-table bordered :columns="columns"  :data-source="reviewList" :pagination ="false" class="table" 
            :loading = "reviewTableLoad"
            :rowKey="(record,index) => record.id"
            :customRow="tableClick"
            >
              <a-table v-if="record.categoryNum !=3"
                class="table"
                style="width: "
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
            <!-- <a-pagination class="pagination" @change="changeReviewPage(0)" v-model="reviewPage" :total="reviewTotal" show-less-items  :show-total="total => `共 ${total} 条数据`"/> -->
          </div>
          <div class="no-data" v-else>
            <a-icon type="smile" />
            您暂无待审核申请
          </div>
          
        </a-tab-pane>
        <a-tab-pane key="checker" tab="待采购复核" class="todo-wrap" v-if="isChecker">
          <!--刷新按钮-->
          <a-button type="primary" class="refresh-btn" @click="refresh(1)" :loading="loading" :disabled = "disabled">
            刷新
          </a-button>
          <div class="has-data" v-if="reviewList.length > 0">
            <div class="hit">
              <a-icon type="sound" />
              您{{reviewTotal}}张单据未复核
            </div>
            <!--表格-->
            <a-table bordered :columns="columns"  :data-source="reviewList" :pagination ="false" class="table" 
            :loading = "reviewTableLoad"
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
            <a-pagination class="pagination" @change="changeReviewPage(1)" v-model="reviewPage" :total="reviewTotal" show-less-items  :show-total="total => `共 ${total} 条数据`"/>
          </div>
          <div class="no-data" v-else>
            <a-icon type="smile" />
            您暂无待复核申请
          </div>
          
        </a-tab-pane>
        <a-tab-pane key="sendk3" tab="待发送至金蝶" class="todo-wrap" v-if="isChecker">
          <!--刷新按钮-->
          <a-button type="primary" class="refresh-btn" @click="refresh(2)" :loading="loading" :disabled = "disabled">
            刷新
          </a-button>
          <div class="has-data" v-if="reviewList.length > 0">
            <div class="hit">
              <a-icon type="sound" />
              您{{reviewTotal}}张单据未发送至金蝶系统
            </div>
            <!--表格-->
            <a-table bordered :columns="columns"  :data-source="reviewList" :pagination ="false" class="table" 
            :loading = "reviewTableLoad"
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
            <a-pagination class="pagination" @change="changeReviewPage(2)" v-model="reviewPage" :total="reviewTotal" show-less-items  :show-total="total => `共 ${total} 条数据`"/>
          </div>
          <div class="no-data" v-else>
            <a-icon type="smile" />
            您暂无待发送至金蝶申请
          </div>
          
        </a-tab-pane>
        <a-tab-pane key="my" tab="我发起的采购申请">
           <div class="ser-box">
            <a-form class="ant-advanced-search-form" :form="search" @submit="handleMySearch">
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
                    <a-button icon="search" type="primary" @click="handleMySearch">
                      查找
                    </a-button>
                  </a-col>
                </a-row>
              
            </a-form>
          </div>
          <!--table-->
          <a-table bordered :columns="columns"  :data-source="myList" :pagination ="false" class="table" 
            :loading = "myTableLoad"
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
          <a-pagination class="pagination"  @change="changeMyPage" v-model="myPage" :total="myTotal" show-less-items  :show-total="total => `共 ${total} 条数据`"/>
        </a-tab-pane>
      </a-tabs>
    </div>
    
  
  </div>
</template>

<style scoped>
.main-box{
  margin-top: 20px;
  margin-left: 30px;
}
.main-box .add-btn{
  margin-bottom: 20px;
}
.has-data .hit{
  color: #f77c2a;;
}
.no-data{
  font-size: 20px;
}
.refresh-btn{
  /* margin: 15px 0; */
  margin-bottom: 15px;
}

/*table */
.resize-table-th {
  position: relative;
}
.resize-table-th .table-draggable-handle {
  height: 100% !important;
  bottom: 0;
  left: auto !important;
  right: -5px;
  cursor: col-resize;
  touch-action: none;
}
.table{
  margin: 20px 0;
  min-width: 1400px
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
.main-box .ser-box{
  width: 1200px;
}
.main-box /deep/ .ant-tabs {
  overflow: inherit;
}
.refuse-hit{
  margin-bottom: 10px;
  color: #f77c2a;
}
</style>

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
  name: "Mine",
  components: {
    ComHeader:ComHeader,
  },
  data () {

    return {
      active: "mine", // 当前页
      loading: false,
      disabled: false,
      reviewTableLoad: false,
      myTableLoad: false,
      reviewPage: 1,
      reviewTotal: 0,
      myPage: 1,
      myTotal: 0,
      activeKey: "review",
      search: this.$form.createForm(this, { name: 'advanced_search' }),
      isChecker: false, // 是否有采购复核的权限
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
      reviewList: [], // 待审核数据
      myList: [], // 我发起的采购订单
      user: {}, // 用户信息
      maColumns,
      serviceColumns,
      refuseNum: 0, // 被驳回的申请单数量
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
      this.judgeChecker();
      this.isChecker?  this.getReviewList(1) : this.getReviewList(0);
      this.renderRefuseOrder();
    }
  },
  methods: {
    add() { // 进入新建采购申请页面
      this.$router.push({ name: "addApply"});
    },
    handleMySearch(e) { // 搜索我发起的采购申请
      // e.preventDefault();
      this.search.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
        let str = this.queryString(values);
        console.log(str)
        this.myTableLoad = true;
        let url = `${Api.orderList}?page=${this.myPage}&limit=${this.GLOBAL.len}${str}`;
        Http.AJAXGET(this, url, "get", (res)=>{
          this.myTotal= res.total;
          this.myList = res.data;
        }, ()=>{
          this.myTableLoad = false;
        })

      });
    },
    queryString(values) { // 返回搜索string
      let str = `&appliedByUsername=${this.user.username}`;
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
    getReviewList(num) { // 获取待审核列表 0 待审核 1采购复核 2发送至金蝶订单
      this.reviewTableLoad = true;
      this.reviewPage = 1;
      let url;
      if(num == 1) { // 采购复核
        url = `${Api.orderList}?page=${this.reviewPage}&limit=${this.GLOBAL.len}&status=1`;
      } else if (num == 2) { // 发送至金蝶
        url = `${Api.orderList}?page=${this.reviewPage}&limit=${this.GLOBAL.len}&status=8`;
      } else { // 待审核
        url = `${Api.orderList}?currentAuditedByUsername=${this.user.username}`;
      }
      Http.AJAXGET(this, url, "get", (res)=>{
        this.reviewTotal= res.total;
        this.reviewList = res.data;
      }, ()=>{
        this.reviewTableLoad = false;
      })

    },
    changeCard(key) {
      if (this.activeKey == key) {
        return false;
      } else {
        this.activeKey = key;
        if (key == "review") { // 更新 待审核页面
          this.getReviewList(0);
        } else if(key == "checker") { // 更新待复核
          this.getReviewList(1);
        } else if (key == "sendk3") { // 更新发送至金蝶
           this.getReviewList(2);
        } else if(key == "my" && this.myList.length == 0) { // 更新我的申请单页面
          this.handleMySearch();
        }
      }
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
    judgeChecker() { // 判断是否有采购复核的权限
      if ( this.user.roles.length >0) {
        let perList = this.user.roles[0].perms; 
        for(let item of perList){
          if(item.name === "pa_order_review" ){
            this.isChecker = true;
            this.activeKey = "checker" ;
            break;
          }
        }
      }
    },
    changeMyPage() {
      this.handleMySearch();
    },
    changeReviewPage(num) {
      this.getReviewList(num)
    },
    refresh(num) { // 页面刷新
      this.reviewPage = 1;
      this.getReviewList(num);
    },
    renderRefuseOrder() { // 渲染近三个月内被驳回的订单数量
      let now = new Date();
      let end = now.toISOString();
      now.setDate(now.getDate() - 90);
      let start = now.toISOString();
      let url = `${Api.orderList}?page=1&limit=10&startTime=${start}&endTime=${end}&status=10&appliedByUsername=${this.user.username}`;
       Http.AJAXGET(this, url, "get", (res)=>{
        this.refuseNum= res.total;
      })
    },
    
  },
}
</script>
