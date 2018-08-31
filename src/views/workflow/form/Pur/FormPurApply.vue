<template>
    <div>
        <divider>项目采购申请-表单</divider>
        <group>
            <cell title="医院名称">{{postJSON.HospName | substr(12)}}</cell>
            <cell title="项目名称">{{postJSON.ProjectName | substr(12,true)}}</cell>
            <cell title="合同编号">
                <span slot="value">{{postJSON.ContractNumber}}</span>
            </cell>
            <cell title="销售人员">{{postJSON.Saller}}</cell>
            <cell title="隶属部门">{{postJSON.DeptName}}</cell>
        </group>
        <divider>申请明细</divider>
        <group v-if="items.length>0" v-for="item in items":key='item.productName'>
            <cell title="产品名称">{{item.productName}}</cell>
            <cell title="总数量">{{item.allNums+' 个'}}</cell>
            <cell title="申请数量">{{item.applyNums+' 个'}}</cell>
            <cell title="销售小计">{{item.allPrice}}</cell>
            <cell title="到货时间">{{item.arrivalTime | substr(10)}}</cell>
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
    
    // 项目采购申请
    export default {
        name: "formPurApply",
        data() {
            return {
                postJSON: {
                    HospName: "",
                    ProjectName: "",
                    ContractNumber: "",
                    Saller: "",
                    DeptName: "",
                    ApplyUser: "",
                },
                items: []
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
    
                    var subData = postData.DetailList;
    
                    if (subData.length == 0) {
                        return false;
                    }
                    subData = JSON.parse(subData);
                    subData.forEach((item) => {
                        that.items.push({
                            productName: item.HardName,
                            allNums: item.AllNum,
                            applyNums: item.ApplyNum,
                            arrivalTime: item.PlanArrivalTime,
                            allPrice: item.UnitPrice * item.ApplyNum
                        })
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