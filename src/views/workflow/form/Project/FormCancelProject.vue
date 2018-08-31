<template>
    <div>
        <divider>项目作废-表单明细</divider>
        <group>
            <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
            <cell title="当前阶段">{{postJSON.StageName}}</cell>
            <cell title="作废原因" :inline-desc="postJSON.CancelReason"></cell>
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
        name: "formCancelProject",
        data() {
            return {
                postJSON: {
                    ProjectName: "",
                    StageName: "",
                    CancelReason: ""
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