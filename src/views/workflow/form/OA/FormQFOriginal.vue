<template>
    <div>
        <divider>财务资质原件-表单明细</divider>
        <group>
            <cell title="申请部门">{{postJSON.DeptName}}</cell>
            <cell title="开始时间">{{postJSON.StartTime | substr(10) }}</cell>
            <cell title="结束时间">{{postJSON.EndTime | substr(10) }}</cell>
            <cell title="归还日期">{{postJSON.TheReturnTime | substr(10) }}</cell>
            <cell title="外借事由" :inline-desc="postJSON.Reason"></cell>
        </group>
        <divider>资质原件明细</divider>
        <!--物品申请-->
        <group v-if="subItems.length>0" v-for="item in subItems":key='item.ItemName'>
            <cell title="资质名称">{{item.ItemName}}</cell>
            <cell title="所属公司">{{item.CompName}}</cell>
            <cell title="正副本">{{item.Type}}</cell>
            <cell title="备注">{{item.Memo}}</cell>
        </group>
        <divider>收件信息</divider>
        <group>
            <cell title="领取方式">{{postJSON.AcceptWay}}</cell>
            <cell title="收件人">{{postJSON.AcceptUser}}</cell>
            <cell title="联系电话">{{postJSON.AcceptPhoneNumber}}</cell>
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
        name: "formQFOriginal",
        data() {
            return {
                postJSON: {
                    DeptName: "",
                    Reason: "",
                    StartTime: "",
                    EndTime: "",
                    TheReturnTime: "",
                    Reason: "",
                    AcceptPhoneNumber: "",
                    AcceptUser: "",
                    AcceptPhoneNumber: ""
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
                    var tempData = postData.DetailJsonList;
                    if (tempData && tempData.length > 0) {
                        that.subItems = tempData.split('|').map((item) => {
                            var data = item.split('@');
                            return {
                                ItemName: data[1],
                                CompName: data[2],
                                Type: data[3],
                                Memo: data[4]
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