const localData = localStorage.getItem('pz')

const state = localData ? localData.menu : {
    isCollapse: false,
    SelectMenu: [],
    routerList:[]
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
    },
    dynamicsMenu(state,payload){
        // 通过glob导入文件
        const views = import.meta.glob('../views/**/*.vue');
        console.log(views,'views')
        console.log(payload,'payload')

        function routerSet(router){
            router.forEach(route => {
                // 没有子菜单，拼接路由数据
                if(!route.children){
                    const url = `../views${route.meta.path}/index.vue`
                    // 拿到获取的vue页面组件
                    route.component = views[url]
                }else{
                    // 有子菜单的话就递归调用
                    routerSet(route.children)
                }
            });
        }
        routerSet(payload)
        // 拿到完整的路由数据
        state.routerList = payload
        // console.log(state.routerList,'state.routerList')
    }
}

export default {
    state,
    mutations
}