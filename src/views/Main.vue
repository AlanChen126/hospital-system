<template>
  <div class="common-layout">
    <el-container>
      <!-- <el-aside width="200px">      </el-aside> -->
       <Aside></Aside>
      <el-container>
        <el-header>
          <navHeader></navHeader>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from '../components/aside.vue';//不能起名叫aside，因为和element-plus的aside冲突
import { RouterView } from 'vue-router';//RouterView是vue-router提供的组件，用来显示当前路由匹配到的组件，会将该组件放置到对应的位置上
import navHeader from '../components/navHeader.vue';
</script>

<style lang="less" scoped>
.common-layout {
  height: 100%;
  .el-container {
    height: 100%;
  }
}
</style>