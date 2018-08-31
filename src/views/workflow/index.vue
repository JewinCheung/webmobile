<template>
  <div class="page workflow" style="height:100%;">
    <view-box ref="viewBox" body-padding-bottom="55px">
    
        <div v-if="selectIndex==0" class="swiperItem">
          <card v-for="item in waitData" :key="item.InstName" :header="{title:'编号:'+item.FlowNumber}" @click.native="enterApprove(item)">
            <div slot="content" class="card_bd">
              <span style="color:red;">标题:</span>{{item.InstName}}
              <div class="flow_info">
                <span>发起人:{{item.SubUser}}</span>
                <span>时间:{{item.SubTime | substr(10)}}</span>
              </div>
            </div>
          </card>
        </div>
        <div v-if="selectIndex==1" class="swiperItem">
          <div>
            <card v-for="item in myFlowData" :key="item.FlowNumber" @click.native="enterQueryFlow(item)">
              <div slot="header" class="flow_info" style="padding:15px;">
                <span>编号:{{item.FlowNumber}}</span>
                <span>时间:{{item.SubTime | substr(10)}}</span>
              </div>
              <div slot="content" class="card_bd">
                <span style="color:red;">标题:</span>{{item.InstName}}
              </div>
            </card>
          </div>
          <box gap="10px 10px">
            <x-button @click.native="loadMore" type="primary" v-show="monthFlag-myFlowData.length<=5">点击加载更多</x-button>
          </box>
        </div>
     
      <!--菜单-->
      <tabbar v-model="selectIndex" slot="bottom">
        <tabbar-item selected @on-item-click="selectIndex = 0">
          <img slot="icon" src="../../assets/images/app/icon_nav_msg.png">
          <span slot="label">待审</span>
        </tabbar-item>
        <tabbar-item @on-item-click="selectIndex = 1">
          <img slot="icon" src="../../assets/images/app/icon_user.png">
          <span slot="label">我的</span>
        </tabbar-item>
      </tabbar>
    </view-box>
  </div>
</template>

<script>
  import {
    Swiper,
    SwiperItem,
    Tabbar,
    TabbarItem,
    Card,
    Group,
    Cell,
    XButton,
    Box,
    ViewBox
  } from 'vux'
  import {
    mapActions
  } from 'vuex'
  import FlowUtils from '../utils/flowUtils'
  
  export default {
    name: 'workflow',
    components: {
      Swiper,
      SwiperItem,
      Tabbar,
      TabbarItem,
      Card,
      Group,
      Cell,
      XButton,
      Box,
      ViewBox
    },
    data() {
      return {
        distance: 100,
        waitData: [],
        selectIndex: 0,
        deviceHeight: '400px',
        myFlowData: [],
        monthFlag: 5,
        routeInfo: {
          routeName: "/",
          params: 1,
        }
      }
    },
    created() {
      //获取当前设备的高度
      this.deviceHeight = (this.$parent.dHeight - 55) + 'px';
      // this.deviceHeight = window.screen.height + "px";
    },
    computed: {
  
  
    },
    // watch: {
    //   '$route': 'loadInfo'
  
    // },
    // mounted: function() {
    //   this.loadInfo();
    // },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        document.title = '麦迪科技';
        vm.loadInfo();
  
      })
    },
    methods: {
      ...mapActions({
        // 状态管理的方法
        setFormData: 'SetFormData',
        SetRouteData: 'SetRouteData',
        minusMsg: 'MinusMsg'
      }),
      loadInfo() {
        var self = this;
        //加载待处理的流程
        self.$http.get("QueryFlow/GetWaitFlow").then((res) => {
          self.waitData = res.data;
        });
        self.monthFlag = 4;
        self.loadMore();
  
      },
      // 加载更多我的流程
      loadMore() {
        var self = this;
        var month = self.monthFlag;
  
        if (month - self.myFlowData.length <= 4) {
          //加载待处理的流程
          self.$http.get("QueryFlow/GetMyFlow/" + month).then((res) => {
            self.myFlowData = res.data;
            // if (self.monthFlag == 1) {
            //     self.myFlowData = res.data;
            // } else {
            //     res.data.forEach((item) => {
            //         self.myFlowData.push(item);
            //     })
            // }
            self.monthFlag += 4;
          });
        }
      },
      enterApprove(item) {
        var self = this;
        var http = self.$http;
        // 1:初始化工具方法
        self.flowUtils = new FlowUtils({
          FlowNo: item.InstNo
        }, http);
        // console.log(self.flowUtils.opts);
        // 3：加载流程表单
        self.flowUtils.loadForm((data) => {
          // 3.2 设置表单数据
          console.log(data)
          self.setFormData(data)
          var routeName = self.getRouteName(data.WFNo);
          console.log("进入路由名称:" + routeName);
          // self.minusMsg(); 待审核流程数 减一  审批完成执行
          self.readMsg(item.InstNo);
          // 3.3 设置主表单信息
          var rlist = this.$router.options.routes;
          var isPush = false;
          var tempList = rlist.filter((item) => {
            if (item.name == "approve") {
              return item.children[0].children; //注意formInfo 路由放置第一位
            } else {
              return false;
            }
          }).map(u => {
            return u.children[0].children;
          })
  
          tempList[0].forEach(item => {
  
            if (item.name == routeName) {
              isPush = true;
            }
  
          })
          self.routeInfo.routeName = routeName;
          self.routeInfo.params = 0;
          self.SetRouteData(self.routeInfo)
          if (isPush) {
  
            self.$router.push({
              name: routeName,
              append: true
            });
          } else {
  
            self.$router.push({
              name: 'defaultForm',
              append: true
            });
  
          }
          // console.log(this.$router.options)
          // self.$router.push({ name: routeName, append: true, query: { type: 0 } });
        })
      },
      enterQueryFlow(item) {
        var self = this;
        var http = self.$http;
        // 1:初始化工具方法
        self.flowUtils = new FlowUtils({
          FlowNo: item.InstNo
        }, http);
        // console.log(self.flowUtils.opts);
        // 3：加载流程表单
        self.flowUtils.loadForm((data) => {
          // 3.2 设置表单数据
          self.setFormData(data)
          var routeName = self.getRouteName(data.WFNo);
          // 3.3 设置主表单信息
          var rlist = this.$router.options.routes;
          var isPush = false;
          var tempList = rlist.filter((item) => {
            if (item.name == "approve") {
              return item.children[0].children; //注意formInfo 路由放置第一位
            } else {
              return false;
            }
          }).map(u => {
            return u.children[0].children;
          })
  
          tempList[0].forEach(item => {
  
            if (item.name == routeName) {
              isPush = true;
            }
  
          })
  
          self.routeInfo.routeName = routeName;
          self.routeInfo.params = 1;
          self.SetRouteData(self.routeInfo)
          if (isPush) {
  
            self.$router.push({
              name: routeName,
              append: true
            });
          } else {
  
            self.$router.push({
              name: 'defaultForm',
              append: true
            });
  
          }
          // self.$router.push({ name: routeName, append: true, query: { type: 1 } });
        })
      },
      getRouteName(wfNo) {
        switch (wfNo) {
          // ================Admin============================
          // 日志补填申请流程 已测试
          case "ccc019c9-0797-4288-bfa5-4f2e3ec0ff20":
            return "formLog";
            // ================WFlow============================
            // 研发客户化流程 已测试
          case "a9002c09-6c0e-45b4-83cd-7b17cabe047f":
            return "formDemand";
            // Wiicare需求流程 (不同步骤无法一起满足线上走)
          case "e501b158-8c55-4d38-a4b6-f28caf24c0ea":
            return "formWiicareUr"
            // Wiicare测试流程
          case "4d3a6f38-d18a-4a56-8f15-8ae465ea59f8":
            return "formWiicareTest"
            // mWiicare产品反馈
          case "801e52a6-f44b-46a0-a298-92372fd7b633":
            return "formWiicareProduct"
  
            // ================Pur============================
            //项目采购申请
          case "9e1c842c-c1c3-437c-9508-977b4be33ec1":
            return "formPurApply"
            //非项目物品领用
          case "b8388b62-12d8-410a-a680-e9bca22c93eb":
            return "formItempick"
            // 项目采购变更申请 已测试
          case "25b32006-296b-47f7-99ba-546c7481fbbe":
            return "formPurChange";
            // 项目采赠送申请 已测试    
          case "f3c2da1f-6326-4377-88dc-803f7e459c9d":
            return "formPurGiving"
            //策略采购申请流程
          case "691f3d26-a3a4-4900-983c-907629ad4c0b":
            return "formTacticsPurchase"
  
  
  
            // ================OA============================
            // 办公用品领用流程,还缺类别
          case "69f3df70-f0c4-47b3-86b2-118d9d13db46":
            return "formOfficeApply";
            // 办公大楼维修流程 已测试
          case "143c3609-fe68-445a-93ac-22d014253c8d":
            return "formEngineering"
            // 办公设备维修流程 已测试(维修方式无法选择,pop-picker无法选择造成)
          case "0805ee2c-417d-4f37-85bc-238200c1d641":
            return "formOfficeRepair"
            // 资质原件外借申请 已测试(对接人这一块没有弄)
          case "21f2a5a9-b13c-4952-95d0-c65356eff039":
            return "formQFOriginal"
            // 名片制作申请流程 已测试
          case "2935012d-7434-43b3-a9f1-08ba38c7c8f1":
            return "formBusinessCard";
            // 发票申请流程 已测试
          case "3342668b-e486-4fcb-b182-6ef542409b59":
            return "formInvoiceApply";
            // 财务数据资料申请  已测试
          case "3d296a97-5f7b-4dc9-8173-57ab968fd895":
            return "formFinancialData";
            // 公告发布流程 已测试
          case "506084b7-be0e-4f7c-89ba-a7dd1a5bfec0":
            return "formNotice";
            // 项目授权函申请流程 已测试
          case "53743893-2279-4935-9beb-0a11ffc7548d":
            return "formProAuth";
            // 公章使用申请流程 已测试 (对接人这一块没有弄)
          case "d6124f37-9901-40c6-a77c-fa75ac59f377":
            return "formOfficialSeal";
            //人员外出登记流程
          case "ba31e778-5fdb-4ba3-8833-d9b8f0562c7a":
            return "formOutRecord";
            //会议室预约申请
          case "d82ef916-9127-49dd-9674-66c462ab093f":
            return "formRoomApply";
            //办公系统需求申请
          case "a4c73856-4d09-4787-91a4-a4b3bece31fd":
            return "formOAUR";
            //无合同入场申请
          case "c283c9db-a59d-4136-afc5-31715989cd64":
            return "formNoContractApply";
            //无合同申请评估
          case "bf8cc6ae-c891-4e61-bce6-24bb5d31df22":
            return "formEvaluateApply";
            //固定资产报废
          case "7ec6a72b-7408-4e27-b67e-09a9426da347":
            return "formScrapApply";
            //积分申请流程
          case "5cef2b3d-1728-4b2d-a27b-07f8fa1fdd28":
            return "formIntegralApply";
            //招聘申请
          case "5094a6b5-270c-497d-8a1a-185be0dce7c3":
            return "formRecruitApply";
            //销售合同作废流程
          case "52f90bca-2008-4e65-8ab9-2e4bc9e0ea21":
            return "formCancelContract";
            //信息屏发布申请
          case "6d4ad7d0-1f37-475a-9cf0-4076894272fe":
            return "formPublishApply";
  
  
  
  
            //=================project=====================
            //  项目经理变更流程 已测试
          case "1c41cd5b-ad72-4e7c-9d04-b9893fea39a3":
            return "formPManagerChage"
            //  数据线等用品领用 已测试
          case "3d686a45-d34c-4293-8c5a-7297390f88f5":
            return "formDataLine";
            //  实施晋级申请流程 已测试
          case "59f01cc1-d9f7-488b-9b14-d60c083f576a":
            return "formUserGrading";
            //  项目作废申请流程 已测试
          case "84d5ab6c-23b7-416b-8dfd-6d145b5367e0":
            return "formCancelProject";
            //  项目纸质文档流程  已测试
          case "afdaf802-126c-4dc3-a30c-8db8130607c8":
            return "formPaperExpress";
            //  项目出差流程  已测试
          case "ba96f7fd-0d41-47c7-92dd-e97c7d246a3c":
            return "formProAway";
            //  项目报销 已测试
          case "dca518fb-b4c8-4af6-ae61-167c976c2728":
            return "formProExpense";
            //  加密狗申请流程 已测试
          case "bda44f9d-6e5d-4e96-a729-c1a8d93d23d1":
            return "formEncryptedDog";
            // 临时撤场流程 已测试
          case "0496e77e-0635-4fbc-8fb1-41937fb0e33e":
            return "formTempleave"
            // 重新入场 已测试
          case "0496e77e-0635-4fbc-8fb1-41937fb0e33e":
            return "formTempleave"
            // 项目拆分流程 已测试
          case "d527d08f-cb67-4b57-9342-564e597a12be":
            return "formSplitContract"
            //合同拆分同步NC
          case "7eec89fc-3f9a-4fb4-9773-45db5c43b0b0":
            return "formSyncProToNC"
  
  
            // ================CService===============
            // 客服回访工作流
          case "d409d3ac-ecca-4a93-9ae5-1b8c1e0b0300":
            return "formBackvisit";
            // 客服巡检
          case "a33ca697-c180-47c8-ab87-58900699b790":
            return "formInspback"
            // 售后医院客服工程师申请变更流程 已测试
          case "800a77d8-9d00-4813-a643-2e539ff19dcb":
            return "formCSUserChange"
            // 售后医院服务总结报告申请 已测试
          case "bcda9624-0c5c-4aaa-8172-fda2aafe46c8":
            return "formCSSummary"
            // 售后纸质文档回寄流程  已测试
          case "eaa02d6b-4e62-43d8-bb8f-75811c10684f":
            return "formCSBackdoc"
            // 售后客户化流程
          case "1d4d447a-21d0-4488-a27d-ac420b75d58b":
            return "formCSDemand"
  
  
          default:
            return "defaultForm";
        }
      }, // 阅读消息
      readMsg(instNo) {
        var that = this;
        that.$http.get('Message/ReadMsg/' + instNo).then((res) => {
  
        });
      }
    },
  }
</script>

<style scoped>
  .flow_info {
    margin-top: 5px;
    padding: 5px 0px;
    display: flex;
    font-size: 14px;
    color: gray;
    justify-content: space-between;
    font-weight: 200;
  }
  
  .card_bd {
    padding: 10px 15px;
  }
  
  .swiperItem {
    height: 100%;
    overflow: auto;
  }
</style>