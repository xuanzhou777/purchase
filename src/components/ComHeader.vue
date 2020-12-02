<!--通用header组件-->
<template>
  <div class="header-wrap">
    <div class="container">
      <div class="top-line">
        <div class="left-part">
          <img src="../assets/img/logo.jpg" class="logo" alt="">
          <div class="title">迈杰采购系统</div>
        </div>
        <div class="right-part">
          <!--用户信息-->
          <div class="user-info">
            <div class="user-line">
              <!-- <Icon type="ios-contact" class="user-icon" /> -->
              <a-avatar icon="user" class="user-icon" />
              <p class="welcome-txt">{{user.name}}</p>
              <a-icon type="export"  class="exit-icon"/>
              <p class="out-txt" @click="logOut">退出登录</p>
            </div>
          </div>
          <!--menu-->
          <a-menu  :selected-keys="[active]" class="menu" mode="horizontal"  @click="handleClick">
            <a-menu-item key="mine"> <a-icon type="home" />个人中心 </a-menu-item>
            <a-menu-item key="all"> <a-icon type="file-search" />采购申请查询</a-menu-item>
          </a-menu>
        </div>
      </div>
     
     
    </div>
  </div>
</template>

<script>
// import { mapState } from "vuex";
// import Api from "@/api/index.js";
// import Http from "@/util/http.js";


export default {
  name: "ComHeader",
  props:["active"],
  data () {
    return {
      user: {
        name: "",
      }
    }
    
  },
  mounted(){
    if (!sessionStorage.getItem("token")) {
      this.$router.push({ name: "login"});
    } else {
      // let per = JSON.parse(sessionStorage.getItem("PERMISSION"))
      //this.$store.commit("SET_PERMISSION", { info: per } );
      this.user = JSON.parse(sessionStorage.getItem("userInfo"))

    }
  },
  computed: {
    // ...mapState({
    //   permissions: state => state.permissions
    // }),
  },

  methods: {
    logOut() { // 登出
      this.$message.success("登出成功");
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("token");
      setTimeout(()=>{
        this.$router.push({ name: "login"});
      }, 1000)
      
    },
    handleClick(e) {
      console.log(e);
      this.$router.push({path: `/${e.key}`})
    }
    
    
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-wrap{
  height: 102px;
  border-bottom: 1px solid #1d90eb;
}
.header-wrap .container{
  box-sizing: border-box;
  width:100%;
  padding: 0 40px;
  height: 100%;
  
}
.container .top-line{
  width: 100%;
  height: 102px;
  display: flex;
  justify-content: space-between;
}
.container .left-part{
  display: flex;
  line-height: 102px;
  font-size: 40px;
  align-items: center;
}
.container .left-part .logo{
  margin-right: 10px;
  width: 60px;
  height: 62px;
}
.left-part .title{
  line-height: 60px;
  color: #1d90eb;
  font-size: 30px;;

 }
.right-part .user-info{
  height: 60px;
  margin-right: 10px;
  
}
.user-info .user-line{
  height: 60px;
  align-items: center;
  display: flex;
  justify-content: flex-end;
  font-size: 14px;
  
}
.user-line p{
  margin: 0;
}
.user-line .user-icon{
  margin: 0 5px 0 15px;
 
}
.user-line .exit-icon{
  margin: 0 5px 0 15px;
  font-size: 26px;
  color: #1d90eb;
}
.user-line .out-txt{
  color: #1d90eb;
  cursor: pointer;
}
.ant-menu-horizontal{
  height: 40px;
  line-height: 40px;
  border: none;
}



</style>
