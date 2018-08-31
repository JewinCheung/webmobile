<template>
  <div>
    <divider>固定资产报废-表单明细</divider>
    <group>
  
      <cell title="申请人">{{postJSON.ApplyUser}}</cell>
      <cell title="申请部门">{{postJSON.ApplyDept}}</cell>
      <cell title="资产名称">{{postJSON.AssetName}}</cell>
      <cell title="资产编号">{{postJSON.AssetNo}}</cell>
      <cell title="规格说明":inline-desc="postJSON.ItemSpecs"></cell>
      <cell title="报废原因":inline-desc="postJSON.ScrapReason"></cell>

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
  
  // 固定资产报废流程
  export default {
    name: "formScrapApply",
    data() {
      return {
        postJSON: {
          ApplyUser: "",
          ApplyDept: "",
          AssetName: "",
          AssetNo: "",
          ItemSpecs: "",
          ScrapReason: ""

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