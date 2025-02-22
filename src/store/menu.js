const state = {
    isCollapse: false,
    SelectMenu: []
}

const mutations = {
    collapseMenu(state) {
        state.isCollapse = !state.isCollapse
    }
}

export default {
    state,
    mutations
}