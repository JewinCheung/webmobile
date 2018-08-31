<template>
    <div>
        <divider>售后客户化研发流程-表单明细</divider>
        <group>
            <cell title="医院名称">{{postJSON.HospName | substr(12)}}</cell>
            <cell title="项目名称">{{postJSON.ProjectName | substr(12,true)}}</cell>
            <cell title="产品线">
                <span slot="value">{{postJSON.ProLine}}</span>
            </cell>
            <cell title="需求类别">{{postJSON.UrType ==0?'售后':'履约'}}</cell>
            <cell title="期望交付时间">{{postJSON.ExpectTime | substr(10)}}</cell>
            <cell title="需求来源">
                <div slot="after-title" style="margin-top:10px;color:blue;"> {{postJSON.UrSource}}
                </div>
            </cell>
            <cell title="需求背景">
                <div slot="after-title" style="margin-top:10px;color:blue;"> {{ postJSON.UrBackground }}
                </div>
            </cell>
            <cell title="需求描述">
                <div slot="after-title" style="margin-top:10px;" v-html='postJSON.UrDesc'> {{ postJSON.UrDesc }}
                </div>
            </cell>
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
    
    // 研发客户化流程
    export default {
        name: "formDemand",
        data() {
            return {
                postJSON: {
                    HospName: "",
                    ProjectName: "",
                    ProLine: "",
                    UrType: "",
                    ExpectTime: "",
                    UrSource: "",
                    UrBackground: "",
                    UrDesc: ""
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
                    console.log(postData);
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