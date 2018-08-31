<template>
  <div class="page" style="height:100%">
    <view-box ref="viewBox">
      <div class="DescInfo" v-html='getVoteInfo.Desc'></div>
      <divider>签到时间段</divider>
      <card>
  
        <div slot="content" class="voteDesc">
  
          <span>开始时间：{{getVoteInfo.StartDate}} </span>
          <br>
          <span>结束时间：{{getVoteInfo.EndDate}}</span>
        </div>
  
      </card>
  
  
      <div class="voteDesc">
        <div class="portlet light profile-sidebar-portlet">
          <div class="profile-userpic">
            <img class="img-responsive UserImg" alt="" src="http://e.mdsd.cn:9000/Image/login/login_head.png">
          </div>
          <div class="profile-usertitle">
            <div class="profile-usertitle-name">{{user.UserName}}</div>
            <div class="profile-usertitle-job">{{user.GongHao}}</div>
          </div>
  
        </div>
  
      </div>
  
  
      <box gap="0px 20px">
        <x-button v-if="Isdisabled" @click.native="SignIn()" :gradients="['#1D62F0', '#19D5FD']">签到</x-button>
      </box>
    </view-box>
  </div>
</template>

<script lang="babel">
  import {
    XButton,
    ViewBox,
    Box,
    Divider,
    Card
  
  } from 'vux'
  import {
    mapGetters
  } from 'vuex'
  
  export default {
    name: 'signinfo',
    components: {
      XButton,
      ViewBox,
      Box,
      Divider,
      Card
    },
    data() {
      return {
        deviceHeight: '500px', //滚动容器高度
        desc: '', //详情内容
        Isdisabled: true, //按钮开关
        user: {
          "UserName": '',
          "GongHao": '',
        },
        getVoteInfo: {
          StartDate: '',
          EndDate: '',
          Desc: ''
  
        }
      }
    },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        //路由器进入 初始化
        vm.voteid = vm.$route.params.voteid; //活动ID
        // vm.vstatus = vm.$route.params.vstatus; //活动状态 0：未开始  1：进行中 2：结束
        vm.Isdisabled = true; //开关
        vm.deviceHeight = vm.$parent.windowHeight + "px";
  
  
        vm.loadInfo(vm.voteid);
  
      })
    },
    mounted() {
      if (this.user && this.user.UserName.length == 0) {
        this.getUserInfo();
      }
  
    },
    methods: {
      //加载数据
      loadInfo(voteid) {
        var SerialNo = this.voteid; //活动id
        this.$http.get("Vote/GetSignInfo/" + SerialNo).then((res) => {
  
          var josnData = res.data;
          document.title = josnData.title; //title值
          var vstatus = josnData.state;
          this.getVoteInfo.StartDate = josnData.StartDate.replace("T", " ");
          this.getVoteInfo.EndDate = josnData.EndDate.replace("T", " ");
          this.getVoteInfo.Desc = josnData.desc;
  
          if (josnData.RecordCount > 0) {
            this.Isdisabled = false;
            this.$vux.toast.show({
              text: "已签到！",
              type: "warn"
            });
          }
  
          if (this.vstatus == 0) {
            this.Isdisabled = false;
            this.$vux.toast.show({
              text: "签到未开始！",
              type: "warn"
            });
          }
  
          if (this.vstatus == 2) {
            this.Isdisabled = false;
            this.$vux.toast.show({
              text: "签到已结束！",
              type: "warn"
            });
  
          }
        });
      },
      getUserInfo() {
        var that = this;
        that.$http.get("UserInfo").then(function(success) {
          if (success.data) {
            var postData = success.data;
            var userInfo = that.user;
            Object.keys(userInfo).forEach(function(key) {
              that.user[key] = postData[key];
            })
          }
        });
      },
  
      SignIn() {
        var SerialNo = this.voteid; //活动id
        this.$http.post("Vote/SignIn/" + SerialNo).then((response) => {
  
          // console.log(response);
  
          if (response.data.Statu == "Y") {
            this.Isdisabled = false;
            this.$vux.toast.text(response.data.Msg);
  
          } else {
            this.$vux.toast.show({
              text: response.data.Msg,
              type: "warn"
            });
  
          }
  
        }, (error) => {
          this.$vux.toast.show({
            text: response.data.Msg,
            type: "warn"
          });
  
        })
  
      }
    }
  
  
  }
</script>

<style scoped lang="less">
  .DescInfo {
    padding: 15px;
    color: #333;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    text-align: left;
  }
  
  .voteDesc {
    padding: 0px 15px 5px 15px;
    color: #333;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
    text-align: center;
    span {
      color: #5b9bd1;
      font-weight: 600;
      margin-bottom: 7px;
    }
  }
  
  .profile-userpic img {
    float: none;
    margin: 0 auto;
    padding-top: 15px;
    width: 30%;
    height: 30%;
    display: block;
    max-width: 100%;
    -webkit-border-radius: 30% !important;
    -moz-border-radius: 30% !important;
    border-radius: 30% !important;
  }
  
  .portlet.light {
    padding: 12px 20px 15px 20px;
    background-color: #fff;
  }
  
  .portlet {
    margin-top: 0px;
    padding: 0px;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    -ms-border-radius: 4px;
    -o-border-radius: 4px;
    border-radius: 4px;
  }
  
  .profile-usertitle {
    text-align: center;
    margin-top: 20px;
  }
  
  .profile-usertitle-name {
    color: #5a7391;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 7px;
  }
  
  .profile-usertitle-job {
    text-transform: uppercase;
    color: #5b9bd1;
    font-size: 14px;
    font-weight: 800;
    margin-bottom: 7px;
  }
  
  .weui-panel:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 0px solid;
    color: #E5E5E5;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
</style>
