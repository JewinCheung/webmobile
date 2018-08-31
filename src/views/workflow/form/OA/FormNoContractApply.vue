<template>
  <div>
    <divider>无合同入场申请-表单明细</divider>
    <group>
      <cell title="项目名称" :inline-desc="postJSON.CRMPName"></cell>
      <cell title="医院名称" :inline-desc="postJSON.HospName"></cell>
      <cell title="合同类型">{{postJSON.ContractType}}</cell>
      <cell title="经销商">{{postJSON.AgentName}}</cell>
      <cell title="期望入场日">{{postJSON.ExpectEnterDate | substr(10)}}</cell>
      <cell title="承诺合同签回"> {{postJSON.PromiseDate | substr(10)}}</cell>
      <cell title="预计合同额">{{postJSON.ExpectMoney}}</cell>
      <cell title="预计付款方式">{{postJSON.EstimatePay}}</cell>
      <cell title="项目背景" :inline-desc="postJSON.ProBackground"></cell>
      <cell title="功能模块" :inline-desc="postJSON.Modules"></cell>
      <cell title="责任承担">
        <ol>
          <li>承诺期限内合同签回公司的,前期费用转为实施成本,自收到合同之日起开始计算合同业绩</li>
          <li>合同签回公司超出承诺期小于等于3个月,前期费用转为实施成本，自收到合同之日起,按合同金额的50%计算业绩</li>
          <li>合同签回公司超出承诺期大于3个月,前期费用由销售承担,不计算业绩,且按10000元/个 项目,进行处罚</li>
        </ol>
      </cell>
    </group>
    <divider v-if="subItems.length>0">产品信息</divider>
    <!--物品申请-->
    <div v-if="subItems.length>0">
      <group v-for="item in subItems" :key='item.ID'>
        <cell title="项目名称">{{item.ProjectName}}</cell>
        <cell title="产品线">{{item.LineName}}</cell>
        <cell title="产品版本">{{item.Version}}</cell>
        <cell title="安装数量">{{item.InstallNum+' '+item.ProUnit}}</cell>
        <cell title="预计金额">{{item.EstimateMoney}}</cell>
      </group>
    </div>
    <divider v-if="subHardItems.length>0">硬件信息</divider>
    <!--物品申请-->
    <div v-if="subHardItems.length>0">
      <group v-for="item in subHardItems" :key='item.ID'>
        <cell title="产品名称">{{item.ItemName}}</cell>
        <cell title="型号">{{item.ItemModel}}</cell>
        <cell title="规格">{{item.ItemSpecs}}</cell>
        <cell title="质保">{{item.Warranty}}</cell>
        <cell title="数量">{{item.ItemNum+' '+item.ItemUnit}}</cell>
        <cell title="预估销售价">{{item.EstimatePrice}}</cell>
        <cell title="预估销售总价">{{item.EstimateAllPrice}}</cell>
        <cell title="备注">{{item.AdvanceMemo}}</cell>
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
  
  // 无合同入场申请
  export default {
    name: "formNoContractApply",
    data() {
      return {
        postJSON: {
          CRMPName: "",
          HospName: "",
          ContractType: "",
          AgentName: "",
          ExpectEnterDate: "",
          PromiseDate: "",
          ExpectMoney: "",
          EstimatePay: "",
          ProBackground: "",
          Modules: "",
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
  
          var newData = postData.StrLineList;
          if (newData && newData.length > 0) {
            var temp = JSON.parse(newData);
            that.subItems = temp.map((item) => {
              return {
                ID: item.ID,
                ProjectName: item.ProjectName,
                LineName: item.LineName,
                Version: item.Version,
                InstallNum: item.InstallNum,
                ProUnit: item.ProUnit,
                EstimateMoney: item.EstimateMoney
              }
            });
          }
  
          var newHardData = postData.StrHardList;
  
          if (newHardData && newHardData.length > 0) {
            var temp = JSON.parse(newHardData);
            that.subHardItems = temp.map((item) => {
              return {
                ID: item.SerialNo,
                ItemName: item.ItemName,
                ItemModel: item.ItemModel,
                ItemSpecs: item.ItemSpecs,
                Warranty: item.Warranty,
                ItemUnit: item.ItemUnit,
                ItemNum: item.ItemNum,
                EstimatePrice: item.EstimatePrice,
                EstimateAllPrice: item.EstimateAllPrice,
                AdvanceMemo: item.AdvanceMemo
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