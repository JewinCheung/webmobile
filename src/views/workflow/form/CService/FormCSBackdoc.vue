<template>
  <div>
    <divider>纸质文档-表单明细</divider>
    <group>
      <cell title="寄送方式">{{postJSON.AcceptWay}}</cell>
      <cell title="寄件人">{{postJSON.UserName}}</cell>
      <cell title="收件人">{{postJSON.AcceptUser}}</cell>
      <cell title="联系电话">{{postJSON.AcceptPhoneNumber}}</cell>
      <cell title="备注" :inline-desc="postJSON.Memo"></cell>
    </group>
    <divider>报销明细</divider>
    <!--物品申请-->
    <div v-if="subItems.length>0">
      <group v-for="item in subItems" :key='item.HospName'>
        <cell title="医院名称">{{item.HospName}}</cell>
        <cell title="报告月份">{{item.DocumentMonth | substr(10)}}</cell>
        <cell title="巡检报告">{{item.InspectionDoc + '份'}}</cell>
        <cell title="服务报告">{{item.ServiceDoc + '份'}}</cell>
        <cell title="服务总结">{{item.ServiceConclusion + '份'}}</cell>
        <cell title="内验报告">{{item.InsideAcceptDoc + '份'}}</cell>
        <cell title="需求报告">{{item.DemandDoc + '份'}}</cell>
        <cell title="其他">{{item.OtherDoc + '份'}}</cell>
        <cell title="合计:">
          <span style="color:red;">{{item.CountDoc+'份'}}</span>
        </cell>
      </group>
    </div>
  </div>
</template>

<script lang="babel">
  import {
    Divider,
    Group,
    Cell
  } from 'vux'
  import {
    mapGetters
  } from 'vuex'
  
  // 售后纸质文档回寄流程
  export default {
    name: "formCSBackdoc",
    data() {
      return {
        postJSON: {
          AcceptWay: "",
          UserName: "",
          AcceptUser: "",
          AcceptPhoneNumber: "",
          Memo: ""
        },
        //申请明细
        subItems: []
      }
    },
    // computed: {
    //   ...mapGetters({
    //     formJSON: 'getFormJSON'
    //   })
    // },
    // watch: {
    //   '$route': 'loadInfo'
    // },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.loadInfo();
      })
    },
    mounted: function() {
      this.loadInfo();
    },
    methods: {
      loadInfo() {
        if (this.formJSON.FlowJson) {
          // 设置主表
          var postData = JSON.parse(this.formJSON.FlowJson);
          var tempJson = this.postJSON;
          var that = this;
  
          Object.keys(tempJson).forEach(function(key) {
            that.postJSON[key] = postData[key] || "";
          });
          var newData = postData.DetailJsonList;
          if (newData && newData.length > 0) {
            var jsonData = JSON.parse(newData);
            that.subItems = jsonData;
          }
  
        } else {
          this.$router.push("/workflow")
        }
  
      },
    },
    components: {
      Cell,
      Group,
      Divider
    }
  }
</script>