<template>
  <div>
  
    <group title="附件列表">
      <cell v-for="item in AttachItems" :key="item.fileName" :title="item.fileName" :value="item.fileSize">
        <a :href="item.fileUrl" download="w3logo" class="app_download" v-if="item.fileName != '不存在附件'">查看</a>
      </cell>
    </group>
  
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
        },
        AttachItems: []
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
        this.loadAttachFiles();
        // console.log(this.formJSON)
      },
      // 加载项目文档信息
      loadAttachFiles() {
        var AttachFiles = this.formJSON.AttachFiles
        if (AttachFiles == null || AttachFiles == "") {
  
          this.AttachItems = [{
            "fileName": "不存在附件",
            "fileSize": "",
            "fileType": ""
          }];
          // console.log(this.AttachItems)
        } else {
          this.$http.get("Common/GetAttachFiles/" + AttachFiles).then((success) => {
            var tempList = success.data.Data;
            if (!tempList || tempList.length == 0) {
              return false;
            }
            this.AttachItems = tempList;
            // console.log(this.AttachItems)
          })
        }
      },
  
    }
  }
</script>

<style>
	.app_download {
		color: green;
		float: right;
		margin-right: 20px;
	}
</style>