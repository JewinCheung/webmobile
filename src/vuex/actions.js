// action 会收到 store 作为它的第一个参数
// 既然我们只对事件的分发（dispatch 对象）感兴趣。（state 也可以作为可选项放入）
// 我们可以利用 ES6 的解构（destructuring）功能来简化对参数的导入
export const SetFormData = ({ commit }, payload) => {
    commit('SetForm', payload)
}

//设置路由信息
export const SetRouteData = ({ commit }, payload) => {
    commit('SetRoute', payload)
}

// 设置消息数量
export const SetMsgCount = ({ commit }, payload) => {
    commit('SetMsgCount', payload);
}

//消息已阅
export const MinusMsg = ({ commit }) => {
    commit('MinusMsg');
}

//设置活动分组
export const SetVoteGroup = ({ commit }, payload,VoteTielt) => {
    commit('SetVoteGroup', payload,VoteTielt)
}

//设置活动信息
export const SetVoteInfo = ({ commit }, payload) => {
    commit('SetVoteInfo', payload)
}


