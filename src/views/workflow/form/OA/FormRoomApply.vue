<template>
  <div>
    <divider>会议室预约申请-表单明细</divider>
    <group>
      <cell title="申请人">{{postJSON.ApplyUName}}</cell>
      <cell title="申请部门">{{postJSON.DeptName}}</cell>
      <cell title="联系方式">{{postJSON.Phone}}</cell>
      <cell title="会议类别">{{postJSON.ApplyType}}</cell>
      <cell title="会议室">{{postJSON.RoomNo}}</cell>
      <cell title="会议日期">{{postJSON.UseDate| substr(10)}}</cell>
      <cell title="开始时间">{{postJSON.SDate}}</cell>
      <cell title="结束时间">{{postJSON.EDate}}</cell>
      <cell title="参与人数">{{postJSON.UserNum}}</cell>
  
      <cell title="会议说明" :inline-desc="postJSON.RoomMemo"></cell>
    </group>
    <divider v-if="subItems.length>0">物料信息</divider>
    <!--物品申请-->
    <div v-if="subItems.length>0">
      <group v-for="item in subItems" :key='item.SerialNo'>
        <cell title="物料名称">{{item.ItemName}}</cell>
        <cell title="物料规格">{{item.ItemSpecs}}</cell>
        <cell title="申请数量">{{item.ItemNum+' '+item.ItemUnit}}</cell>
        <cell title="备注" :inline-desc="item.ItemMemo"></cell>
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
  
  // 会议室预约申请
  export default {
    name: "FormRoomApply",
    data() {
      return {
        postJSON: {
          ApplyUName: "",
          DeptName: "",
          Phone: "",
          ApplyType: "",
          RoomNo: "",
          UseDate: "",
          SDate: "",
          EDate: "",
          UserNum: "",
          RoomMemo: "",
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
  
          var newData = postData.ItemsJSON;
          if (newData && newData.length > 0) {
            var temp = JSON.parse(newData);
            that.subItems = temp.map((item) => {
              return {
                SerialNo: item.SerialNo,
                ItemName: item.ItemName,
                ItemSpecs: item.ItemSpecs,
                ItemNum: item.ItemNum,
                ItemUnit: item.ItemUnit,
                Memo: item.ItemMemo
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