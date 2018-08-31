<template>
  <div>
    <divider>mWiicare产品反馈-表单明细</divider>
    <group>
      <cell title="产品模块">{{postJSON.UrModel}}</cell>
  
      <cell title="建议">
        <div slot="after-title" style="margin-top:10px;" v-html='postJSON.UrDesc'> {{ postJSON.UrDesc }}
        </div>
      </cell>
      <cell title="反馈">
        <div slot="after-title" style="margin-top:10px;" v-html='postJSON.Feedback'> {{ postJSON.Feedback }}
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
  
  // mWiicare产品反馈
  export default {
    name: "formWiicareProduct",
    data() {
      return {
        postJSON: {
          UrModel: "",
          UrDesc: "",
          Feedback: ""
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