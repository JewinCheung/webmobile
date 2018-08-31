<template>
    <div class="page konwn">
        <!-- <x-header :left-options="{showBack:true,backText:'返回',preventGoBack:true}" @on-click-back="backIndex()">
            {{title}}
        </x-header> -->
        <div class="weui-tab-bd">
           还没有内容哦
        </div>
    </div>
</template>


<script lang="babel">

     import {XHeader} from 'vux'
    export default {
        name:'konwn',
        data () {
            return {
                title:'',
                content:''
            }
        },
        components:{
            XHeader
        },
        methods:{
            backIndex () {
                this.$router.push("/index");
            }
        }
    }
</script>