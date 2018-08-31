<template>
  <div>
    <divider>策略采购申请流程-表单明细</divider>
    <group>
      <cell title="申请部门">{{postJSON.ApplyDeptName}}</cell>
      <cell title="申请原因" :inline-desc="postJSON.Reason"></cell>
      <cell title="备注" :inline-desc="postJSON.PurMemo"></cell>
    </group>
    <divider v-if="subItems.length>0">物料信息</divider>
    <!--物品申请-->
    <div v-if="subItems.length>0">
      <group v-for="item in subItems" :key='item.SerialNo'>
        <cell title="物料类型">{{item.ItemTypeName}}</cell>
        <cell title="物料名称">{{item.ItemName}}</cell>
        <cell title="申请数量">{{item.ApplyNum+' '+item.Unit}}</cell>
        <cell title="备注" :inline-desc="item.Memo"></cell>
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
  
  // 策略采购申请流程
  export default {
    name: "FormTacticsPurchase",
    data() {
      return {
        postJSON: {
          ApplyDeptName: "",
          Reason: "",
          PurMemo: "",
        },
        //申请明细
        subItems: []
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
  
          var newData = postData.DetailJsonList;
          if (newData && newData.length > 0) {
            var temp = JSON.parse(newData);
            that.subItems = temp.map((item) => {
              return {
                SerialNo: item.SerialNo,
                ItemTypeName: item.ItemTypeName,
                ItemName: item.ItemName,
                ApplyNum: item.ApplyNum,
                Unit: item.Unit,
                Memo: item.Memo
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