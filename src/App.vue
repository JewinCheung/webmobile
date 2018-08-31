<template>
  <div id="app-box" style="height:100%;">
    <!-- main view -->
    <transition name="bounce">
      <keep-alive>
        <router-view class="view">
        </router-view>
      </keep-alive>
    </transition>
      <loading v-model="isLoading"></loading>
      <toast v-model="isToast.show" :type="isToast.type">
        <p>{{isToast.text}}</p>
      </toast>
  </div>
</template>

<script>
  import auth from './views/utils/auth'
  import common from './views/utils/common'
  import wxUtils from './views/utils/wxUtils'
  import {
    Toast,
    Loading,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {
    mapState
  } from 'vuex'
  export default {
    components: {
      Toast,
      Loading
  
    },
    computed: {
      ...mapState({
        isLoading: state => state.Load.isLoading,
        isToast: state => state.Load.isToast
      })
    },
    data() {
      return {
        ticket: '',
        dHeight: 0,
        windowHeight:0,
      }
    },
    created() {
  
      // console.log(state => state.Load.isLoading)
      //检查cookie
      common.setHeight();
      //减去header 和减去微信的头部标题
      // this.dHeight = common.getHeight() - 44;
      
       this.dHeight = window.innerHeight;

      this.windowHeight=window.innerHeight;
      //检查请求地址是否包含tickt,如果包含那么就代表用户是通过微信登陆
      // var ticketValue = decodeURI(common.getUrlParam("ticket"));
      // var account = decodeURI(common.getUrlParam("gongHao"));
      // var sign = decodeURI(common.getUrlParam("sign"));
  
  
      var ticketValue = common.getCookie("ticket");
      var account = common.getCookie("gongHao");
      var sign = common.getCookie("sign");
      console.log(ticketValue)
      console.log(account)
      console.log(sign)
      if (ticketValue && ticketValue.length > 10) {
        //设置用户登录信息
        auth.setUser(account, ticketValue, true);
      } else {
        console.log("未获取到ticket")
      }
  
      if (sign && sign.length > 0) {
        var signArray = sign.split('|');
  
        wxUtils.setWXCfg(signArray[0], signArray[1], signArray[2], signArray[3]);
  
      } else {
        console.log("未获取到sign")
      }
      //检查是否登陆
      if (auth.isLogin()) {
        this.ticket = auth.getTicket();
        this.$http.defaults.headers.common['Authorization'] = this.ticket
        console.log(this.$http.defaults.headers);
      }
    },
    watch: {
      '$route': function() {
         
        if (!auth.isLogin()) {
          this.$router.push("/login");
        }
      }
  
    },
  
  
  
  }
</script>

<style lang="less">
  @import './styles/reset.less';
  
  /*单页面的布局*/
  
  html,
  body {
    -webkit-tap-highlight-color: transparent;
    overflow-x: hidden;
    height: 100%;
    width: 100%;
  }
  
  .view {
    height: 100%;
  }
  
  body,
  
  /*页面切换动画*/
  
  .bounce-enter-active {
    animation: bounce-in 500ms;
  }
  
  .bounce-leave-active {
    animation: bounce-out 500ms;
  }
  
  @keyframes bounce-in {
    from {
      transform: translate3d(100%, 0, 0);
    }
    to {
      transform: translate3d(0, 0, 0);
    }
  }
  
  @keyframes bounce-out {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
