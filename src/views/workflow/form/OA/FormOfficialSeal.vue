<template>
  <div>
    <divider>公章申请-表单明细</divider>
    <group>
      <cell title="申请部门">{{postJSON.DeptName}}</cell>
      <cell title="是否外带">{{postJSON.IsTakeAway==0?"否":"是"}}</cell>
      <cell title="盖章日期">{{postJSON.SealTime | substr(10) }}</cell>
      <cell title="开始日期">{{postJSON.StartTime | substr(10) }}</cell>
      <cell title="结束日期">{{postJSON.EndTime | substr(10) }}</cell>
      <x-switch title="是否专管部门" @click.native="SetDept()" v-model='postJSON.IsSpecial'></x-switch>
      <cell title="专管部门" is-link @click.native="postJSON.IsSpecial==true?XWIsSpecial = true:XWIsSpecial=false">{{postJSON.SpecialDeptName==""?(postJSON.IsSpecial==true?"点击选择部门":"未启用"):postJSON.SpecialDeptName}}</cell>
      <cell title="对接人">{{postJSON.PickUName}}</cell>
      <cell title="备注信息" :inline-desc="postJSON.Memo"></cell>
    </group>
    <divider>文件明细</divider>
    <group v-if="subItems.length>0" v-for="item in subItems" :key='item.ItemName'>
      <cell title="文件名称">{{item.ItemName}}</cell>
      <cell title="用途">{{item.UserType}}</cell>
      <cell title="数量">{{item.Num}}</cell>
      <cell title="所属公司">{{item.CompName}}</cell>
    </group>
  
    <div>
      <popup v-model="XWIsSpecial" height="80%">
        <div style='width:100%;height:100%' v-if='ztreeDataSource.length>0' class="Deptlist">
  
          <vue-ztree :list.sync='ztreeDataSource' :func='nodeClick' :is-open='true'></vue-ztree>
          <div style="padding:15px">
            <x-button @click.native="XWIsSpecial = false" plain type="primary">确认</x-button>
          </div>
        </div>
      </popup>
  
    </div>
  </div>
</template>

<script lang="babel">
  import {
    Divider,
    Group,
    Cell,
    XSwitch,
    XButton,
    Popup
  } from 'vux'
  import {
    mapGetters,
    mapActions
  } from 'vuex'
  import vueZtree from '../../../../components/vue-ztree.vue'
  // 资质原件申请
  export default {
    name: "formInvoiceApply",
    data() {
      return {
        postJSON: {
          DeptName: "",
          IsTakeAway: "",
          SealTime: "",
          StartTime: "",
          EndTime: "",
          SpecialDeptName: "",
          PickUName: "",
          Memo: "",
          IsSpecial: false,
          SpecialDept: ""
        },
        XWIsSpecial: false,
        //申请明细
        subItems: [],
        show: true,
        ztreeDataSource: []
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
      ...mapActions({
        // 状态管理的方法
        setFormData: 'SetFormData',
      }),
      loadInfo() {
        if (this.formJSON.FlowJson) {
          // console.log(this.formJSON)
          // 设置主表
          var postData = JSON.parse(this.formJSON.FlowJson);
          var tempJson = this.postJSON;
          var that = this;
  
          Object.keys(tempJson).forEach(function(key) {
            that.postJSON[key] = postData[key] || "";
          });
          this.postJSON.IsSpecial = this.postJSON.IsSpecial == 0 ? false : true;
  
  
          if (this.postJSON.IsSpecial) {
            this.XWIsSpecial = false;
  
          }
  
  
          var tempData = postData.DetailJsonList;
          if (tempData && tempData.length > 0) {
            that.subItems = tempData.split('|').map((item) => {
              var data = item.split('~');
              return {
                ItemName: data[0],
                UserType: data[1],
                Num: data[2],
                CompName: data[3]
              }
            });
          }
  
          var rUrl = 'Common/GetDeptByEasyUI/474';
          this.$http.get(rUrl).then((response) => {
            // console.log(response.data.Data)
            this.ztreeDataSource = response.data.Data;
          }, (error) => {
  
          });
  
          //  this.formJSON.FlowJson="111";
          //  this.setFormData(this.formJSON)
  
        } else {
          this.$router.push("/workflow")
        }
  
      },
      SetDept() {
        this.XWIsSpecial = !this.postJSON.IsSpecial
        if (!this.XWIsSpecial) {
          this.postJSON.SpecialDept = "";
          this.postJSON.SpecialDeptName = "未启用";
          var postData = JSON.parse(this.formJSON.FlowJson);
          postData.IsSpecial = 0;
          postData.SpecialDept = "";
          postData.SpecialDeptName = "";
          this.formJSON.FlowJson = JSON.stringify(postData);
          // console.log(this.formJSON);
          this.setFormData(this.formJSON)
        } else {
  
          this.postJSON.SpecialDeptName = "点击选择部门";
        }
      },
      // 点击节点
      nodeClick: function(m) {
        // console.log(JSON.parse(JSON.stringify(m)));
        var nodeinfo = JSON.parse(JSON.stringify(m));
        this.postJSON.SpecialDept = nodeinfo.id;
        this.postJSON.SpecialDeptName = nodeinfo.name;
        var postData = JSON.parse(this.formJSON.FlowJson);
        postData.IsSpecial = 1;
        postData.SpecialDept = nodeinfo.id;
        postData.SpecialDeptName = nodeinfo.name;
        this.formJSON.FlowJson = JSON.stringify(postData);
        // console.log(this.formJSON);
        this.setFormData(this.formJSON)
  
      },
      toggleChildren: function(item) {
        item.expanded = !item.expanded;
      },
    },
    components: {
      Cell,
      Group,
      Divider,
      XSwitch,
      XButton,
      Popup,
      vueZtree
    },
  }
</script>

<style type="text/css">
  .Deptlist {
    overflow: auto;
  }
</style>