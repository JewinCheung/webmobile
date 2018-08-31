<template>
    <div>
        <divider>发票申请-表单明细</divider>
        <group>
            <cell title="申请部门">{{postJSON.DeptName}}</cell>
            <cell title="紧急程度">{{postJSON.EmergencyType}}</cell>
            <cell title="开票公司">{{postJSON.InvoiceComp}}</cell>
            <cell title="医院名称">{{postJSON.HospName}}</cell>
            <cell title="发票抬头">{{postJSON.CustomerName}}</cell>
            <cell title="合同编号">{{postJSON.ContractNumber}}</cell>
            <cell title="合同金额">{{postJSON.ContractAmounts }}</cell>
            <cell title="项目名称" :inline-desc="postJSON.ContractName"></cell>
            <cell title="开票总额">{{postJSON.ProTotalAmount}}</cell>
            <cell title="备注信息" :inline-desc="postJSON.Reason"></cell>
        </group>
        <divider v-if="postJSON.TaxpayerCode.length>0">增值税专用发票</divider>
        <group v-if="postJSON.TaxpayerCode.length>0">
            <cell title="是否专用">{{postJSON.IsSpecial==0?"否":"是"}}</cell>
            <cell title="纳税人识别号">{{postJSON.TaxpayerCode}}</cell>
            <cell title="开户银行">{{postJSON.BankName}}</cell>
            <cell title="银行账号">{{postJSON.AccountNumber}}</cell>
            <cell title="发票电话">{{postJSON.PhoneNumber}}</cell>
            <cell title="发票地址" :inline-desc="postJSON.Address"></cell>
        </group>
        <divider>发票明细</divider>
        <!--物品申请-->
        <group v-if="subItems.length>0" v-for="item in subItems":key='item.ItemName'>
            <cell title="软件名称" :inline-desc="item.ItemName"></cell>
            <cell title="数量">{{item.Num +' '+item.Unit}}</cell>
            <cell title="金额">{{item.Money}}</cell>
            <cell title="备注">{{item.Memo}}</cell>
        </group>
        <divider>收件信息</divider>
        <group>
            <cell title="领取方式">{{postJSON.AcceptWay}}</cell>
            <cell title="收件人">{{postJSON.AcceptUser}}</cell>
            <cell title="联系电话">{{postJSON.AcceptPhoneNumber}}</cell>
            <cell title="发票地址" :inline-desc="postJSON.DetailAddress"></cell>
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
                    EmergencyType: "",
                    InvoiceComp: "",
                    HospName: "",
                    CustomerName: "",
                    ContractNumber: "",
                    ContractAmounts: "",
                    ContractName: "",
                    ProTotalAmount: "",
                    Reason: "",
                    IsSpecial: "",
                    TaxpayerCode: "",
                    CustomerName: "",
                    BankName: "",
                    ContractAmounts: "",
                    AccountNumber: "",
                    PhoneNumber: "",
                    Address: "",
                    AcceptWay: "",
                    AcceptUser: "",
                    AcceptPhoneNumber: "",
                    DetailAddress: ""
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