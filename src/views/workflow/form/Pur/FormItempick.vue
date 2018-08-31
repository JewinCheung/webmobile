<template>
    <div>
        <divider>非项目采购申请-表单</divider>
        <group>
            <cell title="申请部门">{{postJSON.ApplyDeptName}}</cell>
            <cell title="申请原因" :inline-desc="postJSON.Reason">
            </cell>
        </group>
        <divider v-if="applyItems.length>0">申请明细</divider>
        <!--物品申请-->
        <div v-if="applyItems.length>0">
            <group v-for="item in applyItems" :key='item.ItemName'>
                <cell title="物料名称">{{item.ItemName}}</cell>
                <cell title="品牌">{{item.ItemBrand}}</cell>
                <cell title="规格">{{item.ItemSpec}}</cell>
                <cell title="申请数量">{{item.ApplyNum}}</cell>
            </group>
        </div>
        <divider v-if="purItems.length>0">采购明细</divider>
        <!--采购-->
        <div v-if="purItems.length>0">
            <group v-for="item in purItems" :key='item.ItemName'>
                <cell title="物料名称">{{item.ItemName}}</cell>
                <cell title="品牌">{{item.ItemBrand}}</cell>
                <cell title="规格">{{item.ItemSpec}}</cell>
                <cell title="采购数量">{{item.PurchaseNum}}</cell>
                <cell title="预计价格">{{item.PrePrice}}</cell>
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
    
    // 物品领用
    export default {
        name: "formItempick",
        data() {
            return {
                postJSON: {
                    ApplyDeptName: "",
                    Reason: "",
                },
                //申请明细
                applyItems: [],
                //采购明显
                purItems: []
            }
        },
        computed: {
            ...mapGetters({
                formJSON: 'getFormJSON'
            })
        },
        // watch: {
        //   '$route': 'loadInfo'
        // },
        // mounted: function() {
        //   this.loadInfo();
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
                    this.applyItems = [];
                    this.purItems = [];
                    var postData = JSON.parse(this.formJSON.FlowJson);
                    var tempJson = this.postJSON;
                    var that = this;
    
                    Object.keys(tempJson).forEach(function(key) {
                        that.postJSON[key] = postData[key] || "";
                    })
                    // 设置明细表
                    var subData = postData.DetailList;
                    if (subData.length == 0) {
                        return false;
                    }
                    subData = JSON.parse(subData);
                    console.log(subData);
                    subData.forEach((item) => {
                        if (item.ItemType == 0) {
                            that.applyItems.push({
                                ItemName: item.ItemName,
                                ItemBrand: item.ItemBrand,
                                ItemSpec: item.ItemSpec,
                                ApplyNum: item.ApplyNum,
                                PurchaseNum: item.PurchaseNum,
                                PrePrice: item.PrePrice
                            })
                        } else {
                            that.purItems.push({
                                ItemName: item.ItemName,
                                ItemBrand: item.ItemBrand,
                                ItemSpec: item.ItemSpec,
                                ApplyNum: item.ApplyNum,
                                PurchaseNum: item.PurchaseNum,
                                PrePrice: item.PrePrice
                            })
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