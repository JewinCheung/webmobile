<template>
    <div>
        <divider>临时撤场-表单明细</divider>
        <group>
            <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
            <cell title="撤场时间">{{postJSON.TempDate | substr(10)}}</cell>
            <cell title="预计入场时间">{{postJSON.PlanEnterDate}}</cell>
            <cell title="撤场原因" :inline-desc="postJSON.TempReason"></cell>
            <cell title="当前进度状况" :inline-desc="postJSON.CurrentInfo"></cell>
        </group>
        <divider v-if="postJSON.IsTemp">重新入场-表单明细</divider>
        <group v-if="postJSON.IsTemp">
            <cell title="入场时间">{{postJSON.EnterDate | substr(10)}}</cell>
            <cell title="解决方案" :inline-desc="postJSON.Solution"></cell>
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
    
    
    // 临时撤场流程
    export default {
        name: "formTempleave",
        data() {
            return {
                postJSON: {
                    ProjectName: "",
                    TempDate: "",
                    PlanEnterDate: "",
                    TempReason: "",
                    CurrentInfo: "",
                    Solution: "",
                    EnterDate: "",
                    IsTemp: false
                }
            }
        },
    
    
        computed: {
            ...mapGetters({
                formJSON: 'getFormJSON'
            })
        },
        // watch: {
        //   '$route': 'loadInfo'
        // },
        // mounted: function() {
        //   this.loadInfo();
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