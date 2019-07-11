
> # 这是一个基于node-express和vue搭建的简单电商平台，功能陆续增加中！
<br/>



## 目前实现功能:<br/>
* ### 基于mongoose的商品分页，排序，根据价格区间取商品<br/>

>路径 demo1\server\routes\goods.js<br/>


```
//核心代码
router.get("/list",(req,res,next)=>{
   //分页功能实现
    let page = parseInt(req.param("page"));
    let pageSize = parseInt(req.param("pageSize"));
    let sort = parseInt(req.param("sort"));//-1降序，1升序
    let priceLevel = req.param("priceLevel");
    let skip = (page-1)*pageSize;

    let params = {};
    let priceGt = '',priceLte = '';
    if(priceLevel!="all")
    {
        switch (priceLevel){
            case '0':priceGt = 0;priceLte = 1000;break;
            case '1':priceGt = 1000;priceLte = 2000;break;
            case '2':priceGt = 2000;priceLte = 5000;break;
        }
        params = {//实现分价格区间展示数据
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
    
    let goodsModel = Goods.find(params).skip(skip).limit(pageSize);//实现分页展示数据即每页最多
    goodsModel.sort({'salePrice':sort});
    goodsModel.exec((err,doc)=>{
        if(err){
            res.json({
                status:"1",
                msg:err.message
            });
        }else{
            res.json({
                status:"0",
                msg:"",
                res:{
                    count:doc.length,
                    list:doc
                }
            })
        }
    })
```

<br/>

* ### 基于 vue-infinite-scroll 的无限加载
  
>路径 demo1\src\views\goodsList.vue

```
//核心代码
loadMore(){
  this.busy = true;//滚动加载失效
  setTimeout(() => {
    this.page++;
    this.getGoodsList(true);
  }, 500);
}
```

<br/>

* ### 基于 axios 和 cookie 的 登陆登出 以及 页面刷新保存登陆状态

>路径 src\components\Header.vue   server\routes\users.js

<br/>

```
//登陆核心代码
//前端
 login(){
    if(!this.userName||!this.userPwd)
    {
      this.errorTip = true;
      return ;
    }
    axios.post("/users/login",{
      userName:this.userName,
      userPwd:this.userPwd
      
    }).then((response)=>{
      let res = response.data;
      if(res.status == "0"){
        this.errorTip = false;
        this.loginModalFlag = false;
        this.nickName = res.result.userName;

      }else{
        this.errorTip = true;
      }
    })
  }


//后台
  router.post("/login",(req,res,next)=>{
  
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message

      });
    }else{
      if(doc){
          res.cookie("userId",doc.userId,{
            path:'/',
            maxAge:1000*60*60
          });
          res.cookie("userName",doc.userName,{
            path:'/',
            maxAge:1000*60*60
          });
          //req.session.user = doc;
          res.json({
            status:'0',
            msg:'',
            result:{
              userName:doc.userName
            }
          })
      }
    }
  })
})

```

<br/>
<br/>

```
//登出核心代码
//前端
logOut(){
  axios.post("/users/logout").then((response)=>{
    let res = response.data;
    if(res.status=="0")
    {
      this.nickName = '';
    }
  })

}

//后台登出接口
router.post("/logout",(req,res,next)=>{
  res.cookie("userId","",{
    path:"/",
    manAge:-1
  });
  res.json({
    status:"0",
    msg:"",
    result:''
  })
})
```

<br/>
<br/>

```
//刷新保存登陆状态核心代码
//前端
 checkLogin(){         
     axios.get("/users/checkLogin").then((response)=>{
     let res = response.data;
     if(res.status=='0'){
       this.nickName = res.result.userName;
     }
   })

}


//后台
router.get("/checkLogin",(req,res,next)=>{
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:"",
      result:{
        userName:req.cookies.userName||''
    
    }
    })
  }else{
    res.json({
      status:'1',
      msg:'no login',
      result:""
    })
  }
})
```

<br/>

* ### 基于  dev 中 proxyTable 代理插件解决跨域问题
>路径 config\index.js


```
proxyTable: {
   // 代理插件解决跨域
    '/goods':{
      target:'http://localhost:3000'
    },
    '/users/*':{
      target:'http://localhost:3000'
    }
  },//其中*表示可以跟任意路径，也即只要是/user开头就可以了

```
<br/>

* ### 基于cookie完成登陆拦截，也即没有登陆无法拥有一些功能
>路径 server\app.js
```
app.use((req,res,next)=>{
  if(req.cookies.userId){
    next();
  }else{
    if(req.originalUrl=='/users/login'||req.originalUrl=='/users/logout'||req.path=='/goods/list'){//白名单
      next();
    }
    else{
      res.json({
        status:'10001',
        msg:'no login',
        result:''
      })
    }
  }
});
```

* ### 增加购物车界面，完善功能,采用全局模态框
> 路径 src\views\Cart.vue , src\components\Modal.vue

```
<template>
    <div>
     <div class="md-modal modal-msg md-modal-transition "  v-bind:class="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-top">
              <button class="md-close" @click="closeModal">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
                  <slot name="message"></slot>
              </div>
              <div class="btn-wrap">
                  <slot name="btnGroup"></slot>
              </div>
            </div>
          </div>
        </div>
        <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
    </div>
</template>
<script>
export default {
    props:["mdShow"],
    data(){
        return {
            msg:'hello world'
        }
    },
    methods:{
        closeModal(){
            this.$emit("close");
        }
    }
}
</script>

```

****
****
****
 ## 启动方式  :
 * ### 进入 vue-cli（本代码为demo1）文件夹 
   * cmd  
   * npm install 
   * npm run dev 
   * 默认 http://localhost:8080
  
 * ### 进入  /server/bin
   *  npm install
   * 运行 www 文件
   * 或者—>
      * cmd
      * pm2 start www (pm2是一个很好的监测node的工具哦，可以了解一下)
