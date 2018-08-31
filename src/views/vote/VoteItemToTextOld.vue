<template>
  <div>

    
    <checklist ref="VoteObject" :title="itemTitle" :options="inlineDescList" :disabled="Isdisabled" :max=1 @on-change="change" v-model="inlineDescListValue"></checklist>
  
    <group :title="endtime" style="padding:15px;">
      <x-button v-if="!Isdisabled" type="primary" @click.native="IsVote()">投 票</x-button>
    </group>
  </div>
</template>

<script lang="babel">
  import {
    Checklist,
    XButton,
    Group
  } from 'vux'
  
  export default {
    name: 'votetotext',
    components: {
      Checklist,
      XButton,
      Group
    },
    data() {
      return {
        vstatus: 0,
        voteid: '',
        itemTitle: '冬运会项目投票',
        Isdisabled: false,
        endtime: '结束时间：',
        inlineDescListValue: [],
        inlineDescList: []
      }
    },
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.voteid = vm.$route.params.voteid;
        vm.vstatus = vm.$route.params.vstatus;
        vm.Isdisabled = false;
        vm.loadInfo(vm.voteid);
      })
    },
    methods: {
      change(val, label) {
        console.log('change', val, label)
      },
      loadInfo(voteid) {
        this.$http.get("Vote/GetVoteItemBytext/" + voteid).then((res) => {
          console.log(res);
          var Votedata = res.data.Data;
          this.itemTitle = Votedata.itemTitle;
          this.inlineDescList = Votedata.Items;
          this.endtime = '结束时间：' + Votedata.EndDate;
          if (Votedata.ItemSelect != "" && Votedata.ItemSelect != null) {
  
            this.inlineDescListValue = [Votedata.ItemSelect];
          }
  
  
          if (Votedata.status == "N") {
            this.Isdisabled = true;
            this.$vux.toast.show({
              text: Votedata.mgs,
              type: "warn"
            });
          }
  
          if (this.vstatus == 0) {
            this.Isdisabled = true;
            this.$vux.toast.show({
              text: "活动未开始！",
              type: "warn"
            });
          }
  
          if (this.vstatus == 2) {
            this.Isdisabled = true;
            this.$vux.toast.show({
              text: "活动已结束！",
              type: "warn"
            });
  
          }
  
        });
  
  
      },
      IsVote() {
  
        if (this.$refs.VoteObject.getFullValue().length > 0) {
  
          console.log(this.$refs.VoteObject.getFullValue()[0].value);
          var ItemId = this.$refs.VoteObject.getFullValue()[0].value;
          this.$http.post("Vote/AddVote/" + ItemId).then((response) => {
           
            console.log(response);
            this.Isdisabled = response.data.Data.disabled;
            if (response.data.Statu == "Y") {
  
              this.$vux.toast.show({
                text: response.data.Msg,
                type: "ok"
              });
            } else {
              this.$vux.toast.show({
                text: response.data.Msg,
                type: "warn"
              });
  
            }
  
          }, (error) => {
               this.Isdisabled = response.data.Data.disabled;
            this.$vux.toast.show({
              text: response.data.Msg,
              type: "warn"
            });
  
          })
  
        } else {
  
          this.$vux.toast.show({
            text: '请选择后投票',
            type: "warn"
          });
        }
  
      },
  
  
    }
  
  
  }
</script>