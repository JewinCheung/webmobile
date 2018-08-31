<template>
  <div>
    <!--签核操作-->
    <flexbox v-show="isRead">
      <flexbox-item>
        <box gap="20px 10px">
          <x-button type="warn" @click.native="rPopshow=true">
            驳回
          </x-button>
        </box>
      </flexbox-item>
      <flexbox-item>
        <box gap="20px 10px">
          <x-button type="primary" @click.native="approve">
            签核
          </x-button>
        </box>
      </flexbox-item>
    </flexbox>
    <divider>签核过程</divider>
    <timeline>
      <timeline-item v-for="item in stepList" :key='item.ApproveUser'>
        <h4 :class="getStatusCss(item.FlowStatus)">处理人:{{item.ApproveUser}} 状态:{{ getStatusName(item.FlowStatus) }}</h4>
        <p>到达:{{item.CreateTime | substr(13)}} 审批:{{item.ApproveDate}}</p>
        <p>意见:{{item.Comment}}</p>
      </timeline-item>
    </timeline>
  
  
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
    XHeader,
    Group,
    Cell,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Box,
    XButton,
    Timeline,
    TimelineItem,
    Divider,
    Popup,
    XTextarea,
    Flexbox,
    FlexboxItem
  } from 'vux'
  import FlowUtils from '../../utils/flowUtils'
  import {
    mapGetters
  } from 'vuex'
  import auth from '../../utils/auth'
  export default {
    data() {
      return {
        selectIndex: 0,
        stepList: [],
        instNo: "",
        flowUtils: undefined,
        formJSON: {
          "FlowName": ""
        },
        nextUsers: [],
        aPopshow: false,
        rPopshow: false,
        comment: "",
        contentHeight: "400px",
        isRead: false,
        // 验证不通过的错误消息
        checkErroMsg: ""
      }
    },
    created() {
      this.contentHeight = (this.$parent.dHeight - 88) + "px";
    },
    computed: {
      ...mapGetters({
        getJson: 'getFormJSON'
      })
  
    },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.loadInfo();
      })
    },
    components: {
      XHeader,
      Group,
      Cell,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      Box,
      XButton,
      Timeline,
      TimelineItem,
      Divider,
      Popup,
      XTextarea,
      Flexbox,
      FlexboxItem
    },
    methods: {
      loadInfo() {
        // 1:每次进来设置表单
        this.selectIndex = 0;
        // 2：每次进来设置评论清楚
        this.comment = "";
        this.formJSON = this.getJson;
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
        var qtype = this.$route.params.type;
        self.isRead = parseInt(qtype) == 0 ? true : false;
  
      },
      getStatusName(flag) {
        switch (flag) {
          case -1:
            return "待处理"
          case 0:
            return "驳回"
          case 1:
            return "同意"
          case 3:
            return "转交";
          case 4:
            return "被撤回"
          case 5:
            return "关闭"
        }
      },
      getStatusCss(flag) {
        switch (flag) {
          case -1:
            return "wait"
          case 0:
            return "reject"
          case 1:
            return "success"
          case 3:
            return "deliver";
          case 4:
            return "deliver"
          case 5:
            return "warn"
        }
      },
      approve() {
        var self = this;
        self.flowUtils.opts.postData = self.getJson;
        self.flowUtils.showNextUser((data) => {
          self.nextUsers = data.Data;
          self.aPopshow = true;
        });
      },
      backIndex() {
        this.$router.push("/workflow");
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
      //传递到子子组件'
      subClick(key) {
        this.$broadcast('pSheetClick', key);
      }
    }
  
  }
</script>


<style type="text/css" scoped>
  .approve p {
    color: #888;
    font-size: 0.8rem;
  }
  
  .approve h4 {
    color: #666;
    font-weight: normal;
  }
  
  
  /*待处理*/
  
  .approve h4.wait {
    color: #31B0D5;
  }
  
  .approve h4.success {
    color: #449D44;
  }
  
  .approve h4.deliver {
    color: #286090;
  }
  
  .approve h4.warn {
    color: #EC971F;
  }
  
  .approve h4.reject {
    color: #C9302C;
  }
  
  .swiperItem {
    overflow: auto;
  }
</style>