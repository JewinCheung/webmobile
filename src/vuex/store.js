import Vue from 'vue'
import Vuex from 'vuex'
import * as getters from './getters'
import * as actions from './actions'
Vue.use(Vuex)

const state = {

    // TODO: 放置初始状态
    formJSON: {},
    // 路由名称
    routeName: "/",
    //  消息通知
    msgCount: {
        flow: 0
    },
    routeInfo:{
        routeName: "/",
        params:1,
    },
    //活动分组信息
    VoteGroup:[],
    VoteInfo:{},
    
}
// 创建一个对象存储一系列我们接下来要写的 mutation 函数
const mutations = {
    // TODO: 放置我们的状态变更函数
    SetForm(state, formJSON) {
        console.log("表单重新赋值出发了");
        state.formJSON = formJSON;
    },
    SetRoute(state, routeInfo) {
        state.routeInfo=routeInfo
    },
    SET_SYSHEIGHT(state, height) {
        state.height = height;
    },
    SetMsgCount(state, msgcount) {
        state.msgCount = msgcount;
    },
    MinusMsg(state) {
        state.msgCount.flow = state.msgCount.flow == 0 ? 0 : (state.msgCount.flow - 1);
    },

    SetVoteGroup(state,VoteGroup){
        state.VoteGroup=VoteGroup;
    },
    SetVoteInfo(state,Vote){
        state.VoteInfo=Vote;
    }




}


// 整合初始状态和变更函数，我们就得到了我们所需的 store
// 至此，这个 store 就可以连接到我们的应用中
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    
})

