<template>
    <div>
        <divider>加密狗申请-表单明细</divider>
        <group>
            <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
            <cell title="申请类别">{{postJSON.UseTypeName +'-'+postJSON.DogTypeName}}</cell>
            <cell title="合同编号">{{postJSON.ContractNumber}}</cell>
            <cell title="销售人员">{{postJSON.Saller}}</cell>
            <cell title="加密狗类别">{{postJSON.MatName}}</cell>
            <cell title="采集方式">{{postJSON.USBType}}</cell>
            <cell title="床位数">{{postJSON.BedNums}}</cell>
            <cell title="申请数量">{{postJSON.Number}}</cell>
            <cell title="备注" :inline-desc="postJSON.Memo"></cell>
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
    
    // 项目经理变更流程
    export default {
        name: "formEncryptedDog",
        data() {
            return {
                postJSON: {
                    ProjectName: "",
                    UseTypeName: "",
                    DogTypeName: "",
                    Saller: "",
                    ContractNumber: "",
                    MatName: "",
                    USBType: "",
                    Number: 0,
                    BedNums: 0,
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