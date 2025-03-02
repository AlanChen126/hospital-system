import { createStore } from 'vuex'
import menu from './menu'
import createPersistedState from "vuex-persistedstate";

export default createStore({
    // 实现vuex数据的持久化存储，存储在localStorage中，刷新后不会初始化数据
    plugins: [new createPersistedState({
        key:'pz'
    })],
    modules: {
        menu
    }
})
