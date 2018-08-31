<template>
  <div>
    <divider>无合同申请评估-表单明细</divider>
    <group>
      <cell title="历史申请" :inline-desc="postJSON.InstName"></cell>
      <cell title="医院名称" :inline-desc="postJSON.HospName"></cell>
      <cell title="合同名称">{{postJSON.ContractNumber}}</cell>
      <cell title="项目名称">{{postJSON.ProjectName}}</cell>
      <cell title="期望入场日期">{{postJSON.ApplyDate | substr(10)}}</cell>
      <cell title="实际入场日期"> {{postJSON.ActEnterDate | substr(10)}}</cell>
      <cell title="预计合同额">{{postJSON.ExpectMoney}}</cell>
      <cell title="实际合同额">{{postJSON.ActualMoney}}</cell>
      <cell title="承诺签回日期"> {{postJSON.PromiseDate | substr(10)}}</cell>
      <cell title="实际签回日期"> {{postJSON.ActBackDate | substr(10)}}</cell>
      <cell title="时间差">{{postJSON.TimeDiff}}</cell>
      <cell title="入场前费用">{{postJSON.WithoutMoney}}</cell>
      <cell title="财务核准金额">{{postJSON.ApproveMoney}}</cell>
      <cell title="信息反馈" :inline-desc="postJSON.InfoFeedback"></cell>
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
  
  // 无合同申请评估
  export default {
    name: "formEvaluateApply",
    data() {
      return {
        postJSON: {
          InstName: "",
          HospName: "",
          ContractNumber: "",
          ProjectName: "",
          ApplyDate: "",
          ActEnterDate: "",
          ExpectMoney: "",
          ActualMoney: "",
          PromiseDate: "",
          ActBackDate: "",
          TimeDiff: "",
          WithoutMoney: "",
          ApproveMoney: "",
          InfoFeedback: ""
  
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