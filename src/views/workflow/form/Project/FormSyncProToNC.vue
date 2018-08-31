<template>
  <div>
    <divider>合同拆分同步NC-表单明细</divider>
    <group>
      <cell title="医院名称" :inline-desc="postJSON.HospName"></cell>
      <cell title="合同名称">{{postJSON.ProjectName}}</cell>
      <cell title="合同编号">{{postJSON.ContractNumber}}</cell>

      <cell title="签约公司">{{postJSON.ContractCompany}}</cell>
      <cell title="合同金额">{{postJSON.Amounts}}</cell>
      <cell title="销售人员"> {{postJSON.Saller}}</cell>

      <cell title="签约时间"> {{postJSON.ContractDate | substr(10)}}</cell>
      <cell title="合同类型">{{postJSON.ContractTypeName}}</cell>
      <cell title="合同属性">{{postJSON.ContractSaleType}}</cell>
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
  
  // 合同拆分同步NC
  export default {
    name: "formSyncProToNC",
    data() {
      return {
        postJSON: {
          HospName: "",
          ProjectName: "",
          ContractNumber: "",
          ContractCompany: "",
          Amounts: "",
          Saller: "",
          ContractDate: "",
          ContractTypeName: "",
          ContractSaleType: "",
          Memo: "",
        },
      }
    },
    computed: {
      ...mapGetters({
        formJSON: 'getFormJSON'
      })
    },
  
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
          });
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

<style>
  ol>li {
    padding: 4px;
    font-size: 15px;
  }
</style>