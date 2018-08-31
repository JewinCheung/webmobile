<template>
  <div>
    <divider>招聘申请-表单明细</divider>
    <group>
      <cell title="招聘原因" :inline-desc="postJSON.Reason"></cell>
      <cell title="招聘分类">{{postJSON.Category}}</cell>
      <cell title="招聘性质">{{postJSON.RecruitType}}</cell>
      <cell title="替补人员" v-if="postJSON.Replace">{{postJSON.ReplaceUser}}</cell>
      <cell title="替补岗位" v-if="postJSON.Replace">{{postJSON.ReplaceJob}}</cell>
      <cell title="用人部门">{{postJSON.DeptName}}</cell>
      <cell title="岗位名称">{{postJSON.JobName}}</cell>
      <cell title="招聘人数">{{postJSON.RecruitUserNum}}</cell>
      <cell title="工作经验">{{postJSON.WorkExperience}}</cell>
      <cell title="工作内容" :inline-desc="postJSON.WorkContent"></cell>
      <cell title="任职要求" :inline-desc="postJSON.DutyRequired"></cell>
      <cell title="期望到岗日">{{postJSON.ExpectEnterDate| substr(10)}}</cell>
      <cell title="常驻地">{{postJSON.LongLocal}}</cell>
      <cell title="出差频率">{{postJSON.TravelRate}}</cell>
      <cell title="出差范围">{{postJSON.TravelRange}}</cell>
      <cell title="开放猎头">{{(postJSON.IsHunter==0||"0"||"")?"不开放":"开放猎头"}}</cell>
      <cell title="开放原因" :inline-desc="postJSON.HunterMemo"></cell>
  
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
  // 招聘申请流程
  export default {
    name: "formRecruitApply",
    data() {
      return {
        postJSON: {
          Reason: "", //招聘原因
          Category: "", //招聘分类
          RecruitType: "", //招聘性质
          ReplaceUser: "", //替补人员
          ReplaceJob: "", //替补岗位
          DeptName: "", //用人部门
          JobName: "", //岗位名称
          RecruitUserNum: "", //招聘人数
          WorkExperience: "", //工作经验
          WorkContent: "", //工作内容
          DutyRequired: "", //任职要求
          ExpectEnterDate: "", //期望到岗日
          LongLocal: "", //常驻地
          TravelRate: "", //出差频率
          TravelRange: "", //出差范围
          IsHunter: "", //开放猎头
          HunterMemo: "", //开放原因
          is_Hunter: true,
          Replace: true,
  
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
          // 设置主表
          var postData = JSON.parse(this.formJSON.FlowJson);
          var tempJson = this.postJSON;
          var that = this;
          Object.keys(tempJson).forEach(function(key) {
            that.postJSON[key] = postData[key] || "";
          })
  
          if (that.postJSON.RecruitType == "新增编制") {
            that.postJSON.Replace = false;
          } else {
            that.postJSON.Replace = true;
  
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