<template>
    <div class="page">
        <swiper v-model="selectIndex" :height="deviceHeight" :show-dots="false">
    
            <swiper-item class="swiperItem">
                <flexbox :gutter="0" wrap="wrap">
                    <flexbox-item :span="1/3" v-for="item in items" :key="item.text" @click.native="go(item.link)">
                        <div class="grid">
                            <div class="gird-badge">
                                <badge :text="getMsg.flow+''" v-if="item.link=='workflow'"></badge>
                                <img :src="item.image" alt="">
                            </div>
                            <div>{{item.text}}</div>
                        </div>
                    </flexbox-item>
                </flexbox>
            </swiper-item>
            <swiper-item class="swiperItem">
                <div class="msgcontent">
                    <card v-for="item in msgItems" :key="item.MsgNo" :header="{title:'消息类别:'+item.MsgTitle}" :footer="{title:'查看详情',link:'/workflow'}">
                        <div slot="content" class="card_bd">
                            {{ item.MsgContent}}
                        </div>
                    </card>
                </div>
            </swiper-item>
            <swiper-item class="swiperItem">
                <Group title="个人基本信息">
                    <cell title="工号">
                        <span style="color: green">{{user.GongHao}}</span>
                    </cell>
                    <cell title="姓名">
                        <span style="color: green">{{user.UserName}}</span>
                    </cell>
                    <cell title="部门">
                        <span style="color: green">{{user.DeptName}}</span>
                    </cell>
                    <cell title="岗位">
                        <span style="color: green">{{user.PostName}}</span>
                    </cell>
                    <cell title="年假">
                        <span style="color: green">{{user.YearDays}}</span>
                    </cell>
                    <cell title="福利假">
    
                        <span style="color: green">{{user.ServiceDays}}</span>
    
                    </cell>
                </Group>
            </swiper-item>
    
        </swiper>
        <tabbar v-model="selectIndex">
            <tabbar-item @on-item-click="selectIndex=0" :show-dot="getMsg.flow>0" selected>
                <img slot="icon" src="../assets/images/app/icon_nav_actionSheet.png">
                <span slot="label">应用</span>
            </tabbar-item>
            <tabbar-item @on-item-click="selectIndex=1">
                <img slot="icon" src="../assets/images/app/icon_nav_msg.png">
                <span slot="label">消息</span>
            </tabbar-item>
            <tabbar-item @on-item-click="selectIndex=2">
                <img slot="icon" src="../assets/images/app/icon_user.png">
                <span slot="label">我</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>


<script lang="babel">
    import {
        Swiper,
        SwiperItem,
        Tabbar,
        TabbarItem,
        Card,
        Flexbox,
        FlexboxItem,
        Badge,
        Group,
        Cell
    } from 'vux'
    import {
        mapGetters
    } from 'vuex'
    import common from './utils/common'
    import wxUtils from './utils/wxUtils'
    export default {
        components: {
            Swiper,
            SwiperItem,
            Tabbar,
            TabbarItem,
            Card,
            Flexbox,
            FlexboxItem,
            Badge,
            Group,
            Cell
        },
        data() {
            return {
                items: [{
                    link: 'project',
                    image: './static/images/app/icon_nav_cell.png',
                    text: '项目',
                }, {
                    link: 'cservice',
                    image: './static/images/app/icon_nav_article.png',
                    text: '客服'
                }, {
                    link: 'worklog',
                    image: './static/images/app/icon_nav_icons.png',
                    text: '日志'
                }, {
                    link: 'workflow',
                    image: './static/images/app/icon_nav_tab.png',
                    text: '流程'
                }, {
                    link: 'notice',
                    image: './static/images/app/icon_nav_article.png',
                    text: '系统公告'
                }, {
                    link: 'vote/list',
                    image: './static/images/app/icon_nav_dialog.png',
                    text: '活动'
                }],
                selectIndex: 0,
                msgItems: [],
                deviceHeight: "400px",
                isFirst: 0,
                user: {
                    "UserName": '',
                    "PostName": '',
                    "DeptName": '',
                    "GongHao": '',
                    "YearDays": 0,
                    "ServiceDays": 0
                },
            }
        },
        computed: {
            ...mapGetters({
                getMsg: 'getMsgCount'
    
            }),
        },
        watch: {
            '$route': function() {
                document.title = '麦迪科技';
                // console.log(this.$route)
                //检查人员是否登陆成功,如果登陆成功就不再加载人员信息了
                if (this.user && this.user.UserName.length == 0) {
                    this.getUserInfo();
                }
    
                if (this.isFirst == 0) {
                    this.loadMsg();
                }
            }
    
        },
        created() {
            //获取当前设备的高度
    
            this.deviceHeight = (this.$parent.dHeight - 56-50) + 'px';
            // this.deviceHeight = window.screen.height + "px";
    
        },
        mounted: function() {
            console.log("1s")
            // 触发时的操作,需要放置到wx.ready函数中
            var that = this;
            wx.ready(function() {
                wxUtils.getLocation(function(lat, long) {
                    that.$http.post("Common/Login", {
                        "latitude": lat,
                        "longitude": long
                    }).then(function(res) {})
                });
            });
    
            if (this.isFirst == 0) {
                this.loadMsg();
            }
            if (this.user && this.user.UserName.length == 0) {
                this.getUserInfo();
            }
            this.getMsgCount();
    
        },
        methods: {
            getMsgCount() {
                var that = this;
                that.$http.get("Message/GetMsgCount").then((res) => {
    
                    var flowCount = res.data.Data.FlowCount;
                    this.$store.dispatch('SetMsgCount', {
                        flow: flowCount
                    })
                })
            },
            loadMsg() {
                var that = this;
                that.$http.get("Message").then(function(res) {
    
                    if (res.data.length > 0) {
                        that.msgItems = res.data;
                        that.isFirst = 1;
                    }
                });
            },
            go(name) {
                this.$router.push("/" + name);
    
            },
            getUserInfo() {
                var that = this;
                that.$http.get("UserInfo").then(function(success) {
                    if (success.data) {
                        var postData = success.data;
                        var userInfo = that.user;
                        Object.keys(userInfo).forEach(function(key) {
                            that.user[key] = postData[key];
                        })
                    }
                });
            },
    
        }
    
    
    
    }
</script>

<style scoped lang="less">
    .page-bd>.title {
        width: 100%;
        text-align: center;
        margin: 10px 0px;
    }
    
    .msgcontent {
        height: 100%;
    }
    
    .card_bd {
        padding: 10px 15px;
    }
    
    .vux-badge {
        position: absolute;
        right: 10px;
        top: -12px;
        z-index: 100;
    }
    
    .swiperItem {
        height: 100%;
        overflow: auto;
    }
    
    .grid {
        text-align: center;
        padding: 15px;
        border-right: 1px solid lightgray;
        border-bottom: 1px solid lightgray;
    }
    
    .grid img {
        width: 40px;
        height: 40px;
    }
    
    .gird-badge {
        position: relative;
    }
</style>