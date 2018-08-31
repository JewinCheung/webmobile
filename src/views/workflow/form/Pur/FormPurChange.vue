<template>
  <div>
    <divider>采购变更-表单</divider>
    <group>
      <cell title="申请部门">{{postJSON.DeptName}}</cell>
      <cell title="医院名称">{{postJSON.HospName}}</cell>
      <cell title="项目名称">{{postJSON.SubProjecName}}</cell>
      <cell title="合同编号">{{postJSON.ContractNumber}}</cell>
      <cell title="销售">{{postJSON.Saller}}</cell>
      <cell title="变更原因" :inline-desc="postJSON.Memo"></cell>
    </group>
    <divider>原有采购明细</divider>
    <!--物品申请-->
    <group v-if="hisSubItems.length>0" v-for="item in hisSubItems":key='item.MaterialName'>
      <cell title="名称">{{item.MaterialName}}</cell>
      <cell title="数量">{{item.SaleNums+' '+item.Unit}}</cell>
      <cell title="销售单价">{{item.SalePrice}}</cell>
      <cell title="预估价">{{item.PlanPrice}}</cell>
    </group>
    <divider>新采购明细</divider>
    <!--物品申请-->
    <group v-if="newSubItems.length>0" v-for="item in newSubItems":key='item.MaterialName'>
      <cell title="名称">{{item.MaterialName}}</cell>
      <cell title="数量">{{item.SaleNums+' '+item.Unit}}</cell>
      <cell title="销售单价">{{item.SalePrice}}</cell>
      <cell title="预估价">{{item.PlanPrice}}</cell>
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
  
  // 资质原件申请
  export default {
    name: "formPurChange",
    data() {
      return {
        postJSON: {
          DeptName: "",
          HospName: "",
          SubProjecName: "",
          ContractNumber: "",
          Saller: "",
          Memo: ""
        },
        //申请明细
        hisSubItems: [],
        newSubItems: []
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
          });
  
          var newData = postData.DetailList;
          var oldData = postData.HistDetailList;
          if (oldData && oldData.length > 0) {
            var temp = JSON.parse(newData);
            that.hisSubItems = temp.map((item) => {
              return {
                MaterialName: item.MaterialName,
                SaleNums: item.SaleNums,
                Unit: item.Unit,
                SalePrice: item.SalePrice,
                PlanPrice: item.PlanPrice
              }
            });
          }
  
          if (newData && newData.length > 0) {
            var temp = JSON.parse(newData);
            that.newSubItems = temp.map((item) => {
              return {
                MaterialName: item.MaterialName,
                SaleNums: item.SaleNums,
                Unit: item.Unit,
                SalePrice: item.SalePrice,
                PlanPrice: item.PlanPrice
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