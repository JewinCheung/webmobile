<template>
  <div>
    <divider>工程师申请变更-表单明细</divider>
    <group>
      <cell title="医院名称">{{postJSON.HospName}}</cell>
      <cell title="项目名称" :inline-desc="postJSON.ProjecName"></cell>
      <cell title="产品名称">{{postJSON.ProductName}}</cell>
      <cell title="是否售后医院">{{postJSON.HospInsideAccept==1?'是':'否'}}</cell>
      <cell title="是否内验项目">{{postJSON.ProInsideAccept==1?'是':'否'}}</cell>
      <cell title="旧客服经理">{{postJSON.OldUserName}}</cell>
      <cell title="新客服经理">{{postJSON.NewUserName}}</cell>
      <cell title="维保结束日期">{{postJSON.MaintainEndDate | substr(10)}}</cell>
      <cell title="备注" :inline-desc="postJSON.Memo"></cell>
    </group>
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
  // 售后医院客服工程师申请变更流程
  export default {
    name: "formCSUserChange",
    data() {
      return {
        postJSON: {
          HospName: "",
          ProjecName: "",
          ProductName: "",
          HospInsideAccept: "",
          ProInsideAccept: "",
          OldUserName: "",
          NewUserName: "",
          MaintainEndDate: "",
          Memo: ""
        }
      }
    },
    computed: {
      ...mapGetters({
        formJSON: 'getFormJSON'
      })
    },
    // watch: {
    //   '$route': 'loadInfo'
    // },
    // mounted: function() {
    //   this.loadInfo();
    // },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.loadInfo();
      })
    },
    methods: {
      loadInfo() {
        if (this.formJSON.FlowJson) {
          var postData = JSON.parse(this.formJSON.FlowJson);
          var tempJson = this.postJSON;
          var that = this;
          Object.keys(tempJson).forEach(function(key) {
            that.postJSON[key] = postData[key] || "";
          })
  
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