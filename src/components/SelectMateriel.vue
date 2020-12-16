<!--选择物料组件-->
<template>
  <a-drawer
    title="选择物料"
    :width="800"
    :visible="visible"
    :maskClosable = "false"
    @close="onClose"
  >

    <div class="fixed-top">
      <p class="tit">已选中: </p>
      <p class="cnt">
        <span>物品编号：{{selected.num}}</span>
        <span>物品名称名称: {{selected.name}}</span>
        <span>货号: {{selected.itemNum}}</span>
        <span>规格型号: {{selected.modelNum}}</span>
        <span>单位: {{selected.unit}}</span>
        <span>品牌: {{selected.brand}}</span>
      </p>
      <a-button icon="check-circle" type="primary" class="sbt-btn" @click="choose">
        选中数据并返回
      </a-button>
    </div>
    
    <!--form & table-->
    <div class="form-area">
      <!--form-->
      <a-form class="ant-advanced-search-form" layout="inline" :form="form" @submit="handleSearch">
        <a-form-item label="物品编号">
          <a-input
            v-decorator="['num']"
            placeholder="请输入编号"
          />
        </a-form-item>
        <a-form-item label="物品名称">
          <a-input
            v-decorator="['name']"
            placeholder="请输入名称"
          />
        </a-form-item>
        <a-button icon="search" type="primary" class="sbt-btn" @click="handleSearch">
          搜索
        </a-button>
      </a-form>

      <!--table-->
      <a-table 
        class="table"
        :loading = tableLoad
        :row-selection="rowRadioSelection" bordered
        :columns="columns"
        :data-source="data"
        :rowKey="record => record.rowNum"
        :pagination ="false"
      />
      <!--分页-->
      <a-pagination class="pagination" v-model="page" @change="changePage" :total="total" show-less-items  :show-total="total => `共 ${total} 条数据`"/>
      
    </div>
    
  
  </a-drawer>
</template>

<style scoped>
.fixed-top{
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100px;
  border-bottom: 1px dashed #ccc;
  background: #fff;
}
.fixed-top .tit{
  font-weight: bold;
  margin-bottom: 15px;
}
.fixed-top .cnt span{
  margin-right: 30px;
}
.fixed-top .sbt-btn{
  position: absolute;
  right: 16px;
  top: -10px;
}
.form-area{
  margin-top: 90px;
  width: 100%;
}
.ant-advanced-search-form{
  display: flex;
  justify-content: flex-end;
}
.pagination{
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
.table /deep/ .ant-table-thead > tr > th, .table /deep/ .ant-table-tbody > tr > td{
  padding: 10px 5px;
}

</style>

<script>
// import { mapState } from "vuex";
import Api from "@/api/index.js";
import Http from "@/util/http.js";


export default {
  name: "SelectMateriel",
  data () {
    return {
      visible: false,
      selected: {}, // 选中的数据
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      columns: [
        {
          title: "物品编号",
          dataIndex: "num",
        },
        {
          title: "物品名称",
          dataIndex: "name",
        },
        {
          title: "货号",
          dataIndex: "itemNum",
        },
        {
          title: "规格型号",
          dataIndex: "modelNum",
        },
        {
          title: "单位",
          dataIndex: "unit",
        },
         {
          title: "品牌",
          dataIndex: "brand",
        }
        
      ],
      data: [],
      page: 1,
      rowRadioSelection: {
        type:"radio",
        columnTitle:"",
        onSelect: (selectedRowKeys) => {
          this.selected = selectedRowKeys;
        },
      },
      tableLoad: false,
      total: 0,

    }
    
  },
  mounted(){
    
  },
  computed: {
    // ...mapState({
    //   permissions: state => state.permissions
    // }),
  },

  methods: {
    
    showDrawer() {
      this.visible = true;
      this.page = 1;
      this.data = [];
      this.selected = {};
      this.getList();
    },
    onClose() {
      this.visible = false;
    },
    getList() { // 渲染表格数据
      this.tableLoad = true;
      let url = `${Api.k3Materials}?page=${this.page}&limit=${this.GLOBAL.len}`;
      // console.log( sessionStorage.getItem("token"))
      Http.AJAXGET(this, url, "GET", (res)=>{
        this.total= res.total;
        this.data = res.data;
      }, ()=>{
        this.tableLoad = false;
        
      })

    },
    
    choose() { // 选中数据并返回
      if (!this.selected.num) {
        this.$message.error("您还未选中物料！");
      } else {
        this.$emit("MaterielSelection", this.selected);
        this.visible = false;
      }
     
    },
    handleSearch () { // 搜索信息
      // e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
        let str = this.queryString(values);
        console.log(str)
        this.tableLoad = true;
        let url = `${Api.k3Materials}?page=${this.page}&limit=${this.GLOBAL.len}${str}`;
        Http.AJAXGET(this, url, "get", (res)=>{
          this.total= res.total;
          this.data = res.data;
        }, ()=>{
          this.tableLoad = false;
        })
      });
    },
    queryString(values) { // 返回搜索string
      let str = "";
      for(let i in values) {
        if(values[i]!= undefined ) {
          str = str + `&${i}=${values[i]}`
        }
      }
      return str;
    },
    onSelectChange(selectedRowKeys) { // 选中数据
    console.log(selectedRowKeys)
      // this.selectedRowKeys = selectedRowKeys;
      // this.selected = this.data[selectedRowKeys[0]];
      // console.log(this.selected)
    },
    changePage(page) {
      this.handleSearch();
    }

   
    
  }

}
</script>


