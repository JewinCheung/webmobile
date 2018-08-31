<template>
  <div>
    <divider>纸质文档-表单明细</divider>
    <group>
      <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
      <cell title="寄件人">{{postJSON.SenderUserName}}</cell>
      <cell title="接受人">{{postJSON.AcceptUserName}}</cell>
      <cell title="邮寄日期">{{postJSON.SenderDate | substr(10)}}</cell>
      <cell title="快递方式">{{postJSON.PostType}}</cell>
      <cell title="快递单号">{{postJSON.PostNum}}</cell>
      <cell title="备注" :inline-desc="postJSON.PaperMemo"></cell>
    </group>
    <divider>文档明细</divider>
    <!--物品申请-->
    <group v-if="subItems.length>0" v-for="item in subItems":key='item.DocName'>
      <cell title="文档类别">{{item.DocName}}</cell>
      <cell title="份数">{{item.DocNums}}</cell>
      <cell title="总页数">{{item.DocPages}}</cell>
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
  
  // 项目纸质文档流程
  export default {
    name: "formPaperExpress",
    data() {
      return {
        postJSON: {
          SenderUserName: "",
          ProjectName: "",
          AcceptUserName: "",
          SenderDate: "",
          PostType: "",
          PostNum: "",
          PaperMemo: ""
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
  
          var newData = postData.PaperJson;
          if (newData && newData.length > 0) {
            var temp = JSON.parse(newData);
            that.subItems = temp.map((item) => {
              return {
                DocName: item.DocName,
                DocNums: item.DocNums,
                DocPages: item.DocPages
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