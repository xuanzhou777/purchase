<!--新建申请组件-->
<template>
  <a-drawer
    :title="formTit"
    :width="900"
    :visible="visible"
    :body-style="{ paddingBottom: '80px' }"
    :maskClosable = "false"
    @close="onClose"
  >

    <div class="add-wrap" >
     
      
      <!--表单 物料-->
      <a-form-model :model="form" ref="maForm" :rules="rules" :label-col="{ span: 3 }" :wrapper-col="{ span: 12 }" class="form" v-if="cate!=3">
        <div class="select-box" v-if="cate == 1">
          <a-button type="primary" icon="search" @click="showChooseS">
            选择供应商信息(非必选)
          </a-button>
          <div class="info-box">
            <p><span>供应商名称：{{form.supplierName}}</span></p>
            <p><span>供应商代码：{{form.supplierNum}}</span></p>
          </div>
        </div>
        <div class="select-box" v-if="cate == 1">
          <a-button type="primary" icon="search" @click="showChooseM">
            选择物料信息(必选)
          </a-button>
          <div class="info-box">
            <p><span>*物品编号：{{form.k3MaterialNum}}</span></p>
            <p><span>*物品名称：{{form.name}}</span></p>
            <p><span>货号：{{form.itemNumber}}</span></p>
            <p><span>规格型号：{{form.modelNumber}}</span></p>
            <p><span>*单位：{{form.unit}}</span></p>
            <p><span>品牌：{{form.brand}}</span></p>
          </div>
        </div>
        <!---仪器输入框-->
        <div class="instrument-box" v-if="cate == 2">
          <a-row :gutter="24">
            <a-col
              :span="12"
            >
              <a-form-model-item  label="供应商代码" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" prop="supplierNum">
                <a-input
                  v-model="form.supplierNum" 
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
            >
              <a-form-model-item  label="供应商名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="supplierName">
                <a-input
                  v-model="form.supplierName" 
                />
              </a-form-model-item>
            </a-col>

          </a-row>
          <a-row :gutter="24">
            <a-col
              :span="12"
            >
              <a-form-model-item  label="物品名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" prop="name">
                <a-input
                  v-model="form.name"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
            >
              <a-form-model-item  label="物品编号" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="k3MaterialNum">
                <a-input
                  v-model="form.k3MaterialNum"
                />
              </a-form-model-item>
            </a-col>

          </a-row>
          <a-row :gutter="24">
            <a-col
              :span="12"
            >
              <a-form-model-item  label="货号" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" prop="itemNumber">
                <a-input
                  v-model="form.itemNumber"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
            >
              <a-form-model-item  label="规格型号" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="modelNumber">
                <a-input
                   v-model="form.modelNumber"
                />
              </a-form-model-item>
            </a-col>

          </a-row>
          <a-row :gutter="24">
            <a-col
              :span="12"
            >
              <a-form-model-item  label="单位" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" prop="unit">
                <a-input
                  v-model="form.unit"
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
            >
              <a-form-model-item  label="品牌" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="brand">
                <a-input
                  v-model="form.brand"
                />
              </a-form-model-item>
            </a-col>

          </a-row>
        </div>
        <p class="money-total">金额：{{form.fee}}</p>
        <a-row :gutter="24">
          <a-col
            :span="12"
          >
            <a-form-model-item  label="数量" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" prop="amount">
              <a-input
              type="number"
              @blur="calcuAmount"
              v-model="form.amount"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="12"
          >
            <a-form-model-item  label="单价" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="price">
              <a-input
                v-model="form.price"
                type="number"
                @blur="calcuAmount"
                prefix="￥" suffix="RMB"
              />
            </a-form-model-item>
          </a-col>

        </a-row>
        <a-row :gutter="24">
          <a-col
            :span="12"
          >
            <a-form-model-item  label="项目编号" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" prop="projectNum">
              <a-select v-model="form.projectNum"
                @change = "changePro"
                placeholder="请选择项目编号"
              >
                <a-select-option  v-for="item in projectList" :key="item.num" :value="item.num">{{item.num}}/{{item.name}}</a-select-option>
        </a-select>
            </a-form-model-item>
          </a-col>
          <a-col
            :span="12"
          >
            <a-form-model-item  label="项目名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="projectName">
              <a-input :disabled = proNameDisable
                v-model="form.projectName"
              />
            </a-form-model-item>
          </a-col>

        </a-row>
        <a-form-model-item label="需要到货时间" prop="expectArrivalDate">
          <a-date-picker  
            @change="changeArrivalDate"
            v-model="form.expectArrivalDate"
            placeholder="请选择需要到货时间"
          />
        </a-form-model-item>
        <a-form-model-item label="技术要求" prop="specification">
          <a-textarea
            placeholder="请输入技术要求"
            v-model="form.specification"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-model-item>

         <a-form-model-item label="申请采购原因及用途" class="custom-line" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }" prop="reason">
          <a-textarea
            v-model="form.reason"
            placeholder="申请采购原因及用途"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-model-item>
        <!--到货状态和到货周期  采购填写-->
        <a-row :gutter="24" v-if="isChecker">
          <a-col
            :span="8"
          >
            <a-form-item label="到货状态" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" >
              <!-- <a-select v-model="form.isArrivedNum" :disabled = true>
                <a-select-option :value = 0>未到货</a-select-option>
                <a-select-option :value = 1>已到货</a-select-option>
              </a-select> -->
              <span v-if="form.isArrived"> 已到货</span>
              <span v-else> 未到货</span>
            </a-form-item>
          </a-col>
          <a-col
            :span="10"
          >
            <a-form-model-item  label="到货周期" prop="arrivalTat" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
              <a-input v-model="form.arrivalTat"
                placeholder="请输入到货周期"
              />
            </a-form-model-item>
          </a-col>
          <a-col
            :span="6"
          >
            <a-button type="primary"  @click="emailApper">
              发送邮件给申请人
            </a-button>
          </a-col>

        </a-row>
      
      </a-form-model>

      <!--表单 服务-->
      <a-form-model :model="serviceForm" ref="seForm" :rules="serviceRules" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" class="form" v-else>
          <a-row :gutter="24">
            <a-col
              :span="8"
            >
              <a-form-model-item  label="供应商代码" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" prop="supplierNum">
                <a-input :disabled = true
                  v-model="serviceForm.supplierNum" 
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
            >
              <a-form-model-item  label="供应商名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="supplierName">
                <a-input :disabled = true
                  v-model="serviceForm.supplierName" 
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :span="4"
            >
               <a-button icon="search" type="primary" @click="showChooseS">
                  查找供应商
                </a-button>
            </a-col>

          </a-row>
          <a-row :gutter="24">
            <a-col
              :span="12"
            >
              <a-form-model-item  label="项目编号" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" prop="projectNum">
                <a-select v-model="serviceForm.projectNum"
                  @change = "changePro"
                  placeholder="请选择项目编号"
                >
                  <a-select-option  v-for="item in projectList" :key="item.num" :value="item.num">{{item.num}}/{{item.name}}</a-select-option>
          </a-select>
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
            >
              <a-form-model-item  label="项目名称" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="projectName">
                <a-input :disabled = proNameDisable
                  v-model="serviceForm.projectName"
                />
              </a-form-model-item>
            </a-col>

          </a-row>
          <a-form-model-item  label="项目地址" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }"  prop="projectAddress">
            <a-input 
              v-model="serviceForm.projectAddress" 
            />
          </a-form-model-item>
          <a-row :gutter="24">
            <a-col
              :span="12"
            >
              <a-form-model-item  label="预算金额" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" prop="fee">
                <a-input
                  type="number"
                  prefix="￥" suffix="RMB"
                  v-model="serviceForm.fee" 
                />
              </a-form-model-item>
            </a-col>
            <a-col
              :span="12"
            >
              <a-form-model-item  label="计划完成日期" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }"  prop="dueDate">
                <a-date-picker  
                  @change="changeDueDate"
                  v-model="serviceForm.dueDate"
                  placeholder="请选择需要到货时间"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-form-model-item label="需求内容" prop="specification">
            <a-textarea
              v-model="serviceForm.specification"
              placeholder="请输入需求内容"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>

          <a-form-model-item label="备注" prop="remark">
            <a-textarea
              v-model="serviceForm.remark"
              placeholder="请输入备注"
              :auto-size="{ minRows: 3, maxRows: 5 }"
            />
          </a-form-model-item>
  
      
      </a-form-model>

    </div>
    
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
      v-if="!disableSbt"
    >
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        取消
      </a-button>
      <a-button type="primary" @click="handleSubmit" :loading="loading" :disabled="disabled">
        保存
      </a-button>
    </div>

    <!--选择供应商组件-->
    <select-supplier 
    ref="chooseSupplier"
    v-on:SupplierSelection = "SupplierSelection"
    ></select-supplier>
    <!--选择物料组件-->
    <select-materiel
    ref="chooseMateriel"
    v-on:MaterielSelection = "MaterielSelection"
    ></select-materiel>

  </a-drawer>
</template>

<style scoped>
.select-box{
  width: 100%;
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px dashed #eaeaea;
}
.select-box .info-box{
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
}
.select-box .info-box p{
  width: 50%;
}
.select-box .info-box p span{
  font-weight: bold;
}
.custom-line /deep/ .ant-form-item-label {
  line-height: 1.5;
  white-space: inherit;
}
.money-total{
  margin-left: 66px;
  color: rgba(0, 0, 0, 0.85);
}
</style>

<script>
// import { mapState } from "vuex";
import Api from "@/api/index.js";
import Http from "@/util/http.js";

import SelectSupplier from "@/components/SelectSupplier.vue"
import SelectMateriel from "@/components/SelectMateriel.vue"

export default {
  name: "AddForm",
   components: {
    SelectSupplier: SelectSupplier,
    SelectMateriel: SelectMateriel,
  },
  props: { 
    isNew: { // 用于判断新建还是修改
      type: Boolean,
      default: true
    },
    cate: { // 申请单类别
      type: Number,
      default: 1
    },
    initData: { // 初始数据
      type: Object,
      default: ()=> {}
    },
    modfyIdx: { // 修改的是第几条数据
      type: Number,
      default: -1
    },
    orderId: { // 申请单id
      type: Number,
      default: -1
    },
    disableSbt: { // 是否禁用提交
      type: Boolean,
      default: false
    },
    projectList: { // 项目列表
      type: Array,
      default: ()=> []
    },
  },
  data () {
    return {
      formTit: "新增物料",
      isChecker: false,
      visible: false,
      form: { // 仪器/物料表单数据
        id: "",
        k3MaterialNum: "",
        name: "",
        unit: "",
        amount: null,
        expectArrivalDate: null,
        supplierNum: "",
        supplierName: "",
        itemNumber: "",
        modelNumber: "",
        brand: "",
        specification: "",
        price: null,
        fee: 0,
        reason: "",
        isArrived: false,
        arrivalTat: "",
        projectNum: "",
        projectName: "",
      },
      serviceForm: { // 服务表单数据
        id: "",
        fee: 0,
        supplierNum: "",
        supplierName: "",
        projectNum: "",
        projectName: "",
        projectAddress: "",
        dueDate: null,
        specification: "",
        remark: ""
      },
      rules: { // 验证规则
        expectArrivalDate: [{ required: true, message: '请选择需要到货日期',  trigger: 'change' }],
        amount: [{ required: true,  message: '请输入数量', trigger: 'blur' }],
        projectNum: [{ required: true, message: '请选择项目编号',  trigger: 'change' }],
        projectName:  [{ required: true,  message: '请填写项目名称', trigger: 'blur' }],
        reason: [{ required: true,  message: '请填写申请采购原因及用途', trigger: 'blur' }],
      },
      serviceRules: { // 服务验证规则
        supplierNum: [{ required: true,  message: '请选择供应商信息', trigger: 'blur' }],
        supplierName: [{ required: true,  message: '请选择供应商信息', trigger: 'blur' }],
        projectAddress: [{ required: true,  message: '请填写项目地址', trigger: 'blur' }],
        dueDate: [{ required: true, message: '请选择计划完成日期',  trigger: 'change'  }],
        fee: [{ required: true,  message: '请填写预算金额', trigger: 'blur' }],
        projectNum: [{ required: true, message: '请选择项目编号',  trigger: 'change' }],
        projectName:  [{ required: true,  message: '请填写项目名称', trigger: 'blur' }],
      },
      loading: false, // 按钮loading属性
      disabled: false, // 按钮disabled属性
      proNameDisable: false
      
    }
    
  },
  mounted(){
    // this.$refs.numInput.onblur = ()=>{
    //   this.calcuAmount();
    // }
    this.judgeChecker();
  },
  computed: {
    // ...mapState({
    //   permissions: state => state.permissions
    // }),
  },

  methods: {
    showDrawer() {
      if(this.isNew) {
        this.resetForm();
        if(this.cate ==1) {
          this.formTit = "新增物料";
        } else if(this.cate == 2) {
          this.formTit = "新增仪器信息"
        } else {
          this.formTit = "新增服务信息"
        }
        
      } else {
        if(this.cate ==1) {
          this.formTit = "修改物料";
          this.form = this.initData;
        } else if(this.cate == 2){
          this.formTit = "修改仪器信息";
          this.form = this.initData;
        } else {
          this.formTit = "修改服务信息";
          this.serviceForm = this.initData;
        }
        
      }

      this.visible = true;
    },
    onClose() {
      this.visible = false;
      
    },
    handleSubmit(e) { // 提交数据
      e.preventDefault();
      if (this.cate !=3) { // 物料/仪器
        this.$refs.maForm.validate(valid => {
          if (valid) {
            console.log(this.form)
            if (this.cate == 1 ) {
              if (this.form.k3MaterialNum === "") {
                this.$message.error("请选择物料信息");
                return false;
              }
            }
            console.log(this.orderId)
            if (this.orderId == -1) { // 申请订单未生成
              this.form.amount = parseInt(this.form.amount);
              this.form.price =  this.form.price ? parseInt(this.form.price) : null;
              this.$emit("MaCallBack", this.form);
              this.onClose();
            } else { // 申请订单生成 更新物料数据 
              this.loading = true;
              this.disabled = true;
              let url, type;
              if (this.form.id == "") { // 新增
                this.form.orderId = this.orderId;
                url =  Api.createMaterials;
                type = "post";
              } else { // 修改
                url =  Api.modifyMaterials.replace(/%s/, this.form.id);
                type ="patch";
              }
              this.form.amount = parseInt(this.form.amount);
              this.form.price =  this.form.price ? parseInt(this.form.price) : null;
              Http.AJAXPOST(this, url, type, this.form, (res)=>{
                this.$message.success("信息保存成功！");
                this.form.id = res.id;
                this.$emit("MaCallBack", this.form);
                this.loading = false;
                this.disabled = false;
                this.onClose();
              }) 

            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      } else { // 服务
         this.$refs.seForm.validate(valid => {
          if (valid) {
            console.log(this.serviceForm)
            console.log(this.orderId)
            if (this.orderId == -1) { // 申请订单未生成
              this.serviceForm.fee = parseInt( this.serviceForm.fee);
              this.$emit("MaCallBack", this.serviceForm);
              this.onClose();
            } else { // 申请订单生成 更新物料数据 
              this.loading = true;
              this.disabled = true;
              let url, type;
              if (this.serviceForm.id == "") { // 新增
                this.serviceForm.orderId = this.orderId;
                url =  Api.createService;
                type = "post";
              } else { // 修改
                url =  Api.modifyService.replace(/%s/, this.serviceForm.id);
                type ="patch";
              }
              this.serviceForm.fee = parseInt( this.serviceForm.fee);
              Http.AJAXPOST(this, url, type, this.serviceForm, (res)=>{
                this.$message.success("信息保存成功！");
                this.form.id = res.id;
                if(type == "post") {
                  this.$emit("MaCallBack", this.form);
                }
                this.loading = false;
                this.disabled = false;
                this.onClose();
              }) 

            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
     
     
   
    },
    changeArrivalDate(date) {
      // console.log(date.format("YYYY-MM-DD"))
      this.form.expectArrivalDate = date.toISOString();
    },
    changeDueDate(date) {
      // console.log(date.format("YYYY-MM-DD"))
      this.serviceForm.dueDate = date.toISOString();
    },
    SupplierSelection(e) { // 选中 供应商数据
      if (this.cate !=3 ) {
        this.form = Object.assign( {}, this.form, {
          supplierNum: e.num,
          supplierName: e.name
        })
      } else {
        this.serviceForm = Object.assign( {}, this.serviceForm, {
          supplierNum: e.num,
          supplierName: e.name
        })
      }
      
    },
    MaterielSelection(e) { // 选中物料
      console.log(e)
      this.form = Object.assign( {}, this.form, {
        k3MaterialNum: e.num,
        name: e.name,
        itemNumber: e.itemNum,
        modelNumber: e.modelNum,
        unit: e.unit,
        brand: e.brand
      })
    },
    showChooseS() { // 显示选择供应商浮层
      this.$refs.chooseSupplier.showDrawer();
    },
    showChooseM() { // 显示选择物料浮层
      this.$refs.chooseMateriel.showDrawer();
    },
    calcuAmount() { // 计算金额
      if(this.form.amount && this.form.price) {
        this.form.fee = parseInt(this.form.amount)*parseInt(this.form.price);
      } else {
        this.form.fee = 0;
      }
    },
    emailApper() { // 发送邮件给申请人 todo

    },
    judgeChecker() { // 判断是否有采购复核的权限
      if (JSON.parse(sessionStorage.getItem("userInfo")).roles.length >0 ) {
        let perList = JSON.parse(sessionStorage.getItem("userInfo")).roles[0].perms; 
        for(let item of perList){
          if(item.name === "pa_order_review" ){
            this.isChecker = true;
            break;
          }
        }
      }
      
    },
    
    changePro(e) { // 切换项目编号
      
      let obj = this.projectList.find(v => v.num === e);
      console.log(obj)
      if (this.cate == 3) {
        this.serviceForm.projectName = obj.name;
        console.log(this.serviceForm)
      } else {
        this.form.projectName = obj.name;
      }
      if(e== "公用") { 
        this.proNameDisable = false;
      } else {
        this.proNameDisable = true;
      }
    },
    resetForm() { // 重置表单
      // this.props.seForm.clearValidate();
      //  this.$refs['maForm'].resetFields()
      // this.$refs.form.resetFields()
      // this.$nextTick(()=>{

      //   this.$refs['seForm'].resetFields()

      // })
      this.form = {
        id: "",
        k3MaterialNum: "",
        name: "",
        unit: "",
        amount: null,
        expectArrivalDate: null,
        supplierNum: "",
        supplierName: "",
        itemNumber: "",
        modelNumber: "",
        brand: "",
        specification: "",
        price: null,
        fee: 0,
        reason: "",
        isArrived: false,
        arrivalTat: "",
        projectNum: "",
        projectName: "",
      };
      this.serviceForm = {
        id: "",
        fee: 0,
        supplierNum: "",
        supplierName: "",
        projectName: "",
        projectNum: "",
        projectAddress: "",
        dueDate: null,
        specification: "",
        remark: ""
      }
    },
    
  }

}
</script>


