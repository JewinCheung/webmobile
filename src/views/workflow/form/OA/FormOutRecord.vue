<template>
  <div>
    <divider>员工外出申请-表单明细</divider>
    <group>
      <cell title="外出地">{{postJSON.OutAddr}}</cell>
      <cell title="外出原因" :inline-desc="postJSON.OutReason"></cell>
      <cell title="外出时间">{{postJSON.SDate}}</cell>
      <cell title="返回时间">{{postJSON.EDate}}</cell>
      <cell title="拜访人员">{{postJSON.VisitUser}}</cell>
      <cell title="人员电话">{{postJSON.VisitPhone}}</cell>
      <cell title="备注" :inline-desc="postJSON.Remark"></cell>
  
    </group>
    <divider>外出人员</divider>
    <group v-if="subItems.length>0" v-for="item in subItems":key='item.UserName'>
      <cell title="姓名">{{item.UserName}}</cell>
      <cell title="部门">{{item.DeptName}}</cell>
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
  
  // 员工外出申请
  export default {
    name: "FormOutRecord",
    data() {
      return {
        postJSON: {
          OutAddr: "",
          OutReason: "",
          SDate: "",
          EDate: "",
          VisitUser: "",
          VisitPhone: "",
          Remark: ""
        },
        //人员明细
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
  
          var newData = postData.OutUsers;
          if (newData && newData.length > 0) {
            var UserInfo = JSON.parse(newData);
            that.subItems = UserInfo.map((item) => {
              return {
                UserName: item.UserName,
                DeptName: item.DeptName,
  
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