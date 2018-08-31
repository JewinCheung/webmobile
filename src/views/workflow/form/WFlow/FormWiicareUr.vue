<template>
    <div>
        <divider>表单明细</divider>
        <group>
            <cell title="医院名称">{{postJSON.HospName}}</cell>
            <cell title="项目名称" :inline-desc="postJSON.ProjectName"></cell>
            <cell title="需求分类">{{postJSON.UrCategory }}</cell>
            <cell title="所属模块">{{postJSON.UrModel }}</cell>
            <cell title="需求标签">{{postJSON.UrLabels }}</cell>
            <cell title="优先级/系数">{{ getUrLevel(postJSON.UrLevel,postJSON.UrDifficulty) }}</cell>
            <cell title="期望时间">{{postJSON.ExceptDate | substr(10)}}</cell>
            <cell title="预计完成">{{postJSON.PreEndDate | substr(10)}}</cell>
            <cell title="方案策略" v-if="postJSON.SuggestDesc.length>0">{{postJSON.Suggest+' '+postJSON.SuggestType }}</cell>
            <cell title="建议及描述" v-if="postJSON.SuggestDesc.length>0" :inline-desc="postJSON.SuggestDesc"></cell>
            <cell title="备注信息" v-html='postJSON.SrcDesc'>
                {{postJSON.SrcDesc}}
            </cell>
        </group>
        <divider v-if="subItems.length>0">研发修改明显</divider>
        <group v-if="subItems.length>0" v-for="item in subItems":key='item.Component'>
            <cell title="分类">{{item.Component}}</cell>
            <cell title="变更类别">{{item.CompType}}</cell>
            <cell title="变更文件" :inline-desc="item.CompDesc"></cell>
            <cell title="发布版本" v-if="item.PubVersion">{{item.PubVersion}}</cell>
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
        name: "formWiicareUr",
        data() {
            return {
                postJSON: {
                    HospName: "",
                    ProjectName: "",
                    UrCategory: "",
                    UrModel: "",
                    UrLabels: "",
                    UrLevel: "",
                    ExceptDate: "",
                    PreEndDate: "",
                    Suggest: "",
                    SuggestType: "",
                    SuggestDesc: "",
                    UrDifficulty: "",
                    SrcDesc: ""
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
                    console.log(postData);
                    var tempJson = this.postJSON;
                    var that = this;
    
                    Object.keys(tempJson).forEach(function(key) {
                        that.postJSON[key] = postData[key] || "";
                    });
                    var tempData = postData.Components;
                    if (tempData && tempData.length > 0) {
                        that.subItems = tempData.map((item) => {
                            return {
                                Component: that.getComponent(item.Component),
                                CompType: item.CompType,
                                CompDesc: item.CompDesc,
                                PubVersion: item.PubVersion
                            }
                        });
                    }
    
                } else {
                    this.$router.push("/workflow")
                }
    
            },
            getComponent(component) {
                switch (component) {
                    case "ui":
                        return "前端页面";
                    case "db":
                        return "数据表";
                    case "other":
                        return "其他";
                    case "serv":
                        return "后端服务"
                }
            },
            getUrLevel(flag, diff) {
                console.log(flag);
                switch (flag) {
                    case 0:
                        return "无" + '/' + diff;
                    case 1:
                        return "低" + '/' + diff;
                    case 2:
                        return "中" + '/' + diff;
                    case 3:
                        return "高" + '/' + diff;
                    case 4:
                        return "加急" + '/' + diff;
                    default:
                        return "无:" + '/' + diff;
                }
            }
        },
        components: {
            Cell,
            Group,
            Divider
        }
    }
</script>