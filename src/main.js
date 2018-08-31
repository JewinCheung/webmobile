// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import Vuex from 'vuex'
import auth from './views/utils/auth'
import router from './routers'
import store from './vuex/store'
import filters from './filters/filters'
import { AlertPlugin, ToastPlugin, LoadingPlugin, AjaxPlugin } from 'vux'
// import { WechatPlugin } from 'vux'
import wx from 'weixin-js-sdk'
// 设置微信
window.wx = wx;
Vue.use(Vuex)
// Vue.use(WechatPlugin)
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(AjaxPlugin)
Vue.use(VueRouter)

// 初始化过滤器
Object.keys(filters).forEach(function (k) {
  Vue.filter(k, filters[k])
});
// var myFilter = Vue.filter('substr')
// // console.log(myFilter)

Vue.http.defaults.baseURL = 'http://localhost:9001/api';
 //Vue.http.defaults.baseURL = 'http://e.mdsd.cn:9000/api'
// 1:设置访问的地址

// http request 拦截器  请求
Vue.http.interceptors.request.use(
  config => {
    // if (store.state.token) {  // 判断是否存在token，如果存在的话，则每个http header都加上token
    config.headers.Authorization = "BasicAuth " + auth.getTicket();
    // }
    store.commit('updateLoadingStatus', { isLoading: true })
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器  返回

Vue.http.interceptors.response.use(
  response => {
    store.commit('updateLoadingStatus', { isLoading: false })

    return response;
  },
  error => {
    store.commit('updateLoadingStatus', { isLoading: false })

    if (error.response) {
      console.log(error.response)
      switch (error.response.status) {
        case 401:
         router.replace({
            path: '/login',
          });
        case 404:
          // 返回 401 清除token信息并跳转到登录页面
          // router.replace({
          //   path: '/404',
          // });
        case 0:
          store.commit('updateToastStatus', { show: true })
      }

    } else {

      store.commit('updateToastStatus', { show: true })
    }
    return Promise.reject(error.response)   // 返回接口返回的错误信息
  });

// const store = new Vuex.Store({}) // 这里你可能已经有其他 module
store.registerModule('Load', { // 名字自己定义
  state: {
    isLoading: false,
    isToast: { show: false, type: 'cancel', text: '网络连接失败' }
  },
  mutations: {
    updateLoadingStatus(state, payload) {
      state.isLoading = payload.isLoading
    },
    updateToastStatus(state, payload) {

      state.isToast.show = payload.show
    }

  }
})

router.beforeEach(function (to, from, next) {
  if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
    if (auth.isLogin()) {
      next()
    } else {
      next({
        path: '/login',
        // query: { redirect: to.fullPath }  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  }
  else {

    next()
  }

})

router.afterEach(function (to) {

})

const FastClick = require('fastclick')
FastClick.attach(document.body)

Vue.config.productionTip = false



/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app-box')
