<template>
    <div>
        <divider>客服回访流程-表单明细</divider>
        <group>
            <cell title="医院名称">{{postJSON.HospName}}</cell>
            <cell title="联系人">{{postJSON.ContactUser}}</cell>
            <cell title="联系电话">{{postJSON.ContactTel}}</cell>
            <cell title="产品线">{{postJSON.Product}}</cell>
            <cell title="处理方式">{{getExecMethod(postJSON.ExecMethod)}}</cell>
            <cell title="完成时间">{{postJSON.CompleteTime | substr(10)}}</cell>
            <cell title="问题描述" :inline-desc="postJSON.QuesDesc"></cell>
            <cell title="解决方案" :inline-desc="postJSON.Solution"></cell>
        </group>
        <divider>问题明细</divider>
        <!--物品申请-->
        <div v-if="subItems.length>0">
            <group v-for="item in subItems" :key='item.type'>
                <cell title="故障类别">{{item.type}}</cell>
                <cell title="产品线" v-if="item.line.length>0">{{item.line }}</cell>
                <cell title="故障点">{{item.info }}</cell>
                <cell title="功能" v-if="item.func.length>0">{{item.func}}</cell>
            </group>
        </div>
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
    // 售后纸质文档回寄流程
    export default {
        name: "fromBackvisit",
        data() {
            return {
                postJSON: {
                    HospName: "",
                    ContactUser: "",
                    ContactTel: "",
                    Product: "",
                    ExecMethod: "",
                    CompleteTime: "",
                    QuesDesc: "",
                    Solution: "",
                    Product: "",
                    ExecMethod: ""
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
            loadInfo() {
                if (this.formJSON.FlowJson) {
                    // 设置主表
                    var postData = JSON.parse(this.formJSON.FlowJson);
                    var tempJson = this.postJSON;
                    var that = this;
    
                    Object.keys(tempJson).forEach(function(key) {
                        that.postJSON[key] = postData[key] || "";
                    });
    
                    var newData = postData.FaultInfo;
                    if (newData && newData.length > 0) {
                        var jsonData = JSON.parse(newData);
                        this.subItems = jsonData;
                    }
    
                } else {
                    this.$router.push("/workflow")
                }
    
            },
            getExecMethod(value) {
                if (value == "CLFS0001") {
                    return "远程处理"
                } else if (value == "CLFS0002") {
                    return "现场处理"
                } else if (value == "CLFS0003") {
                    return "转交他人";
                } else if (value == "CLFS0004") {
                    return "电话维护"
                }
            }
        },
        components: {
            Cell,
            Group,
            Divider
        }
    }
</script>