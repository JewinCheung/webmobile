<template>
  <div>
    <divider>信息屏发布申请-表单明细</divider>
    <group>
      <cell title="申请人">{{postJSON.ApplyUser}}</cell>
      <cell title="申请部门">{{postJSON.ApplyDept}}</cell>
      <cell title="发布内容" :inline-desc="postJSON.PubContent"></cell>
      <cell title="发布位置">{{postJSON.PubAddr}}</cell>
      <cell title="发布时间">{{postJSON.PubSDate}}</cell>
      <cell title="结束时间">{{postJSON.PubEDate}}</cell>
      <cell title="其他说明" :inline-desc="postJSON.OtherDesc"></cell>
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

  // 信息屏发布申请
  export default {
    name: "FormPublishApply",
    data() {
      return {
        postJSON: {
          ApplyUser: "",
          ApplyDept: "",
          PubContent: "",
          PubAddr: "",
          PubSDate: "",
          PubEDate: "",
          OtherDesc: ""
        }
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
    beforeRouteEnter: function (to, from, next) {
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
          Object.keys(tempJson).forEach(function (key) {
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
