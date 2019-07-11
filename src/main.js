// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'

// import {currency} from './util/currency'

// import {sum,minus} from './util'
// import * as util from './util'
//通过*将util封装起来

Vue.config.productionTip = false
// Vue.filter("currency",currency);

Vue.use(infiniteScroll);

Vue.use(VueLazyLoad,{
  loading:'/static/loading-svg/loading-balls.svg'
})
// console.log(`sum:${sum(1,2)}`)
// console.log(`sum:${util.sum(1,2)}`)

// console.log(`sum:${minus(1,2)}`)


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
