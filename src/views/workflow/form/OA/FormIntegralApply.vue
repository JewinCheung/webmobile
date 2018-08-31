<template>
  <div>
    <divider>积分申请流程-表单明细</divider>
    <group>
  
      <cell title="申请人">{{postJSON.ApplyUser}}</cell>
      <cell title="申请部门">{{postJSON.ApplyDept}}</cell>
      <cell title="备注" :inline-desc="postJSON.ApplyMemo"></cell>
  
    </group>
    <divider>积分明细</divider>
    <!--积分明细-->
    <div v-if="subItems.length>0">
      <group v-for="item in subItems" :key='item.SerialNo'>
        <cell title="类别">{{item.TypeName}}</cell>
        <cell title="部门/人员">{{item.DOrUName}}</cell>
        <cell title="积分">{{item.Score}}</cell>
        <cell title="获取日期">{{item.ActDate}}</cell>
        <cell title="备注" :inline-desc="item.ScoreDesc"></cell>
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
  
  // 积分申请流程
  export default {
    name: "formIntegralApply",
    data() {
      return {
        postJSON: {
          ApplyUser: "",
          ApplyDept: "",
          ApplyMemo: ""
        },
        //产品明细
        subItems: [],
        //硬件明细
        subHardItems: []
      }
    },
    computed: {
      ...mapGetters({
        formJSON: 'getFormJSON'
      })
    },
    // watch: {
    //     '$route': 'loadInfo'
    // },
    // mounted: function() {
    //     this.loadInfo();
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
          });
  
          var newData = postData.StrIntegrals;
          if (newData && newData.length > 0) {
            var temp = JSON.parse(newData);
            that.subItems = temp.map((item) => {

              var DOrUName= item.TypeName=="人员"?item.UserName:item.DeptName
              return {
                SerialNo: item.SerialNo,
                TypeName: item.TypeName,
                DOrUName: DOrUName,
                Score: item.Score,
                ActDate: item.ActDate,
                ScoreDesc: item.ScoreDesc
              }
            });
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

<style>
  ol>li {
    padding: 4px;
    font-size: 15px;
  }
</style>