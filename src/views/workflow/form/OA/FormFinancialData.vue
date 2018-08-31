<template>
    <div>
        <divider> 财务数据资料-表单明细</divider>
        <group>
            <cell title="申请部门">{{postJSON.DeptName}}</cell>
            <cell title="最晚时间">{{postJSON.DemandTime | substr(10)}}</cell>
            <cell title="是否盖章">{{postJSON.IsSeal==1?"是":"否"}}</cell>
            <cell title="备注信息" :inline-desc="postJSON.Memo"></cell>
        </group>
        <divider>资料明细</divider>
        <!--物品申请-->
        <group v-if="subItems.length>0" v-for="item in subItems":key='item.ItemName'>
            <cell title="名称">{{item.ItemName}}</cell>
            <cell title="年度">{{item.YearFlag}}</cell>
            <cell title="类型">{{item.Type}}</cell>
            <cell title="公司">{{item.CompName}}</cell>
            <cell title="备注">{{item.Memo}}</cell>
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
    
    // 资质原件申请
    export default {
        name: "formInvoiceApply",
        data() {
            return {
                postJSON: {
                    DeptName: "",
                    DemandTime: "",
                    IsSeal: "",
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
    
                    var tempData = postData.DetailJsonList;
                    if (tempData && tempData.length > 0) {
                        that.subItems = tempData.split('|').map((item) => {
                            var data = item.split('@');
                            return {
                                ItemName: data[1],
                                YearFlag: data[2],
                                Type: data[3],
                                CompName: data[4],
                                Memo: data[5]
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