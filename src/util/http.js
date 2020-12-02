module.exports = {
  Decrypt: function(code) { // 字符串解密函数
    code=unescape(code);  
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);  
    for(var i=1;i<code.length;i++){  
    c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));  
    }  
    return c;  
  },
  AJAXPOST: function(obj, url, type, data, fn, always) {
    obj.axios({
      method: type,
      url,
      data,
      // transformRequest: [function (data) {
      //   // Do whatever you want to transform the data
      //   // let ret = ""
      //   // for (let it in data) {
      //   //   ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&"
      //   // }
      //   // return ret
      //   let fd = new FormData()
      //   for(var key in data){
      //     fd.append(key,data[key])
      //   }
      //   return fd;
      // }],
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")? `Bearer ${sessionStorage.getItem("token")}` : ""
      }
    }).then( (response)=> {
      console.log(response)
      // if (response.statusCode!= 200) {
      //   obj.$message.error(response.message);
       
      // }  else {
        fn && fn(response.data);
      // }
    })
    .catch( (error) => {
      obj.$message.error(error);
    }).then (() =>{
      always && always();
    })
  },
  AJAXGET: function(obj, url, type, fn, always) {
    obj.axios({
      method: type,
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": sessionStorage.getItem("token")? `Bearer ${sessionStorage.getItem("token")}` : ""
      }
    }).then( (response)=> {
      // if (response.data.code == "702" || response.data.code == "401") {
      //   // obj.$Message.error({
      //   //   content: "登录信息有误",
      //   //   duration: 1.5
      //   // });
      //   obj.$Message.info("请重新登录");
      //   setTimeout(()=>{
      //     obj.$router.push({ name: "login"});
      //   }, 1500)
      // } else {
        console.log(response)
        fn && fn(response.data);
      // }
    })
    .catch( (error) => {
      obj.$message.error(error);
      console.log("error")
    }).then (() =>{
      always && always();
    })
  }
}