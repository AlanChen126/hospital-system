<template>
    <!-- vue3中可以有多个根结点 -->
    <!-- 递归遍历treeMenu -->
     <template v-for="(item , index) in props.menuData">
        <!-- 没有子元素的情况 -->
        <el-menu-item 
        v-if="!item.children || item.children.length == 0"
        :index = "`${props.index}-${item.meta.id}`"
        :key = "`${props.index}-${item.meta.id}`"
        >
        <el-icon size = 20>
            <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{item.meta.name}}</span>
        </el-menu-item>
        <!-- 有子菜单的情况 -->
        <el-sub-menu 
        v-else
        :index="`${index}-${item.meta.id}`"
        >
        <template #title>
        <el-icon size = 20>
            <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{item.meta.name}}</span>
        </template>
        <!-- vue3中递归使用子组件，实现有子菜单时递归的功能 -->
        <treeMenu 
        :menuData = "item.children" 
        :index = "`${props.index}-${item.meta.id}`"
        ></treeMenu>
        </el-sub-menu>
     </template>
    
    
</template>

<script setup>
const props = defineProps(["menuData","index"])
console.log(props, 'props')
</script>