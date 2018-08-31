<template>
    <div>
        <divider>项目经理变更-表单明细</divider>
        <group>
            <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
            <cell title="当前阶段">{{postJSON.StageName}}</cell>
            <cell title="项目金额">{{postJSON.ProjectMoney}}</cell>
            <cell title="原项目经理">{{postJSON.OldManagerName}}</cell>
            <cell title="新项目经理">{{postJSON.NewManagerName}}</cell>
            <cell title="变更原因" :inline-desc="postJSON.Reason"></cell>
            <cell title="风险预测" :inline-desc="postJSON.ExistRisk"></cell>
            <cell title="后续安排" :inline-desc="postJSON.AfterWork"></cell>
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
    
    // 项目经理变更流程
    export default {
        name: "formPManagerChage",
        data() {
            return {
                postJSON: {
                    ProjectName: "",
                    StageName: "",
                    ProjectMoney: "",
                    OldManagerName: "",
                    NewManagerName: "",
                    Reason: "",
                    ExistRisk: "",
                    AfterWork: ""
                }
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
                    })
    
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