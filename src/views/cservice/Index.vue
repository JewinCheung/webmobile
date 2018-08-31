<template>
    <div class="page cservice">
        <box gap="10px 10px">
            <x-button @click.native="goNew" type="primary">新增</x-button>
        </box>
        <tab>
            <tab-item :selected="selectIndex === 0" @click.native="selectIndex = 0">
                待处理
            </tab-item>
            <tab-item :selected="selectIndex === 1" @click.native="selectIndex = 1">
                流程中
            </tab-item>
            <tab-item :selected="selectIndex === 2" @click.native="selectIndex = 2">
                已完结
            </tab-item>
        </tab>
        <swiper v-model="selectIndex" height="521px" :show-dots="false">
            <swiper-item class="swiperItem">
                <group title="待处理">
                    <cell v-for="item in waitData" :key="item.name" is-link :title="item.HospName" :link="{path:'/cservice/newcswork',query:{'dispNo':item.DispNo}}">
                    </cell>
                </group>
            </swiper-item>
            <swiper-item class="swiperItem">
                <group title="流程中">
                </group>
            </swiper-item>
            <swiper-item class="swiperItem">
                <group title="已完结">
                </group>
            </swiper-item>
        </swiper>
    
    </div>
</template>

<script lang="babel">
    import {
        XHeader,
        Group,
        Cell,
        Box,
        XButton,
        Tab,
        TabItem,
        Swiper,
        SwiperItem
    } from 'vux'
    export default {
        name: 'cservice',
        //初始化数据
        data() {
            return {
                selectIndex: 0,
                // 待处理的任务
                waitData: []
            }
        },
        beforeRouteEnter: function(to, from, next) {
            next(vm => {
                vm.loadinfo();
            })
        },
        components: {
            XHeader,
            Group,
            Cell,
            Tab,
            TabItem,
            Swiper,
            SwiperItem,
            Box,
            XButton
        },
        methods: {
            loadinfo() {
                //加载当前人员的数据
                this.$http.get("CService/GetRecords/1").then((response) => {
                    this.waitData = response.data;
                }, (error) => {
    
                })
    
            },
            goNew() {
                this.$router.push('/cservice/newcswork');
            }
    
        }
    
    }
</script>