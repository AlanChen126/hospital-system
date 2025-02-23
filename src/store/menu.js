const state = {
    isCollapse: false,
    SelectMenu: []
}

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    },
    addMenu(state,payload) {
        if(state.SelectMenu.findIndex(item => item.path === payload.path) === -1) {
            state.SelectMenu.push(payload)
        }
        
        
    },
    closeTab(state,payload){
        const index = state.SelectMenu.findIndex(item => item.path === payload.path)
        state.SelectMenu.splice(index,1)
    }
}

export default {
    state,
    mutations
}