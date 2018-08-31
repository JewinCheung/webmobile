<template>
  <div class="page" style="height:100%">
    <view-box ref="viewBox">
      <div ref='voteDesc' class="voteDesc" v-html='getVoteInfo.voteDesc'>


      </div>
      <divider>选项列表</divider>
      <tab :line-width=2 active-color='#fc378c' v-model="index" v-if="AllItemData.length>1">
        <tab-item class="vux-center" v-for="(item, index) in AllItemData" :key="index" @on-item-click="itemclick(item)">{{item.GroupName}}</tab-item>
      </tab>
      <div :height="deviceHeight" id=scrollerDiv>
        <scroller lock-x :height="deviceHeight" ref="scrollerEvent" @on-scroll="onScroll">
          <div v-for="(item, Itemindex) in [AllItemData[index].ItemData]" :key="Itemindex">

            <checker :radio-required="true" class="list">
              <checker-item v-for="(data, index) in item" :key="data.id" :value="data.id" :disabled="data.isSelected" class="list-item">
                <div class="item-img" :style="{'display':data.src.length>0?'block':'none'}" v-on:click="ItemDesc(data)">
                  <x-img :src="data.src" :offset="50000" container="#scrollerDiv"></x-img>
                </div>
                <div class="item-content" v-on:click="ItemDesc(data)">
                  <div class="c-title">

                    {{showTitle(data.title,data.src.length>0)}}
                  </div>
                  <div class="c-other">
                    <span class="c-name">{{data.name}}</span>
                    <span class="c-ticket" v-if="false">票:{{data.voteNums}}</span>
                  </div>
                </div>
                <div class="item-button" v-if="!Isdisabled" :class="{'vote-btn-f':data.isSelected}" v-on:click="(!data.isSelected) && IsVote(data)">
                  {{data.isSelected?'已选':'选择'}}
                  <!-- <x-button :class="{'vote-btn-f':data.isSelected}" v-if="!Isdisabled" @click.native="IsVote(data)" :disabled="SuplusNum>0?data.isSelected:true">
                              {{data.isSelected?'已投':'投票'}}
                            </x-button> -->
                </div>

              </checker-item>
            </checker>
          </div>
        </scroller>
      </div>
    </view-box>
    <div v-transfer-dom>
      <x-dialog v-model="showScrollBox" :dialog-style="{'max-width': '98%', width: '98%', height: '99%'}">
        <!-- <p class="dialog-title" style="background-color: #EDEDED">{{ItemData.name}}</p> -->


        <div :class="dialogScroll" v-html='ItemData.desc' :style="{'height':XDialogHeight}">
        </div>



        <div @click="showScrollBox=false" style="background-color: #F8F8F8;border: 1px solid #C1C1C1;margin-top: 1px">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>

    <div class="vux-flexbox vux-flex-row">

      <div class="float-button-left">
        剩余：{{SuplusNum}}
      </div>
    </div>
  </div>
</template>

<script lang="babel">
  import {
    XButton,
    Tab,
    TabItem,
    Swiper,
    SwiperItem,
    Checker,
    CheckerItem,
    Group,
    ViewBox,
    XDialog,
    Divider,
    Scroller,
    XImg,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {
    mapGetters
  } from 'vuex'
  export default {
    name: 'votetoimg',
    directives: {
      TransferDom
    },
    components: {
      XButton,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      Checker,
      CheckerItem,
      ViewBox,
      Group,
      XDialog,
      Divider,
      Scroller,
      XImg
    },
    data() {
      return {
        isFirst: true,
        dom: null, //子节点对象
        GroupDom: null, //分组dom
        distance: 50, //滑动延迟距离
        deviceHeight: '530px',
        contentWidth: '200px',
        SuplusNum: 0, //分组剩余票数
        namelength: 28,
        ItemGroup: '',
        endtime: '', //活动结束时间
        index: 0, //分组index
        Isdisabled: false, //投票按钮控制
        XDialogHeight: '400px',
        showScrollBox: false, //详情页控制
        dialogScroll: '',
        baseURL: 'http://e.mdsd.cn:9000/', //图片地址
        //数据原型
        ItemData: {
          name: '',
          desc: ''
        },
        //数据原型
        AllItemData: [{
          GroupName: '',
          SuplusNum: 0,
          ItemData: [{
            id: '',
            title: '',
            name: '',
            desc: '',
            src: '',
            isSelected: false
          }]
        }],


      }
    },
    beforeRouteEnter: function (to, from, next) {
      next(vm => {
        vm.voteid = vm.$route.params.voteid;
        vm.vstatus = vm.$route.params.vstatus;
        vm.deviceHeight = (vm.$parent.windowHeight - 50) + "px";
        document.title = vm.getVoteInfo.title;
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        vm.index = 0;
        vm.isFirst = true;
        vm.Isdisabled = false;
        vm.loadInfo(vm.voteid);

      })
    },
    destroyed() {
      this.box = document.querySelector('#vux_view_box_body');
      this.box.removeEventListener('scroll', this.handler)
    },
    computed: {
      ...mapGetters({
        getVoteGroup: 'getVoteGroup',
        getVoteInfo: 'getVoteInfo',
      })

    },
    mounted() {
      this.$nextTick(function () {
        this.box = document.querySelector('#vux_view_box_body');
        this.box.addEventListener('scroll', this.handler);
      })

    },
    methods: {

      showTitle(data, isImg) {

        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        if (isImg) {

          w = w - 48;
        }
        var tlength = parseInt((w - 80 - 52) / 14) * 2;

        var st = this.substrNew(data, tlength - 2);

        return st;
      },

      substrNew(data, length) {
        if (data.replace(/[\u4e00-\u9fa5]/g, "**").length <= length) {
          return data;
        } else {
          var len = 0;
          var tmpStr = "";
          for (var i = 0; i < data.length; i++) { //遍历字符串  
            if (/[\u4e00-\u9fa5]/.test(data[i])) { //中文 长度为两字节  
              len += 2;
            } else {
              len += 1;
            }
            if (len > length) {
              break;
            } else {
              tmpStr += data[i];
            }
          }
          return tmpStr + " ..";
        }
      },

      handler() {
        this.box = document.querySelector('#vux_view_box_body');
        var viewBoxH = this.box.scrollTop;
        var voteDescH = this.$refs.voteDesc.offsetHeight;

        var height = voteDescH;
        if (this.AllItemData.length > 1) {
          height = height + 36;
        }
        if (viewBoxH >= height) {
          this.$refs.viewBox.scrollTo(height);
        }


      },
      smoothDown() {
        // var voteDescH = this.$refs.voteDesc.offsetHeight;
        // var height = voteDescH + 36;
        // this.$refs.viewBox.scrollTo(height);
        var voteDescH = this.$refs.voteDesc.offsetHeight;
        var distance = this.$refs.viewBox.getScrollTop();
        var height = voteDescH + 36;
        var topheight = height / 50;

        (function Down() {
          if (distance < height) {
            distance += topheight // 移动一小段
            document.querySelector('#vux_view_box_body').scrollTop = distance;　　 // 设定每一次跳动的时间间隔为10ms
            setTimeout(Down, 10)
          } else {　　 // 限制滚动停止时的距离
            document.querySelector('#vux_view_box_body').scrollTop = height;
          }
        })();
      },
      onScroll(pos) {
        this.scrollTop = pos.top
        if (this.isFirst) {
          if (pos.top > 0) {
            this.smoothDown();
            this.isFirst = false;
          }
        }

      },
      handleClick(i, data) {
        //checkbox选中操作
        // console.log(data.isSelected)
        for (var k = 0; k < this.$refs.items[0].getElementsByClassName('weui-check').length; k++) {
          if (this.$refs.items[0].getElementsByClassName('weui-check')[k].name == 'false') {
            this.$refs.items[0].getElementsByClassName('weui-check')[k].checked = false;
          }

        }

        if (this.SuplusNum > 0) {
          this.dom = data;
          this.$refs.items[0].getElementsByClassName('itme_' + i)[0].checked = true;
        }


      },
      loadInfo(voteid) {
        if (this.getVoteGroup.length > 0) {
          // console.log(this.getVoteGroup);
          if (this.vstatus == 0) {
            this.Isdisabled = true;
            this.$vux.toast.show({
              text: "活动未开始！",
              type: "warn"
            });
          }
          // console.log("加载")

          if (this.vstatus == 2) {
            this.Isdisabled = true;
            this.$vux.toast.show({
              text: "活动已结束！",
              type: "warn"
            });
          }
          //  console.log( this.Isdisabled)

          this.$http.get("Vote/GetVoteItems/" + voteid).then((res) => {

            var Itemlist = res.data.Data
            this.endtime = res.data.Msg;
            //获取数据
            var AllItemData = this.getVoteGroup.map((vitem) => {
              var ItemData = Itemlist.filter((item) => {

                if (vitem.Id == item.ItemGroup) {
                  return true
                } else {
                  return false;
                }
              }).map((Item) => {
                var url = '';
                if (Item.FilePath != null && Item.FilePath != '') {
                  var FilePath = Item.FilePath.substring(3, Item.FilePath.length);
                  url = this.baseURL + FilePath;

                }
                return {
                  id: Item.Id,
                  title: Item.Title,
                  name: Item.Name,
                  desc: Item.Describe,
                  src: url,
                  voteNums: Item.VoteNums,
                  isSelected: Item.isSelected == '0' ? false : true,

                }

              });

              return {
                ItemGroup: vitem.Id,
                GroupName: vitem.GroupName,
                SuplusNum: vitem.SuplusNum,
                ItemData: ItemData
              }
            });
            this.AllItemData = AllItemData;
            if (AllItemData.length > 1) {
              this.deviceHeight = (this.$parent.windowHeight - 50 - 50) + "px";
            } else {

              this.deviceHeight = (this.$parent.windowHeight - 36 - 50) + "px";
            }
            this.SuplusNum = AllItemData[0].SuplusNum
            this.ItemGroup = AllItemData[0].ItemGroup;
            this.GroupDom = AllItemData[0];
          });

        } else {

          this.$router.push("/vote/list")
        }

      },
      //tab 切换
      itemclick(item) {
        this.GroupDom = item;
        this.SuplusNum = item.SuplusNum;
        this.ItemGroup = item.ItemGroup;
        //滚动条回顶部
        this.$refs.scrollerEvent.reset({
          top: 0
        });

        // if (this.vstatus == 1) {
        //   if (this.SuplusNum > 0) {
        //     this.Isdisabled = false;
        //   } else {
        //     this.Isdisabled = true;

        //   }
        // }
        this.smoothDown();
      },
      //投票
      IsVote(data) {
        if (this.SuplusNum != 0) {
          var ItemId = data.id //选项ID
          var SerialNo = ItemId + ',' + this.ItemGroup + ',' + this.voteid;
          // console.log(SerialNo);
          // console.log("触发");
          this.$http.post("Vote/AddVote/" + SerialNo).then((response) => {



            if (response.data.Statu == "Y") {
              this.SuplusNum -= 1;
              this.GroupDom.SuplusNum -= 1;
              data.voteNums += 1;
              data.isSelected = true;
              this.$vux.toast.text(response.data.Msg);
            } else {

              data.isSelected = false;
              this.$vux.toast.show({
                text: response.data.Msg,
                type: "warn"
              });

            }

          }, (error) => {
            data.isSelected = false;
            this.$vux.toast.show({
              text: response.data.Msg,
              type: "warn"
            });

          });



        } else {
          // this.Isdisabled = true;
          this.$vux.toast.show({
            text: '已完成过选择',
            type: "warn"
          });

        }

      },
      //详情
      ItemDesc(Item) {
        // scrollTop 
        console.log(Item)
        var windowHeight = window.innerHeight;
        this.ItemData = Item;
        this.XDialogHeight = (windowHeight * 0.99 - 48) + 'px';
        this.dialogScroll = 'dialog-scroll';
        this.showScrollBox = true;

      }
    }
  }

</script>

<style scoped lang="less">
  @import '~vux/src/styles/close'; // body {
  //   background-color: #ddd;
  //   box-sizing: border-box;
  //   margin: 0;
  //   padding: 0;
  // }
  .list {
    padding: 5px;
  }

  .list-item {
    display: flex;
    border: 1px solid whitesmoke;
    width: 400px;
    min-height: 48px;
    padding: 10px 0px;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 5px;
    background-color: white;
    width: 100%;
    box-sizing: border-box;
  }

  .list-item .item-img {
    width: 48px;
    height: 48px;
    border: 1px solid #5b9bd1;
    /* display: nosne; */
    img {
      width: 48px;
      height: 48px;
    }
  }

  .list-item .item-content {
    display: flex;
    flex: auto;
    padding: 0px 10px;
    flex-direction: column;
    justify-content: space-around;
  }

  .list-item .item-content .c-title {
    font-size: 14px;
    font-weight: 500;
  }

  .list-item .item-content .c-other {
    font-size: 13px;
    font-weight: 300;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .list-item .item-content .c-other .c-ticket {
    color: lightskyblue;
  }

  .list-item .item-button {
    width: 80px;
    border-left: 1px solid whitesmoke;
    text-align: center;
    vertical-align: middle;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: orange;
  }

  .list-item .vote-btn-f {
    width: 80px;
    border-left: 1px solid whitesmoke;
    text-align: center;
    vertical-align: middle;
    color: rgba(0, 0, 0, 0.3);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #F7F7F7;
  }

  .vux-close {
    color: red;
    margin-top: 12px;
    margin-bottom: 12px;
  }

  .vux-checker-item {
    display: inline-flex;
  }

  .vote-btn-t {
    font-size: 14px;
    color: white;
    background-color: #FF7F00;
  }

  .vote-btn-f {
    color: rgba(0, 0, 0, 0.3);
    background-color: #F7F7F7;
  }

  .float-button-left {
    position: fixed;
    bottom: 10px;
    left: 10px;
    height: 30px;
    width: 70px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    color: #FFFFFF;
    border-radius: 9px;
    border-width: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0.5);
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
  }

  .dialog-scroll {
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    padding: 20px 10px;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    text-align: left;
    img {
      width: 90%;
    }
    p img {
      width: 90%;
    }
    p strong img {
      width: 90%;
    }
  }

  .voteDesc {
    padding: 10px;
    font-size: 12px;
    img {
      width: 90%;
    }
    p img {
      width: 90%;
    }
    p strong img {
      width: 90%;
    }
  }

</style>

<style lang="less">
  .dialog-scroll {
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px 10px;
    overflow: scroll;
    width: 100%;
    -webkit-overflow-scrolling: touch;
    text-align: left;
    img {
      width: 90%;
    }
    p img {
      width: 90%;
    }
    p strong img {
      width: 90%;
    }
  }

</style>
