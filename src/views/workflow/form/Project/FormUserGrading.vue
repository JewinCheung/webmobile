<template>
    <div>
        <divider>项目经理晋级-表单明细</divider>
        <group>
            <cell title="申请日期">{{ postJSON.ApplyTime | substr(10) }}</cell>
            <cell title="所在部门">{{postJSON.DeptName}}</cell>
            <cell title="入职日期">{{ postJSON.EntryDate | substr(10) }}</cell>
            <cell title="当前级别">{{postJSON.PostLevel}}</cell>
            <cell title="原级别日期">{{ postJSON.PostCreateDate | substr(10) }}</cell>
            <cell title="申请方式">{{postJSON.ApplyType}}</cell>
            <cell title="申请级别">{{postJSON.ApplyPostName}}</cell>
            <cell title="采用依据">{{postJSON.GistTypeName}}</cell>
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
    
    // 项目经理晋级流程
    export default {
        name: "formUserGrading",
        data() {
            return {
                postJSON: {
                    ApplyTime: "",
                    DeptName: "",
                    EntryDate: "",
                    PostLevel: "",
                    PostCreateDate: "",
                    ApplyType: "",
                    ApplyPostName: "",
                    GistTypeName: ""
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