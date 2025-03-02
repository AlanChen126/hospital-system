<template>
  <el-menu 
  :style="{ width: isCollapse ? '60px' : '230px' }"
  :default-active="active" class="aside-contianer"
    @open="handleOpen" @close="handleClose" :collapse="isCollapse">
    <p class="logo">{{ isCollapse ? '陪诊' : '陪诊系统' }}</p>
    <!-- 封装组件，用v-bind在父子组件间传递数据 -->
    <treeMenu :index="1" :menuData="menuData"></treeMenu>
  </el-menu>

</template>

<script lang="ts" setup>
import treeMenu from './treeMenu.vue';
import { reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex'

import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const router = useRouter();


//获取store实例的isCollapse值，用来控制菜单的展开和收缩
const store = useStore();
const isCollapse = computed(() => store.state.menu.isCollapse);

const active = computed(()=>store.state.menu.menuActive)

// const menuData = reactive(router.options.routes[0].children);
const menuData = computed(()=>store.state.menu.routerList)


const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
</script>

<style lang="less" scoped>
.aside-contianer {
  height: 100%; //100%的高度是针对他的父级元素的高度
  transition: width 0.2s ease-in-out; // 添加过渡动画，宽度变化时持续0.3秒，使用缓动效果

  .logo {
    font-size: 20px;
    font-weight: 900;
    color: #000000;
    text-align: center;
    padding: 10px 0;
    transition: opacity 0.2s ease-in-out;
  }
}
</style>
