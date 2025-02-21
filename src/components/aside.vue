<template>
      <el-menu
        default-active="2"
        class="aside-contianer"
        @open="handleOpen"
        @close="handleClose"
      >
      <p class="logo">陪诊</p>
      <!-- 封装组件 -->
        <treeMenu></treeMenu>
      </el-menu>

</template>

<script lang="ts" setup>
import treeMenu from './treeMenu.vue';
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style lang = "less" scoped>
.aside-contianer{
    height: 100%;//100%的高度是针对他的父级元素的高度
    .logo{
        font-size: 20px;
        font-weight: 900;
        color: #000000;
        text-align: center;
        padding: 10px 0;
    }
}
</style>
