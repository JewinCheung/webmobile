<template>
    <div>
        <divider>采购赠送-表单明细</divider>
        <group>
            <cell title="申请部门">{{postJSON.DeptName}}</cell>
            <cell title="医院名称">{{postJSON.HospName}}</cell>
            <cell title="项目名称">{{postJSON.SubProjecName}}</cell>
            <cell title="合同编号">{{postJSON.ContractNumber}}</cell>
            <cell title="销售">{{postJSON.Saller}}</cell>
            <cell title="变更原因" :inline-desc="postJSON.Memo"></cell>
        </group>
        <divider v-if="subItems.length>0">赠送明细</divider>
        <!--物品申请-->
        <div v-if="subItems.length>0">
            <group v-for="item in subItems" :key='item.MaterialName'>
                <cell title="名称">{{item.MaterialName}}</cell>
                <cell title="数量">{{item.SaleNums+' '+item.Unit}}</cell>
                <cell title="销售单价">{{item.SalePrice}}</cell>
                <cell title="预估价">{{item.PlanPrice}}</cell>
                <cell title="规格" :inline-desc="item.ItemSpecs"></cell>
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
    
    // 资质原件申请
    export default {
        name: "formPurGiving",
        data() {
            return {
                postJSON: {
                    DeptName: "",
                    HospName: "",
                    SubProjecName: "",
                    ContractNumber: "",
                    Saller: "",
                    Memo: ""
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
    
                    var newData = postData.DetailList;
                    if (newData && newData.length > 0) {
                        var temp = JSON.parse(newData);
                        that.subItems = temp.map((item) => {
                            return {
                                MaterialName: item.MaterialName,
                                SaleNums: item.SaleNums,
                                Unit: item.Unit,
                                SalePrice: item.SalePrice,
                                PlanPrice: item.PlanPrice,
                                ItemSpecs: item.ItemSpecs
                            }
                        });
                    }
    
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