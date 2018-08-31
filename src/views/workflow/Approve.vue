<template>
  <div class="page approve" style="height:100%;">
  
    <view-box ref="viewBox" body-padding-bottom="55px">
      <tabbar slot="bottom">
        <tabbar-item selected @click.native="goInfo()">
          <img slot="icon" src="../../assets/images/app/icon_nav_panel.png">
          <span slot="label">流程表单</span>
        </tabbar-item>
        <tabbar-item @click.native="goAction()">
          <img slot="icon" src="../../assets/images/app/icon_nav_toast.png">
          <span slot="label">流程签核</span>
        </tabbar-item>
        <tabbar-item :badge="AttachFilesNum==0?'': AttachFilesNum+''" @click.native="goAttach()">
          <img slot="icon" src="../../assets/images/app/icon_nav_actionSheet.png">
          <span slot="label">附件信息</span>
        </tabbar-item>
  
      </tabbar>
      <transition>
        <router-view class="router-view"></router-view>
      </transition>
    </view-box>
    <div class="vux-flexbox vux-flex-row" v-show="isRead">
  
      <x-button class="float-button-left" @click.native="rPopshow=true">
        <!---->
        驳回
      </x-button>
  
  
      <x-button class="float-button-right" @click.native="approve">
        签核
      </x-button>
  
    </div>
    <popup v-model="aPopshow" height="80%">
      <div class="popbd">
        <group title="意见">
          <x-textarea v-model="comment" placeholder="说的意见吧">
          </x-textarea>
        </group>
        <group :title="item.name+'-[点击人员完成签核]'" v-for="item in nextUsers" :key='item.name'>
          <cell v-for="user in item.children" :key='user.name' @click.native="approveFlow(user)">
            <div v-html="user.name" slot="icon">{{user.name}}</div>
          </cell>
        </group>
      </div>
    </popup>
  
    <popup v-model="rPopshow" height="80%">
      <div class="popbd">
        <group title="驳回原因">
          <x-textarea v-model="comment" placeholder="请填写驳回原因">
          </x-textarea>
        </group>
        <group title="驳回步骤">
          <cell v-for="step in stepList" :key='step.ApproveUser' :title="step.StepName" @click.native="rejectFlow(step)">
            <span slot="value" style="color:blue;">{{step.ApproveUser}}</span>
          </cell>
        </group>
      </div>
    </popup>
  </div>
</template>

<script lang="babel">
  import {
    Tabbar,
    TabbarItem,
    Popup,
    Group,
    Cell,
    XButton,
    XTextarea,
    ViewBox
  } from 'vux'
  import {
    mapGetters
  } from 'vuex'
  import FlowUtils from '../utils/flowUtils'
  export default {
    data() {
      return {
        qtype: "",
        AttachFilesNum: 0,
        AttachItems: [],
        //签核
        isRead: false,
        aPopshow: false,
        rPopshow: false,
        comment: "",
        nextUsers: [],
        flowUtils: undefined,
        stepList: [],
        instNo: "",
      }
  
    },
    computed: {
      ...mapGetters({
        getRouteInfo: 'getRouteInfo',
        getJson: 'getFormJSON'
      })
  
    },
    components: {
      Tabbar,
      TabbarItem,
      Popup,
      Group,
      Cell,
      XButton,
      XTextarea,
      ViewBox
    },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.loadInfo();
      })
    },
    methods: {
      loadInfo() {
        this.formJSON = this.getJson;
        // console.log()
        var AttachFiles = this.formJSON.AttachFiles
        if (AttachFiles == null || AttachFiles == "") {
          this.AttachFilesNum = 0
  
        } else {
          this.AttachItems = AttachFiles.split(',');
          this.AttachFilesNum = this.AttachItems.length;
        }
        var self = this;
        self.instNo = this.formJSON.FlowNo;
        var http = self.$http;
        // 1:初始化工具方法
        self.flowUtils = new FlowUtils(this.formJSON, http);
        // 2:加载流程步骤
        self.flowUtils.showProcess((data) => {
          // 排除当前签核人员
          self.stepList = data.filter((item) => {
            return item.FlowStatus != -1
          });
        })
        //签核
        self.isRead = this.getRouteInfo.params == 0 ? true : false;
      },
      goInfo() {
        var routeName = this.getRouteInfo.routeName;
        this.$router.push("/" + routeName);
  
      },
      goAction() {
        var qtype = this.getRouteInfo.params;
        this.$router.push("/formAction/" + qtype);
      },
      goAttach() {
        this.$router.push("/attachFiles");
      },
      //签核
      approve() {
        var self = this;
        self.flowUtils.opts.postData = self.getJson;
        self.flowUtils.showNextUser((data) => {
          self.nextUsers = data.Data;
          self.aPopshow = true;
        });
      },
      approveFlow(user) {
        // if(checkErroMsg.length>0){
        //     this.$root.toast={show:true,text:checkErroMsg,type:'error'};
        //     return false;
        // }
        var that = this
        if (!user) {
          that.$vux.toast.show({
            text: '请选择下一步签核人',
            type: "cancel"
          });
          return false;
        }
  
  
        // 找到当前步骤的标识
  
        that.flowUtils.opts.postData.NextStepNo = that.nextUsers[0].id;
        that.flowUtils.opts.postData.NextUser = [user.id];
        that.flowUtils.opts.postData.Comment = that.comment;
        that.aPopshow = false;
  
        that.flowUtils.execFlow((data) => {
          // console.log(data)
          if (data.Statu == "Y") {
            that.$vux.toast.show({
              text: data.Msg,
              type: "success"
            })
            this.$store.dispatch('MinusMsg'); //消息数量减一
            setTimeout(() => {
              that.$router.push("/workflow");
            }, 2000)
          }
        });
      },
      rejectFlow(step) {
  
        var that = this
        this.flowUtils.opts.postData.NextStepNo = step.StepNo;
        this.flowUtils.opts.postData.NextUser = [step.ProcessUser];
        this.flowUtils.opts.postData.Comment = that.comment;
        if (that.comment == '') {
          that.$vux.toast.show({
            text: '请说明驳回原因',
            type: "error"
          });
          return;
        }
        this.rPopshow = false;
  
        this.flowUtils.reject((data) => {
          // console.log(data)
          if (data.Statu == "Y") {
            that.$vux.toast.show({
              text: data.Msg,
              type: "success"
            });
            this.$store.dispatch('MinusMsg'); //消息数量减一
            setTimeout(() => {
              that.$router.push("/workflow");
            }, 2000)
          }
        });
      },
    }
  }
</script>

<style type="text/css" scoped>
  .router-view {
    width: 100%;
    padding-bottom: 46px;
  }
  
  .float-button-right {
    position: fixed;
    bottom: 70px;
    right: 20px;
    height: 40px;
    width: 60px;
    font-size: 18px;
    color: #FFFFFF;
    border-radius: 9px;
    border-width: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0.5);
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
  
  .float-button-left {
    position: fixed;
    bottom: 70px;
    left: 20px;
    height: 40px;
    width: 60px;
    font-size: 18px;
    color: #FFFFFF;
    border-radius: 9px;
    border-width: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0.5);
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }
</style>


