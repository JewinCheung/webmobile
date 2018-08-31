<template>
  <div>
    <divider>名片制作申请-表单明细</divider>
    <group>
      <cell title="申请部门">{{postJSON.DeptName}}</cell>
      <cell title="紧急程度">{{postJSON.EmergencyType}}</cell>
      <cell title="申请数量">{{postJSON.Card_Number}}</cell>
      <cell title="岗位">{{postJSON.Card_Post}}</cell>
      <cell title="英文名">{{postJSON.MIPIAN}}</cell>
      <cell title="公司电话">{{postJSON.Card_Phone_Area+'-'+postJSON.Card_Phone_Cont+'-'+postJSON.Card_Phone_Extension}}</cell>
      <cell title="移动电话">{{postJSON.Card_Mobile}}</cell>
      <cell title="邮箱">{{postJSON.Card_Email}}</cell>
      <cell title="通讯地址" :inline-desc="postJSON.Card_Address"></cell>
      <cell title="备注信息" :inline-desc="postJSON.Memo"></cell>
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
  // 名片制作申请流程
  export default {
    name: "formBusinessCard",
    data() {
      return {
        postJSON: {
          DeptName: "",
          EmergencyType: "",
          Card_Number: "",
          Card_Post: "",
          MIPIAN: "",
          Card_Phone_Area: "",
          Card_Phone_Cont: "",
          Card_Phone_Extension: "",
          Card_Mobile: "",
          Card_Email: "",
          Card_Address: "",
          Memo: ""
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