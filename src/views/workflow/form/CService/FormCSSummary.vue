<template>
  <div>
    <divider>服务总结-表单明细</divider>
    <group>
      <cell title="医院名称">{{postJSON.HospName}}</cell>
      <cell title="产品名称">{{postJSON.ProductName}}</cell>
      <cell title="报告格式">{{postJSON.FormatNumber}}</cell>
      <cell title="电子邮箱">{{postJSON.ToMail}}</cell>
      <cell title="报告开始时间">{{postJSON.ServiceStrTime}}</cell>
      <cell title="报告结束时间">{{postJSON.ServiceEndTime}}</cell>
      <cell title="收件人">{{postJSON.MailPeopleName}}</cell>
      <cell title="联系方式">{{postJSON.PhoneNo}}</cell>
      <cell title="公章选择">{{postJSON.OfficialSeal==1?'是':'否'}}</cell>
      <cell title="报告数量">{{postJSON.Number}}</cell>
      <cell title="邮寄地址" :inline-desc="postJSON.Address"></cell>
      <cell title="备注" :inline-desc="postJSON.Remark"></cell>
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
  // 售后医院服务总结报告申请
  export default {
    name: "formCSSummary",
    data() {
      return {
        postJSON: {
          HospName: "",
          FormatNumber: "",
          ProductName: "",
          ToMail: "",
          MailPeopleName: "",
          ServiceStrTime: "",
          ServiceEndTime: "",
          MailPeopleName: "",
          PhoneNo: "",
          OfficialSeal: "",
          Number: "",
          Address: "",
          Remark: ""
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
          // 设置主表
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