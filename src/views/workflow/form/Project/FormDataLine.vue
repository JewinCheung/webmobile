<template>
  <div>
    <divider>数据线-表单明细</divider>
    <group>
      <cell title="医院名称">{{postJSON.HospName}}</cell>
      <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
      <cell title="合同编号">{{postJSON.ContractNumber}}</cell>
      <cell title="申请部门">{{postJSON.DeptName}}</cell>
      <cell title="收件人">{{postJSON.AcceptUser}}</cell>
      <cell title="联系电话">{{postJSON.PhoneNumber}}</cell>
      <cell title="领取方式">{{postJSON.AcceptWay}}</cell>
      <cell title="详细地址" :inline-desc="postJSON.DetailAddress"></cell>
    </group>
    <divider>赠送明细</divider>
    <!--物品申请-->
    <group v-if="subItems.length>0" v-for="item in subItems":key='item.LineName'>
      <cell title="名称">{{item.LineName}}</cell>
      <cell title="型号">{{item.Model}}</cell>
      <cell title="接口">{{item.Interface}}</cell>
      <cell title="数量">{{item.Nums+' '+item.Unit}}</cell>
      <cell title="期望到货日">{{item.ReceiveDate}}</cell>
      <cell title="实发数量">{{item.ActualNums}}</cell>
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
    name: "formDataLine",
    data() {
      return {
        postJSON: {
          HospName: "",
          ProjectName: "",
          ContractNumber: "",
          DeptName: "",
          AcceptUser: "",
          PhoneNumber: "",
          AcceptWay: "",
          DetailAddress: ""
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
  
          var newData = postData.DetailJsonList;
          if (newData && newData.length > 0) {
            var temp = newData.split('|');
            that.subItems = temp.map((item) => {
              var temData = item.split('&');
              return {
                LineName: temData[1],
                Model: temData[2],
                Interface: temData[3],
                Nums: temData[4],
                Unit: temData[5],
                ReceiveDate: temData[7],
                ActualNums: temData[9]
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