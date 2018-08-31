<template>
  <div class="formOfficeRepair">
    <divider>办公设备维修流程-表单明细</divider>
    <group>
      <cell title="设备主类">{{postJSON.ItemTypeName}}</cell>
      <cell title="设备子类">{{postJSON.ItemNoName}}</cell>
      <cell title="申请部门">{{postJSON.DeptName}}</cell>
      <selector v-if="stepName == '网络工程师审批'" :value.sync="postJSON.RepairTypeName" direction="rtl" title="维修方式" :options="plainList" @on-change="subClick"></selector>
      <cell title="设备名称" :inline-desc="postJSON.ItemName"></cell>
      <cell title="故障描述" :inline-desc="postJSON.Reason"></cell>
    </group>
  
  </div>
</template>

<script lang="babel">
  import {
    Group,
    Cell,
    Popup,
    Selector,
    Divider
  } from 'vux'
  
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  
  // 办公设备维修流程
  export default {
    name: "formOfficeRepair",
    data() {
      return {
        postJSON: {
          ItemTypeName: "",
          ItemNoName: "",
          DeptName: "",
          ItemName: "",
          RepairTypeName: "",
          Reason: ""
        },
        stepName: "",
        showPop: false,
        typeData: {
          直接确认: "直接确认",
          仓库确认: "仓库确认"
        },
        plainList: ["直接确认", "仓库确认"]
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
      ...mapActions({
        // 状态管理的方法
        setFormData: 'SetFormData'
      }),
      subClick(key) {
        this.postJSON.RepairTypeName = key;
        var tempForm = this.formJSON;
  
        var postData = JSON.parse(tempForm.FlowJson);
        postData["RepairType"] = key;
  
        tempForm.FlowJson = JSON.stringify(postData);
  
        console.log(tempForm);
        this.setFormData(tempForm);
      },
      loadInfo() {
        if (this.formJSON.FlowJson) {
          // 设置主表
          var postData = JSON.parse(this.formJSON.FlowJson);
          if (this.formJSON["StepName"]) {
            this.stepName = this.formJSON["StepName"];
            console.log("当前步骤是:" + this.stepName);
          }
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
      Selector,
      Divider
    }
  }
</script>


<style>
  .formOfficeRepair .weui_select {
    padding-right: 15px;
  }
  
  .formOfficeRepair .weui_label {
    color: red;
  }
</style>