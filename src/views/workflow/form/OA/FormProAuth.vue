<template>
    <div>
        <divider>项目授权函-表单明细</divider>
        <group>
            <cell title="申请部门">{{postJSON.DeptName}}</cell>
            <cell title="项目名称">{{postJSON.ProDetail}}</cell>
            <cell title="医院名称">{{postJSON.HospName}}</cell>
            <cell title="代理商">{{postJSON.AgentName}}</cell>
            <cell title="销售类型">{{postJSON.SaleTypeCn}}</cell>
            <cell title="开始时间">{{postJSON.StartTime | substr(10) }}</cell>
            <cell title="结束时间">{{postJSON.EndTime | substr(10) }}</cell>
            <cell title="报备时间">{{postJSON.BaoBeiDate | substr(10) }}</cell>
            <cell title="授权公司">{{postJSON.CompanyName}}</cell>
            <cell title="结算方式" :inline-desc="postJSON.ClearingForm"></cell>
            <cell title="备注信息" :inline-desc="postJSON.Memo"></cell>
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
    
    // 项目授权函
    export default {
        name: "formProAuth",
        data() {
            return {
                postJSON: {
                    DeptName: "",
                    ProDetail: "",
                    HospName: "",
                    AgentName: "",
                    SaleTypeCn: "",
                    StartTime: "",
                    EndTime: "",
                    BaoBeiDate: "",
                    CompanyName: "",
                    ClearingForm: "",
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
    
                    var tempData = postData.DetailJsonList;
                    if (tempData && tempData.length > 0) {
                        that.subItems = tempData.split('|').map((item) => {
                            var data = item.split('~');
                            return {
                                ItemName: data[1],
                                Unit: data[2],
                                Num: data[3],
                                Money: data[4],
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