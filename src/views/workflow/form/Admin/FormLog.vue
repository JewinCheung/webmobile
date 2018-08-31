<template>
  <div>
    <divider>日志补填-表单明细</divider>
    <group title="日志补填表单详情">
      <cell title="补填开始时间">{{postJSON.StartTime | substr(10)}}</cell>
      <cell title="补填开始时间">{{postJSON.EndTime | substr(10)}}</cell>
      <cell title="补填原因" :inline-desc="postJSON.Memo"></cell>
      <cell title="流程结束时间">{{postJSON.FlowEndDate | substr(10)}}</cell>
      <cell title="补填失效时间">{{postJSON.InvalidDate | substr(10)}}</cell>
    </group>
  </div>
</template>

<script lang="babel">
  import {
    Group,
    Cell,
    Divider
  } from 'vux'
  import {
    mapGetters
  } from 'vuex'
  // 日志补填流程
  export default {
    name: "formLog",
    data() {
      return {
        "postJSON": {
          StartTime: "",
          EndTime: "",
          Memo: "",
          FlowEndDate: "",
          InvalidDate: ""
        }
      }
    },
    computed: {
      ...mapGetters({
        formJSON: 'getFormJSON'
      })
    },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.loadInfo();
      })
    },
    methods: {
      loadInfo() {
        if (this.formJSON.FlowJson) {
          var temp = JSON.parse(this.formJSON.FlowJson);
          // console.log(temp)
          var that = this;
          Object.keys(temp).forEach(function(key) {
            that.postJSON[key] = temp[key] || "";
          })
        } else {
          this.$router.push("/workflow")
        }
      }
    },
    components: {
      Cell,
      Divider,
      Group
    }
  
  }
</script>