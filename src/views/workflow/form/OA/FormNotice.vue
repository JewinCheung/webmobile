<template>
    <div>
        <divider>公告-表单</divider>
        <group>
            <cell title="公告类别">{{postJSON.TypeName}}</cell>
            <cell title="公告标题" :inline-desc="postJSON.DocTitle"></cell>
            <cell title="公告详情">
                <div slot="after-title" style="margin-top:10px;" v-html='postJSON.DocContent'> {{ postJSON.DocContent }}
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
    
    // 公告发布流程
    export default {
        name: "formNotice",
        data() {
            return {
                postJSON: {
                    DocTitle: "",
                    TypeName: "",
                    DocContent: ""
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