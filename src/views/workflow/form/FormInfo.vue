<template>
  <div>
    <group :title="formJSON.FlowName">
      <cell title="发起人">{{formJSON.SubUser}}</cell>
      <cell title="流程编号">{{formJSON.FlowNumber}}</cell>
    </group>
    <div style="bottom: 46px;">
   
      <router-view></router-view>
    
    </div>
  </div>
</template>

<script lang="babel">
  import {
    Group,
    Cell
  } from 'vux'
  import {
    mapGetters
  } from 'vuex'
  
  export default {
    data() {
      return {
        formJSON: {
          "FlowName": ""
        }
      }
    },
    computed: {
      ...mapGetters({
        getJson: 'getFormJSON'
      })
    },
    components: {
      Group,
      Cell,
    },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.loadInfo();
      })
    },
    methods: {
      loadInfo() {
        this.formJSON = this.getJson;
      }
  
    }
  }
</script>