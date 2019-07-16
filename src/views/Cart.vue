<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>
      <span>My Cart</span>
    </nav-bread>
    <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" version="1.1"
         xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    </svg>
    <div class="container">
      <div class="cart">
        <div class="page-title-normal">
          <h2 class="page-title-h2"><span>My Cart</span></h2>
        </div>
        <div class="item-list-wrap">
          <div class="cart-item">
            <div class="cart-item-head">
              <ul>
                <li>Items</li>
                <li>Price</li>
                <li>Quantity</li>
                <li>Subtotal</li>
                <li>Edit</li>
              </ul>
            </div>
            <ul class="cart-item-list">
              <li v-for="(item,index) in cartList" :key="index">
                <div class="cart-tab-1">
                  <div class="cart-item-check">
                    <a href="javascript:void(0)" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked=='1'}" @click="editCart('checked',item)">
                      <svg class="icon icon-ok">
                        <use xlink:href="#icon-ok"></use>
                      </svg>
                    </a>
                  </div>
                  <div class="cart-item-pic">
                    <img v-bind:alt="item.productName" v-bind:src="'/static/'+item.productImage">
                  </div>
                  <div class="cart-item-title">
                    <div class="item-name">{{item.productName}}</div>
                  </div>
                </div>
                <div class="cart-tab-2">
                  <div class="item-price">{{item.salePrice|currency('$')}}</div>
                </div>
                <div class="cart-tab-3">
                  <div class="item-quantity">
                    <div class="select-self select-self-open">
                      <div class="select-self-area">
                        <a class="input-sub" @click="editCart('minu',item)">-</a>
                        <span class="select-ipt">{{item.productNum}}</span>
                        <a class="input-add" @click="editCart('add',item)">+</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="cart-tab-4">
                  <div class="item-price-total">{{(item.productNum*item.salePrice)|currency('$')}}</div>
                </div>
                <div class="cart-tab-5">
                  <div class="cart-item-opration">
                    <a href="javascript:void(0);" class="item-edit-btn" @click="delCartConfirm(item.productId)">
                      <i class="iconfont  icondelete">
                        
                      </i>
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="cart-foot-wrap">
          <div class="cart-foot-inner">
            <div class="cart-foot-l">
              <div class="item-all-check">
                <a href="javascript:void(0)" @click="toggleCheckAll" >
                  <span class="checkbox-btn item-check-btn"  v-bind:class="{'check':checkAllFlag}">
                      <svg class="icon icon-ok"><use xlink:href="#icon-ok"/></svg>
                  </span>
                  <span>Select all</span>
                </a>
              </div>
            </div>
            <div class="cart-foot-r">
              <div class="item-total">
                Item total: <span class = "total-price">{{totalPrice | currency($)}}</span>
              </div>
              <div class="btn-wrap">
                <a class="btn btn--red" @click="checkOut" v-bind:class="{'btn--dis':checkedCount===0}">Checkout</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <Modal :mdShow = "modalConfirm" @close="closeModal">
      <p slot="message">你确实要删除此条数据吗？</p>
      <div slot="btnGroup" >
        <a class="btn btn--m" href="javascript:;" @click="delCart">确认</a>
        <a class="btn btn--m" href="javascript:;" @click="modalConfirm = false">关闭</a>
      </div>
    </Modal>
    <nav-footer></nav-footer>
  </div>
</template>
<style>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
</style>
<script>
    import './../assets/css/checkout.css'
    import './../../static/font_1286968_fmcc4o79wbu/iconfont.css'
    import  NavHeader from './../components/Header'
    import  NavFooter from './../components/NavFooter'
    import NavBread from './../components/navBread'
    import Modal from './../components/Modal'
    import axios from 'axios'
    import {currency} from './../util/currency'
    export default{
      data(){
        return {
            cartList:[],
            modalConfirm:false,
            productId:''

        }
      },
      mounted(){
        this.init();
      },
      filters:{
        currency:currency
      },
      computed:{
        checkAllFlag(){
          return this.checkedCount == this.cartList.length;
        },
        checkedCount(){
          let i = 0;
          this.cartList.forEach((item)=>{
            if(item.checked==1)
              i++;
          })
          return i;
        },
        totalPrice(){
          let money = 0;
          this.cartList.forEach((item)=>{
            if(item.checked==1)
            {
              money += parseFloat(item.salePrice)*parseInt(item.productNum);
            }
          })
          return money;
        }
      },
      components:{
        NavHeader,
        NavFooter,
        NavBread,
        Modal
      },
      methods:{
        init(){
          axios.get("/users/cartList").then((response)=>{
            let res = response.data;
            this.cartList = res.result;
          });
        },
        closeModal(){
          this.modalConfirm = false;
        },
        delCartConfirm(productId){
            this.productId = productId
            this.modalConfirm = true;
        },
        delCart(){
          console.log(1);
          axios.post("/users/cart/del",{
            productId:this.productId
          }).then((response)=>{
            let res = response.data;
            if(res.status == '0'){
              this.modalConfirm = false;
              this.init();
            }
          })
        },
        toggleCheckAll(){
          let flag = !this.checkAllFlag;
          this.cartList.forEach((item,index)=>{
            item.checked = flag=='1'?1:0;
          });
          axios.post("/users/cart/editCheckAll",{
            checkAll:this.checkAllFlag
          }).then((response)=>{
            let res = response.data;
            if(res.status=='0')
            {
              console.log("update success");
            }
          })
        },
        editCart(flag,item){
          if(flag=='add')
          {
            item.productNum++;
          }
          else if(flag=='minu'){
            if(item.productNum<=1){
              return ;
            }
             item.productNum--;
          }else{
            item.checked = ! item.checked;
          }

          axios.post("/users/cart/edit",{
            productId:item.productId,
            productNum:item.productNum,
            checked:item.checked
          }).then((response)=>{
            let res = response.data;
          })
        },
        checkOut(){
          if(this.checkedCount>0)
          {
            this.$router.push({
              path:"/address"
            })
          }
        }
    }
    }
</script>
