<template>
    <div class="panel-header">
        <div class="title">{{props.route.meta.name}}</div>
        <p class="description">{{props.route.meta.describe}}</p>
    </div>
</template>

<script setup>
// 用defineProps接收传给组件的参数
    const props = defineProps({
        route:{
            type:Object
        }
    })
</script>

<style lang="less" scoped>
.panel-header{
    padding: 15px;
    background-color: #e8edf0;
    font-size: 14px;
    // position: relative;
    .title{
        font-weight: bold;
        font-style: normal;
    }
    .description{
        margin-top: 5px;
    }
}
</style>