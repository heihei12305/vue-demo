import Vue from 'vue'
import Router from 'vue-router'
// import HelloWorld from '@/components/HelloWorld.vue'
import goodsList from '../views/goodsList.vue'
import Title from '@/router/views/title.vue'
import Image from '@/router/views/image.vue'
import Cart from '@/router/views/cart.vue' 
import Counter from '../components/Counter.vue'




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
      path:'/cart/:cartId',
      name:'cart',
      component:Cart
    }
  ]
})
