<!--物品领用流程表单-->
<template>
    <div>
        <divider>办公用品领用-表单明细</divider>
        <group title="">
            <cell title="用品类型">{{postJSON.TypeName}}</cell>
            <cell title="申请部门">{{postJSON.DeptName }}</cell>
            <cell title="申请时间">{{postJSON.ApplyTime | substr(10)}}</cell>
            <cell title="原因用途" :inline-desc="postJSON.Memo"></cell>
        </group>
        <divider>明细信息</divider>
        <group v-for="item in detailList" :key='item.MatName'>
            <cell title="物品名称">{{item.MatName}}</cell>
            <cell title="物品规格">{{item.MatSpecs}}</cell>
            <cell title="物品单位">{{item.MatUnit}}</cell>
            <cell title="领取数量">{{item.Nums}}</cell>
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
    
    
    // 办公用品申请流程
    export default {
        name: "formOfficeApply",
        data() {
            return {
                postJSON: {
                    TypeName: "",
                    ApplyTime: "",
                    Memo: "",
                    DeptName: ""
                },
                detailList: []
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
                    this.postJSON = postData;
                    var tempDetail = postData.OfficeSDJsonList;
                    if (tempDetail.length > 0) {
                        // 拆分格式
                        var detaiInfo = JSON.parse(tempDetail);
                        this.detailList = detaiInfo.map((item) => {
                            return {
                                MatName: item.ProTypeName,
                                MatSpecs: item.ProSize,
                                MatUnit: item.ProUnit,
                                Nums: item.Pronumber
    
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