<template>
  <div>
    <divider>办公系统需求申请-表单明细</divider>
    <group>
      <cell title="申请人">{{postJSON.ApplyUName}}</cell>
      <cell title="申请部门">{{postJSON.DeptName }}</cell>
      <cell title="隶属系统">{{postJSON.SysName }}</cell>
      <cell title="问题分类">{{postJSON.UrCategory }}</cell>
      <cell title="期望时间">{{postJSON.ExceptDate | substr(10)}}</cell>
      <cell title="需求背景" :inline-desc="postJSON.UrBackground"></cell>
      <cell title="需求描述">
        <div slot="after-title" style="margin-top:10px;" v-html='postJSON.UrDesc'> {{ postJSON.UrDesc }}
        </div>
      </cell>
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
  
  // 办公系统需求申请
  export default {
    name: "FormOAUR",
    data() {
      return {
        postJSON: {
          ApplyUName: "",
          DeptName: "",
          SysName: "",
          UrCategory: "",
          ExceptDate: "",
          UrBackground: "",
          UrDesc: ""
        },
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
          console.log(postData);
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