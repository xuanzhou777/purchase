<template>
  <div class="overlay">
    <h1>欢迎进入迈杰采购系统</h1>
    <form>
      <!--   con = Container  for items in the form-->
      <div class="con">
        <!--     Start  header Content  -->
        <header class="head-form">
            <h2>登录</h2>
            <!--     A welcome message or an explanation of the login form -->
            <p>输入用户名和密码登录系统</p>
        </header>
        <!--     End  header Content  -->
        <br>
        <div class="field-set">
          <!--   user name -->
          <span class="input-item">
           <a-icon type="user" />
          </span>
          <!--   user name Input-->
          <input class="form-input" id="txt-input" v-model="name" type="text" placeholder="用户名" required>
          <br>

          <span class="input-item">
            <a-icon type="key" />
          </span>
           
          <!--   Password Input-->
          <input class="form-input" type="password" v-model="password" placeholder="密码" id="pwd"  name="password" required>
          <br>
          <!--button LogIn -->
          <a-button :loading ="loading" :disabled="disabled" @click="login"> 进入系统</a-button>
          <div class="copy-right">©2020 迈杰转换医学研究（苏州）有限公司 All rights reserved</div>
            
        </div>
      </div>
      
    </form>
    
 </div>
</template>

<style lang="css" scoped>
.overlay {
  width: 100%;
  height: 100vh;
  /* background-image: linear-gradient(-225deg, #E3FDF5 0%, #FFE6FA 100%); */
  background-image: linear-gradient(to top, #eae3fd 0%, #e3edfd 100%);
  background-attachment: fixed;
  background-repeat: no-repeat;
  font-family: 'Abel', sans-serif;
  opacity: .95;
 /* background-image: linear-gradient(to top, #d9afd9 0%, #97d9e1 100%); */
}
.overlay h1{
  text-align: center;
  padding: 30px;
}
.overlay .copy-right{
  width: 100%;
  text-align: center;
  position: absolute;
  left: 0;
  bottom: 20px;
  text-align: center;
  font-size: 12px;
}
form {
  position: relative;
  width: 450px;
  min-height: 480px;
  height: auto;
  border-radius: 5px;
  margin: 0 auto;
  box-shadow: 0 9px 50px hsla(20, 67%, 75%, 0.31);
  padding: 2%;
  background-image: linear-gradient(-225deg, #e3f6fd 50%, #ffe6e6 50%);
}
/* form Container */
form .con {
  display: -webkit-flex;
  display: flex;
  -webkit-justify-content: space-around;
  justify-content: space-around;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
  margin: 0 auto;
}

/* the header form form */
header {
  margin: 2% auto 10% auto;
  text-align: center;
}
/* Login title form form */
header h2 {
  font-size: 250%;
  font-family: 'Playfair Display', serif;
  color: #3e403f;
}
/*  A welcome message or an explanation of the login form */
header p {letter-spacing: 0.05em;}



.input-item {
  background: #fff;
  color: #333;
  padding: 14.5px 0px 15px 9px;
  border-radius: 5px 0px 0px 5px;
}

/* inputs form  */
input[class="form-input"]{
  width: 255px;
  height: 50px;

  margin-top: 2%;
  padding: 15px;
  
  font-size: 16px;
  font-family: 'Abel', sans-serif;
  color: #5E6472;

  outline: none;
  border: none;

  border-radius: 0px 5px 5px 0px;
  transition: 0.2s linear;
    
}


button {
  display: inline-block;
  color: #252537;

  width: 280px;
  height: 50px;

  padding: 0 20px;
  background: #fff;
  border-radius: 5px;
  
  outline: none;
  border: none;

  cursor: pointer;
  text-align: center;
  transition: all 0.2s linear;
  
  margin: 7% auto;
  letter-spacing: 0.05em;
}
/* Submits */
/* .submits {
  width: 48%;
  display: inline-block;
  float: left;
  margin-left: 2%;
} */

/*       Forgot Password button FAF3DD  */
.frgt-pass {background: transparent;}

/*     Sign Up button  */
.sign-up {background: #B8F2E6;}


/* buttons hover */
button:hover {
  transform: translatey(3px);
  box-shadow: none;
}

/* buttons hover Animation */
button:hover {
  animation: ani9 0.4s ease-in-out infinite alternate;
}
@keyframes ani9 {
  0% {
    transform: translateY(3px);
  }
  100% {
    transform: translateY(5px);
  }
}

</style>


<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import Api from "@/api/index.js";
// import Http from "@/util/http.js";

export default {
  name: "Login",
  // components: {
  //   AIcon:Icon
  // }
   data () {
    return {
      name: "",
      password: "",
      loading: false,
      disabled: false
    }
  },
  mounted(){ // 一进入页面的操作

  },
  methods: {
    login(){
      console.log(Api.login)
      if (this.name === ""){
        this.$message.error("请输入用户名");
        return false;
      }
      if (this.password === ""){
        this.$message.error("请输入密码");
        return false;
      }
      // 登录
      let data = {
        username: this.name,
        password: this.password
      }
      this.disabled = true;
      this.loading = true;

      this.axios({
        method: "post",
        url: Api.login,
        data: data,
        headers: { "Content-Type": "application/json"}
      }).then( (response)=> {
          let res = response.data;
        // 登录成功跳转到个人中心
          this.$message.success("登录成功");
          sessionStorage.setItem("userInfo", JSON.stringify(res.user));
          sessionStorage.setItem("token", res.jwtToken);
          // this.setPermissions(res.data.permissions); // 设置用户权限
          setTimeout(()=>{
            this.$router.push({path: "/mine"})
          }, 1500)
      })
      .catch( (error) => {
        this.$message.error(error);
      }).then (() =>{
        this.disabled = false;
        this.loading = false;
      })
    }

  },
  
}

</script>
