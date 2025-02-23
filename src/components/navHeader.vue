<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20px" @click="store.commit('collapseMenu')">
                <component :is="isCollapse ? Expand : Fold"></component>
            </el-icon>
            <ul class="flex-box">
                <li v-for="(item,index) in SelectMenu" 
                    :key="item.path"
                    :class="{selected : item.path === route.path}"
                    @click="navigateTo(item.path)"
                    class="flex-box tab"
                    >
                    <el-icon class="icon1" size="12px">
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span class="text">{{item.name}}</span>
                    <el-icon class="icon1 close" size="12px" @click="closeTab(item,index)">
                        <Close />
                    </el-icon>
                </li>
            </ul>
        </div>
        <div class="header-right">
            <el-dropdown>
                <div class="el-dropdown-link flex-box">
                    <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    <p class="username"> admin</p>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { computed } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { Expand, Fold } from '@element-plus/icons-vue'
// 先拿到store的实例，然后调用在store中定义的方法
const store = useStore()
const route = useRoute()
const router = useRouter()
const isCollapse = computed(() => store.state.menu.isCollapse);
const SelectMenu = computed(() => store.state.menu.SelectMenu)

const navigateTo = (path) => {
    router.push(path)
}

// 点击关闭tab
const closeTab = (item,index) => {
    event.stopPropagation();// 阻止事件冒泡
    store.commit('closeTab',item)
    if(route.path !== item.path){
        return
    }
    const SelectData = SelectMenu.value
        
    if(!SelectData.length){
        router.push('/')
    }else{
        // 如果关闭的是最后一个tab，则跳转到前一个tab
        if(index === SelectData.length){
            router.push(SelectData[index - 1].path)
        }else{
            router.push(SelectData[index].path)
        }
    }

}
</script>

<style lang="less" scoped>
.flex-box {
    // 让其在一行展示
    display: flex;
    align-items: center;
    height: 100%;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;

    .header-left {
        height: 100%;

        .icon {
            width: 45px;
            height: 100%;
        }

        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab{
            height: 100%;
            padding: 0 10px;
            .text {
                margin:0 5px;
            }
            .icon1 {
                // width: 25px;
                padding: 0 5px;
                height: 100%;
            }
            .close {
                visibility: hidden;
            }
            &.selected {
                span{
                    color: #409EFF;
                }
                i{
                    color: #409EFF;
                }
                background-color: #f5f5f5;
            }
            &:hover {
                background-color: #f5f5f5;
                .close {
                    visibility: visible;
                    cursor: pointer;
                    color: #333;
                }
            }
        }
    }

    .header-right {
        .username {
            margin-left: 10px;
            font-size: 14px;
        }
    }
}
a{
    height: 100%;
    color: #333;
    font-size: 15px;
}

</style>