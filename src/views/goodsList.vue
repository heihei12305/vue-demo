<template>
    <div>
     <nav-header></nav-header>
      <nav-bread>
        <span slot="bread">Goods</span>
      </nav-bread>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==='all'}">All</a></dd>
                <dd v-for = "(price,index) in priceFilter" :key="index" @click="priceChecked=index">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked===index}">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList" :key="index">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                  <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading">
              </div>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
     <nav-footer></nav-footer>

    </div>
</template>
<script>
    import './../assets/css/base.css'
    import './../assets/css/product.css'
    import  NavHeader from './../components/Header'
    import  NavFooter from './../components/NavFooter'
    import NavBread from './../components/navBread'
    import axios from 'axios'
    export default {
       name: 'App',
       data(){//组件里data必须是个闭包，必须是个函数
          return{
            goodsList:[],
            priceFilter:[
              {
                startPrice:'0.00',
                endPrice:'1000.00'
              },
              {
                startPrice:'1000.00',
                endPrice:'2000.00'
              },
               {
                startPrice:'2000.00',
                endPrice:'5000.00'
              }
            ],
            priceChecked:'all',
            filterBy:false,
            overLayFlag:false,
            sortFlag:true,
            page:1,
            pageSize:8,
            busy:true,
            loading:false

          }
       },
       components:{
          NavHeader,//自动填充  NavHeader:NavHeader
          NavFooter,
          NavBread
       },
       mounted:function(){
         this.getGoodsList();
       },
       methods:{
         getGoodsList(flag){
           var param = {
             page:this.page,
             pageSize:this.pageSize,
             sort:this.sortFlag?1:-1,
             priceLevel:this.priceChecked
           }
           this.loading = true;
          axios.get("/goods",{
            params:param
          }).then((result)=>{

            let res = result.data;
            this.loading = false;
            //console.log(res);
            if(flag){
              this.goodsList = this.goodsList.concat(res.res.list);
              if(res.result.count===0)
              {
                this.busy = true;
              }else
              {
                this.busy = false;
              }
            }else{
              this.goodsList = res.res.list;
              this.busy = false;
            }
            // this.goodsList = [1121217,127];
          })
       },
       sortGoods(){
         this.sortFlag = !this.sortFlag;
         this.page=1;
         this.getGoodsList();
       },
        showFilterPop(){
          this.filterBy=true;
          this.overLayFlag = true;

        },
        setPriceFilter(index){
            this.priceChecked = index;
            //closePop();
            this.page=1;
            this.getGoodsList();
        },
        closePop(){
           this.filterBy=false;
          this.overLayFlag = false;
        },
        loadMore(){
            this.busy = true;//滚动加载失效
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
            }, 500);
        }
      }
    }
    
</script>
