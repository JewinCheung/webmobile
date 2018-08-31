<template>
    <div>
        <divider>合同拆分-合同明细</divider>
        <group>
            <cell title="子合同名称" :inline-desc="postJSON.ProName"></cell>
            <cell title="医院名称">{{postJSON.HospName}}</cell>
            <cell title="销售">{{postJSON.Saller}}</cell>
            <cell title="合同编号">{{postJSON.ContractNumber}}</cell>
            <cell title="产品线/版本">{{postJSON.ProductLineName +'-'+postJSON.Version}}</cell>
            <cell title="合同金额">{{postJSON.Amounts}}</cell>
            <cell title="安装单位">{{postJSON.BedNum}}</cell>
            <cell title="签约时间">{{postJSON.ContractDate | substr(10)}}</cell>
            <cell title="剩余金额">{{postJSON.SurplusMoney}}</cell>
            <cell title="剩余床位">{{postJSON.SurplusNum}}</cell>
            <cell title="总监备注" :inline-desc="postJSON.AllocateMemo"></cell>
        </group>
        <divider>合同拆分-项目明细</divider>
        <!--物品申请-->
        <group>
            <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
            <cell title="项目经理">{{postJSON.ProManagerName}}</cell>
            <!--<cell title="项目类型">{{postJSON.DeptName}}</cell>-->
            <!--<cell title="医院科室">{{postJSON.CostUName}}</cell>
                    <cell title="项目属性">{{postJSON.AllMoney}}</cell>-->
            <cell title="项目期限">{{postJSON.Cycle}}</cell>
            <cell title="项目金额">{{postJSON.ProjectMoney}}</cell>
            <cell title="安装单位">{{postJSON.InstallUnit}}</cell>
            <cell title="项目备注" :inline-desc="postJSON.Memo"></cell>
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
    
    // 项目报销流程
    export default {
        name: "formSplitContract",
        data() {
            return {
                postJSON: {
                    HospName: "",
                    Saller: "",
                    ContractNumber: "",
                    ProductLineName: "",
                    Version: "",
                    Amounts: 0,
                    BedNum: 0,
                    ContractDate: "",
                    SurplusMoney: "",
                    SurplusNum: 0,
                    AllocateMemo: "",
                    ProjectName: "",
                    ProManagerName: "",
                    DeptName: "",
                    Cycle: "",
                    ProjectMoney: 0,
                    InstallUnit: 0,
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
                        if (typeof postData[key] == "number") {
                            that.postJSON[key] = postData[key]
                        } else {
                            that.postJSON[key] = postData[key] || "";
                        }
                    });
    
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