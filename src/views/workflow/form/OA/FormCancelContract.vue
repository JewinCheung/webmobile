<template>
  <div>
    <divider>销售合同作废申请-表单明细</divider>
    <group>
      <cell title="申请人">{{postJSON.ApplyUser}}</cell>
      <cell title="所在部门">{{postJSON.ApplyDept}}</cell>
      <cell title="合同编号">{{postJSON.ContractNumber}}</cell>
      <cell title="合同类型">{{postJSON.ContractType}}</cell>
      <cell title="医院名称">{{postJSON.HospName}}</cell>
      <cell title="项目名称">{{postJSON.ProjectName}}</cell>
      <cell title="合同金额">{{postJSON.ContractMoney}}</cell>
      <cell title="签约日期">{{postJSON.ContractDate | substr(10)}}</cell>
      <cell title="销售人员">{{postJSON.Saller}}</cell>
      <cell title="分公司负责人">{{postJSON.CompLeader}}</cell>
      <cell title="申请日期">{{postJSON.ApplyDate}}</cell>
      <cell title="甲方">{{postJSON.First}}</cell>
      <cell title="乙方">{{postJSON.Two}}</cell>
      <cell title="作废原因" :inline-desc="postJSON.CancelReason"></cell>
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
  // 销售合同作废申请
  export default {
    name: "formCancelContract",
    data() {
      return {
        postJSON: {
          ApplyUser: "",
          ApplyDept: "",
          ContractNumber: "",
          ContractType: "",
          HospName: "",
          ProjectName: "",
          ContractMoney: "",
          ContractDate: "",
          Saller: "",
          CompLeader: "",
          ApplyDate:"",
          First: "",
          Two: "",
          CancelReason: ""
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
    beforeRouteEnter: function (to, from, next) {
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
          Object.keys(tempJson).forEach(function (key) {
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
