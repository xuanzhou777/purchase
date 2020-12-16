<!--选择供应商组件-->
<template>
  <a-drawer
    title="选择供应商"
    :width="800"
    :visible="visible"
    :maskClosable = "false"
    @close="onClose"
  >

    <div class="fixed-top">
      <p class="tit">已选中: </p>
      <p class="cnt"><span>编号：{{selected.num}}</span> <span>名称: {{selected.name}}</span></p>
      <a-button icon="check-circle" type="primary" class="sbt-btn" @click="choose">
        选中数据并返回
      </a-button>
    </div>
    
    <!--form & table-->
    <div class="form-area">
      <!--form-->
      <a-form class="ant-advanced-search-form" layout="inline" :form="form" @submit="handleSearch">
        <a-form-item label="编号">
          <a-input
            v-decorator="['num']"
            placeholder="请输入编号"
          />
        </a-form-item>
        <a-form-item label="名称">
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
        :row-selection="rowRadioSelection"
        bordered
        :columns="columns"
        :data-source="data"
        :rowKey="record => record.rowNum"
        :pagination ="false"
      />
      <!--分页-->
      <a-pagination class="pagination" @change="changePage" v-model="page" :total="total" show-less-items  :show-total="total => `共 ${total} 条数据`"/>
      
    </div>
    
  
  </a-drawer>
</template>

<style scoped>
.fixed-top{
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 80px;
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
  margin-top: 70px;
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
  name: "SelectSupplier",
  // props: { 
  //   isNew: { // 用于判断新建还是修改
  //     type: Boolean,
  //     default: true
  //   }
  // },
  data () {
    return {
      visible: false,
      selected: {}, // 选中的数据
      form: this.$form.createForm(this, { name: 'advanced_search' }),
      columns: [
        {
          title: "编号",
          dataIndex: "num",
        },
        {
          title: "名称",
          dataIndex: "name",
        },
        
      ],
      data: [ ],
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
      this.page = 1;
      this.selected = {};
      this.data = [];
      this.visible = true;
      this.getList();
    },
    onClose() {
      this.visible = false;
    },
    getList() { // 渲染表格数据
      console.log(1)
      this.tableLoad = true;
      let url = `${Api.k3Suppliers}?page=${this.page}&limit=${this.GLOBAL.len}`;
      console.log(url)
      Http.AJAXGET(this, url, "get", (res)=>{
        this.total= res.total;
        this.data = res.data;
      }, ()=>{
        this.tableLoad = false;
        
      })

    },
    choose() { // 选中数据并返回
      if (!this.selected.num) {
        this.$message.error("您还未选中供应商！");
      } else {
        this.$emit("SupplierSelection", this.selected);
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
        let url = `${Api.k3Suppliers}?page=${this.page}&limit=${this.GLOBAL.len}${str}`;
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


