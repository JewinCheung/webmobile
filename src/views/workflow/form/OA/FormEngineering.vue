<template>
    <div>
        <divider>办公大楼物品维修-表单明细</divider>
        <group>
            <cell title="所在楼层">{{postJSON.Floor +'-'+ postJSON.FloorNum}}</cell>
            <cell title="具体位置">{{postJSON.Location}}</cell>
            <cell title="保修类别">{{postJSON.RepairType}}</cell>
            <cell title="故障类别">{{postJSON.RepairType}}</cell>
            <cell title="申请部门">{{postJSON.DeptName}}</cell>
            <cell title="联系方式">{{postJSON.TelPhone}}</cell>
            <cell title="故障描述" :inline-desc="postJSON.FaultDesc"></cell>
            <cell title="维修总结" :inline-desc="postJSON.Summary"> </cell>
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
    
    // 办公大楼物品维修
    export default {
        name: "formEngineering",
        data() {
            return {
                postJSON: {
                    Floor: "",
                    FloorNum: "",
                    DeptName: "",
                    Location: "",
                    RepairType: "",
                    RepairDesc: "",
                    TelPhone: "",
                    FaultDesc: "",
                    Summary: ""
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