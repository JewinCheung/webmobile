<template>
    <div>
        <divider>Wiicare测试流程-表单明细</divider>
        <group>
            <cell title="项目名称">{{postJSON.ProjectName }}</cell>
            <cell title="子系统">{{postJSON.SubSystem}}</cell>
            <cell title="BUG分类">
                <span slot="value">{{postJSON.BugType}}</span>
            </cell>
            <cell title="严重程度">{{postJSON.SeriousLevel}}</cell>
            <cell title="预计完成">{{postJSON.ExpectDate | substr(10)}}</cell>
            <cell title="优先级"> {{postJSON.Priority}}</cell>
            <cell title="平台配置"> {{postJSON.PFConfiguration}}</cell>
            <cell title="实际完成">{{postJSON.EndDate | substr(10)}}</cell>
            <cell title="需求描述">
                <div slot="after-title" style="margin-top:10px;" v-html='postJSON.Memo'> {{ postJSON.Memo }}
                </div>
            </cell>
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
    
    // 研发客户化流程
    export default {
        name: "formDemand",
        data() {
            return {
                postJSON: {
                    ProjectName: "",
                    SubSystem: "",
                    BugType: "",
                    SeriousLevel: "",
                    ExpectDate: "",
                    Priority: "",
                    PFConfiguration: "",
    
                    EndDate: "",
                    Memo: ""
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