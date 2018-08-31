<template>
    <div>
        <divider>项目报销-表单明细</divider>
        <group>
            <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
            <cell title="申请部门">{{postJSON.ApplyDept}}</cell>
            <cell title="费用归属部门">{{postJSON.DeptName}}</cell>
            <cell title="费用归属人">{{postJSON.CostUName}}</cell>
            <cell title="总计金额">{{postJSON.AllMoney}}</cell>
            <cell title="备注" :inline-desc="postJSON.Memo"></cell>
        </group>
        <divider>报销费用明细</divider>
        <!--物品申请-->
        <group v-if="subItems.length>0" v-for="item in subItems":key='item.DictTypeName'>
            <cell title="费用主类">{{item.DictTypeName}}</cell>
            <cell title="子分类">{{item.DetailName}}</cell>
            <cell title="报销金额">{{item.DetailMoney}}</cell>
            <cell title="核准金额">{{item.ApproveMoney}}</cell>
            <cell title="出发时间" v-show="item.StartDate">{{item.StartDate | substr(16)}}</cell>
            <cell title="到达时间" v-show="item.EndDate">{{item.EndDate | substr(16)}}</cell>
            <cell title="交通工具" v-show="item.TrafficTools">{{item.TrafficTools}}</cell>
            <cell title="出发地" v-show="item.StartAddr">{{item.StartAddr}}</cell>
            <cell title="目的地" v-show="item.EndAddr">{{item.EndAddr}}</cell>
            <cell title="住宿天数" v-show="item.StayDays">{{item.StayDays +" 天"}}</cell>
            <cell title="耗时" v-show="item.TrafficHour">{{item.TrafficHour}}</cell>
            <cell title="备注" :inline-desc="item.Memo"></cell>
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
        name: "formProExpense",
        data() {
            return {
                postJSON: {
                    ProjectName: "",
                    ApplyDept: "",
                    DeptName: "",
                    CostUName: "",
                    AllMoney: "",
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
                        if (typeof newData == "string") {
                            that.subItems = JSON.parse(newData);
                        } else {
                            that.subItems = newData;
                        }
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