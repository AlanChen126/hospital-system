<template>
    <div class="header-container">
        <div class="header-left flex-box">
            <el-icon class="icon" size="20px" @click="store.commit('collapseMenu')">
                <Fold />
            </el-icon>
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
// 先拿到store的实例，然后调用在store中定义的方法
const store = useStore()

</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
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
    }

    .header-right {
        .username {
            margin-left: 10px;
            font-size: 14px;
        }
    }
}
</style>