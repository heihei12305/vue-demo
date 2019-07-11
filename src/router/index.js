import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
import goodsList from '../views/goodsList.vue'
import Cart from '../views/Cart.vue'





Vue.use(Router)

export let router =  new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      name: 'goodsList',
      component: goodsList,
    },
    {
      path:'/cart',
      name:'Cart',
      component:Cart
    }
  ]
})
