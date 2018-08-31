<template>
  <div class="page" style="height:100%">
    <view-box ref="viewBox">

      <div ref='voteDesc' class="voteDesc" v-html='getVoteInfo.voteDesc'>


      </div>

      <divider>投票列表</divider>
      <tab :line-width=2 active-color='#fc378c' v-model="index" v-if="AllItemData.length>1">
        <tab-item class="vux-center" v-for="(item, index) in AllItemData" :key="index" @on-item-click="itemclick(item)">{{item.GroupName}}</tab-item>
      </tab>
      <div :height="deviceHeight" id="scrollerDiv">
        <scroller lock-x :height="deviceHeight" ref="scrollerEvent" @on-scroll="onScroll">
          <div v-for="(item, index) in [AllItemData[index].ItemData]" :key="index" class="swiperItem">

            <grid :cols="2" style="border: 0px">
              <grid-item v-for="index in item" :key="index.id" :value="index.id">
                <div class="Vote-item" :class="{'item-selected':index.isSelected}">
                  <div v-on:click="ItemDesc(index)" style="position: relative;">
                    <x-img :src="index.src" :offset="50000" default-src="http://placeholder.qiniudn.com/140x160/8AEEB1/ffffff" container="#scrollerDiv"
                      :style="{'padding-top': imgClass + 'px' }"></x-img>
                    <!-- <img :src="index.src"> -->
                    </br>
                    <span>{{index.name | substr(9)}}</span>
                    <span class="voteBadge">{{index.VoteNums}}</span>

                  </div>
                  <x-button v-if="Isdisabled" @click.native="IsVote(index)" :disabled="SuplusNum>0?index.isSelected:true">
                    {{index.isSelected?'已投':'投票'}}
                  </x-button>
                </div>
              </grid-item>
            </grid>
          </div>
        </scroller>

      </div>


    </view-box>

    <div class="vux-flexbox vux-flex-row">

      <div class="float-button-left" v-on:click="smoothDown()">
        余票：{{SuplusNum}}
      </div>
    </div>

    <div v-transfer-dom>
      <x-dialog v-model="showScrollBox" :dialog-style="{'max-width': '98%', width: '98%', height: '99%'}" style="text-align: left;">
        <!-- <p class="dialog-title" style="background-color: #EDEDED">{{ItemData.name}}</p>
                                                                                                                                                                   -->

        <div :class="dialogScroll" v-html='ItemData.desc' :style="{'height':XDialogHeight}">
        </div>



        <div @click="showScrollBox=false" v-on:click="StopM()" style="background-color: #F8F8F8;border: 1px solid #C1C1C1;margin-top: 1px">
          <span class="vux-close"></span>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script lang="babel">
  import {
    Grid,
    GridItem,
    XButton,
    Tab,
    TabItem,
    Group,
    Scroller,
    XDialog,
    Divider,
    ViewBox,
    XImg,
    Badge,
    TransferDomDirective as TransferDom
  } from 'vux'
  import {
    mapGetters
  } from 'vuex'
  import {
    mapActions
  } from 'vuex'
  export default {
    name: 'votetoimg',
    directives: {
      TransferDom
    },
    components: {
      Grid,
      GridItem,
      XButton,
      Tab,
      TabItem,
      Group,
      Scroller,
      XDialog,
      Divider,
      ViewBox,
      Badge,
      XImg
    },
    data() {
      return {
        isFirst: true,
        dom: null, //子集dom
        GroupDom: null, //分组dom
        imgClass: '', //选项默认样式
        deviceHeight: '500px', //滚动容器高度
        XDialogHeight: '400px',
        SuplusNum: 0, //分组
        ItemGroup: '', //分组ID
        index: 0, //分组索引
        desc: '', //详情内容
        showScrollBox: false, //详情页控制
        Isdisabled: true, //投票按钮总开关
        //baseURL: 'http://localhost:9001/',
        baseURL: 'http://e.mdsd.cn:9000/', //图片地址
        //数据原型
        ItemData: {
          name: '',
          desc: ''
        },
        AllItemData: [{
          GroupName: '',
          SuplusNum: 0,
          ItemData: [{
            id: '1',
            src: 'http://placeholder.qiniudn.com/140x160/8AEEB1/ffffff',
            name: '',
            desc: '',
            VoteNums: '',
            isSelected: false

          }]
        }],
        dialogScroll: ''
      }
    },
    beforeRouteEnter: function (to, from, next) {
      next(vm => {
        //路由器进入 初始化
        vm.voteid = vm.$route.params.voteid; //活动ID
        vm.vstatus = vm.$route.params.vstatus; //活动状态 0：未开始  1：进行中 2：结束
        vm.Isdisabled = true; //投票总开关
        vm.index = 0;
        vm.deviceHeight = (vm.$parent.windowHeight - 50) + "px";
        document.title = vm.getVoteInfo.title; //title值
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
        if (w > 320) { //自适应宽度
          vm.imgClass = 6;
        } else {
          vm.imgClass = 0;

        }
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
      }),

    },
    mounted() {
      this.$nextTick(function () {
        this.box = document.querySelector('#vux_view_box_body');
        this.box.addEventListener('scroll', this.handler);
      })

    },
    methods: {
      ...mapActions({
        // 状态管理的方法
        SetVoteGroup: 'SetVoteGroup',
        SetVoteInfo: 'SetVoteInfo'
      }),
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
        var voteDescH = this.$refs.voteDesc.offsetHeight;
        var distance = this.$refs.viewBox.getScrollTop();
        var height = voteDescH + 36;
        var topheight = height / 50;
        // this.$refs.viewBox.scrollTo(height);


        // if (distance < height) {
        //   console.log(distance);
        //   distance += topheight;
        //   this.$refs.viewBox.scrollTo(distance);
        //   setTimeout(this.smoothDown(), 10000, false);

        // }
        //  this.box = document.querySelector('#vux_view_box_body');
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
      //tab 切换  变更当初分组数据
      itemclick(item) {
        this.GroupDom = item;
        this.SuplusNum = item.SuplusNum;
        this.ItemGroup = item.ItemGroup;
        //滚动条回顶部
        this.$refs.scrollerEvent.reset({
          top: 0
        });
        this.smoothDown();
      },
      //加载原型数据
      loadInfo(voteid) {
        if (this.getVoteGroup.length > 0) {
          if (this.vstatus == 0) {
            this.Isdisabled = false;
            this.$vux.toast.show({
              text: "活动未开始！",
              type: "warn"
            });
          }

          if (this.vstatus == 2) {
            this.Isdisabled = false;
            this.$vux.toast.show({
              text: "活动已结束！",
              type: "warn"
            });

          }
          this.$http.get("Vote/GetVoteItems/" + voteid).then((res) => {

            var Itemlist = res.data.Data
            var AllItemData = this.getVoteGroup.map((vitem) => {
              //获取分组对应的选项
              var ItemData = Itemlist.filter((item) => {
                if (vitem.Id == item.ItemGroup) {
                  return true
                } else {
                  return false;
                }
              }).map((Item) => {
                //图片地址处理
                var url = 'http://placeholder.qiniudn.com/140x160/8AEEB1/ffffff';
                if (Item.FilePath != null && Item.FilePath != '') {
                  var FilePath = Item.FilePath.substring(3, Item.FilePath.length);
                  url = this.baseURL + FilePath;

                }
                //AllItemData.ItemData原型数据
                return {
                  id: Item.Id,
                  src: url,
                  name: Item.Title,
                  desc: Item.Describe,
                  VoteNums: Item.VoteNums,
                  isSelected: Item.isSelected == '0' ? false : true,
                }

              });
              //AllItemData原型数据
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
          //没有分组信息返回活动列表
          this.$router.push("/vote/list")
        }




      },
      //投票
      IsVote(Item) {
        var ItemId = Item.id //选项ID
        var SerialNo = ItemId + ',' + this.ItemGroup + ',' + this.voteid; //选项，分组，活动id
        if (this.SuplusNum != 0) {
          this.$http.post("Vote/AddVote/" + SerialNo).then((response) => {

            // console.log(response);

            if (response.data.Statu == "Y") {
              var isSelected = response.data.Data.isSelected;
              this.SuplusNum -= 1;
              this.GroupDom.SuplusNum -= 1;
              Item.voteNums += 1;
              Item.isSelected = isSelected;
              this.$vux.toast.text(response.data.Msg);
            } else {

              Item.isSelected = false;
              this.$vux.toast.show({
                text: response.data.Msg,
                type: "warn"
              });

            }

          }, (error) => {
            Item.isSelected = false;
            this.$vux.toast.show({
              text: response.data.Msg,
              type: "warn"
            });

          })

        } else {
          this.Isdisabled = false;
          this.$vux.toast.show({
            text: '剩余票数为0!',
            type: "warn"
          });

        }


      },
      //详情
      ItemDesc(Item) {
        // scrollTop 
        console.log(Item)
        var windowHeight = window.innerHeight;
        console.log(windowHeight)
        this.ItemData = Item;
        this.XDialogHeight = (windowHeight * 0.99 - 48) + 'px';
        console.log(this.XDialogHeight)
        this.dialogScroll = 'dialog-scroll';
        this.showScrollBox = true;
        // this.$refs.dialogScroll.documentElement.scrollTop=300;
        // this.$vux.alert.show({
        //   content: index.desc,
        // });
      },
      StopM() {
        var myVideo = document.querySelector('#video');
        console.log(this.XDialogHeight)
        if (myVideo) {
          myVideo.currentTime = 0; //属性设置或返回音频/视频播放的当前位置（以秒计）。当设置该属性时，播放会跳跃到指定的位置。
          myVideo.pause()
        }
      }

    }


  }

</script>

<style scoped lang="less">
  @import "~vux/src/styles/close";
  .vux-close {
    color: red;
    margin-top: 10px;
    margin-bottom: 11px;
  }

  .swiperItem {
    height: 100%;
    overflow: auto;
    padding-bottom: 8px;
    padding: 10px 10px;
  }

  .Vote-item {
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    text-align: center;
    color: #e96900;
    font-size: 0.9em;
    overflow: hidden;
    .voteBadge {
      position: absolute;
      top: 7px;
      right: 7px;
      display: inline-block;
      text-align: center;
      background: #73c6d9;
      color: #fff;
      font-size: 12px;
      height: 16px;
      line-height: 16px;
      border-radius: 8px;
      padding: 0 6px;
      background-clip: padding-box;
      vertical-align: middle;
    }
    img {
      height: 160px;
      margin: auto;
    }
    span {
      line-height: 38px;
      font-family: Microsoft YaHei;
      background-color: #f8f8f8;
      border-radius: 2px;
      padding: 3px 5px;
      margin: 0 2px;
    }
    .Vt-btn {
      height: 25px;
      width: 60px;
      font-size: 13px;
      line-height: 25px;
      float: right;
      margin-right: 15px;
      margin-top: 10px;
      font-family: Microsoft YaHei;
    }
    button {
      height: 40px;
      width: 104%;
      margin-left: -4px;
      border-radius: 0px;
      font-size: 13px;
      line-height: 40px;
      font-family: Microsoft YaHei;
    }
  }

  .Vote-item-min {
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    margin: 6px 0px 4px 7px;
    text-align: center;
    color: #e96900;
    font-size: 0.9em;
    width: 140px;
    overflow: hidden;
    .voteBadge {
      position: absolute;
      top: 7px;
      right: 7px;
      display: inline-block;
      text-align: center;
      background: #73c6d9;
      color: #fff;
      font-size: 12px;
      height: 16px;
      line-height: 16px;
      border-radius: 8px;
      padding: 0 6px;
      background-clip: padding-box;
      vertical-align: middle;
    }
    img {
      width: 125px;
      height: 150px;
      margin: 6px 0px 0px 6px;
    }
    span {
      line-height: 35px;
      font-family: Microsoft YaHei;
      background-color: #f8f8f8;
      border-radius: 2px;
      padding: 3px 5px;
      margin: 0 2px;
    }
    .Vt-btn {
      height: 25px;
      width: 60px;
      font-size: 13px;
      line-height: 25px;
      float: right;
      margin-right: 15px;
      margin-top: 10px;
      font-family: Microsoft YaHei;
    }
    button {
      height: 40px;
      width: 104%;
      margin-left: -4px;
      border-radius: 0px;
      font-size: 13px;
      line-height: 40px;
      font-family: Microsoft YaHei;
    }
  }

  .item-selected {
    background: #ffffff url(../../../static/images/app/active.png) no-repeat right bottom;
    border-color: #ff4a00;
  }

  .item-Vote {
    background: #ffffff url(../../../static/images/app/active.png) no-repeat right bottom;
  }

  .float-button-right {
    position: fixed;
    bottom: 50px;
    right: 20px;
    height: 40px;
    width: 60px;
    font-size: 18px;
    color: #ffffff;
    border-radius: 9px;
    border-width: 0;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    background: rgba(0, 0, 0, 0.5);
    margin-left: 0px;
    margin-right: 0px;
    padding-left: 0px;
    padding-right: 0px;
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
    color: #ffffff;
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
    box-sizing: border-box;
    padding: 20px 10px;
    background-color: #fff;
    width: 100%;
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

  .weui-grids:before {
    border: 0px solid;
  }

  .weui-grid:before {
    border: 0px solid;
  }

  .weui-grids:after {
    border: 0px solid;
  }

  .weui-grid:after {
    border: 0px solid;
  }

</style>

<style lang="less">
  .dialog-scroll {
    box-sizing: border-box;
    padding: 20px 10px;
    background-color: #fff;
    width: 100%;
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

</style>
