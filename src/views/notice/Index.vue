
<template>
  <div class="page notice">
    <!--<x-header :left-options="{showBack:true,backText:'返回',preventGoBack:true}" @on-click-back="backIndex()">
                              公司新闻
                          </x-header>-->
    <div class="weui-tab-bd">
      <card v-for="item in noticeData" :key="item.DocTitle" :header="{title:item.TypeName}" :footer="{title:'查看详情',link:'/notice/noticeinfo/'+item.SerialNo}">
        <div slot="content" class="card_bd">
          {{item.DocTitle}}
        </div>
      </card>
    </div>
  </div>
</template>

<script lang="babel">
  import {
    XHeader,
    Cell,
    Group,
    Card
  } from 'vux'
  export default {
    name: 'notice',
    data() {
      return {
        noticeData: [],
      }
    },
    components: {
      XHeader,
      Cell,
      Group,
      Card
    },
  
    beforeRouteEnter: function(to, from, next) {
      next(vm => {
        vm.loadInfo();
      })
    },
    methods: {
      loadInfo() {
        //加载待处理的流程
        this.$http.get("Notice").then((res) => {
          this.noticeData = res.data;
        });
  
      },
      newFlow() {
        this.$vux.toast.show({
          text: '未完成,请稍后',
          type: "cancel"
        });
      },
      backIndex() {
        this.$router.push("/index");
      }
    }
  }
</script>

<style scoped>
  .flow_info {
    margin-top: 5px;
    padding: 5px 0px;
    display: flex;
    font-size: 14px;
    color: gray;
    justify-content: space-between;
    font-weight: 200;
  }
  
  .card_bd {
    padding: 15px 15px;
  }
</style>