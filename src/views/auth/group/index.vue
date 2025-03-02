<template>
    <div>
        <panelHeader :route="route" />
        <div class="btns">
            <el-button type="primary" @click="open(null)" :icon="Plus">新增</el-button>
        </div>
        
        <el-table :data="tableData.list" style="width: 100%">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="昵称" />
            <el-table-column prop="permissionName" label="菜单权限" width="500px" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="open(scope.row)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-block">
            <el-pagination :current-page="paginationData.pageNum" :page-size="paginationData.pageSize" :page-sizes="[10, 20, 30, 40]"
                :size="size" :disabled="disabled" :background="background" layout="sizes, prev, pager, next"
                :total="tableData.total" @size-change="handleSizeChange" @current-change="handleCurrentChange" class="pagination" />
        </div>

        <el-dialog v-model="dialogFormVisible" title="添加权限" width="500" :before-close="beforeClose">
            <el-form ref="formRef" label-width="100px" label-position="right" :model="form" :rules="rules">
                <!-- 新增的时候通过用户输入来获取id -->
                <el-form-item v-show="false" prop="id">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="权限名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入权限名称"></el-input>
                </el-form-item>
                <el-form-item label="权限名称" prop="permissions">
                    <el-tree ref="treeRef" :data="treeData" show-checkbox node-key="id" :default-expanded-keys="[2]"
                        :default-checked-keys="defaultKey">

                    </el-tree>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialogFooter">
                    <el-button @click="beforeClose()">取 消</el-button>
                    <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref,reactive,onMounted, nextTick} from 'vue';
import { Plus } from '@element-plus/icons-vue';
import {userGetmenu,userSetmenu,menuList} from '../../../api'
import panelHeader from '../../../components/panelHeader.vue';
import { useRoute } from 'vue-router';
const route = useRoute()
// 弹窗显示和隐藏
const dialogFormVisible = ref(false);
// 树形菜单数据
const treeData = ref([]);
// 页表数据
const paginationData = reactive({
    pageNum:1,
    pageSize:10
})

// 
const handleSizeChange = (number) => {
    paginationData.pageSize = number
    getListData()
}
// 
const handleCurrentChange = (number) => {
    paginationData.pageNum = number
    getListData()
}

// 列表数据
const tableData = reactive({
    list: [],
    total: 0
})

// 请求列表的数据(页码)
const getListData = ()=>{
    menuList(paginationData).then(({data})=>{
        console.log(data,'menuList')
        const {list,total} = data.data
        tableData.list = list
        tableData.total = total
    })
}

onMounted(()=>{
    userGetmenu().then(({data})=>{
        treeData.value = data.data;
    })
    getListData()
})
// 弹窗关闭前的回调
const beforeClose = () =>{
    dialogFormVisible.value = false;
    // 重置表单
    formRef.value.resetFields()
    // 重置树形菜单
    treeRef.value.setCheckedKeys(defaultKey)
}
// form表单数据
const form = reactive({
    name: '',
    permissions: '',
    id: ''
})
// 默认选中权限
const defaultKey = [4,5]

// 获取form表单的实例
const formRef = ref()

// 获取tree表单的实例
const treeRef = ref()

// name校验
const validate_name = (rule, value, callback) =>{
    if(value === ''){
        callback(new Error('请输入权限名称'))
    }else{
        callback()
    }
}

// 点击编辑按钮，打开弹窗，编辑
const open = (rowData = {}) =>{
    dialogFormVisible.value = true
    // 弹窗打开，form生成是异步的,所以要用nexttick保证form已经生成了
    nextTick(()=>{
        // 如果有输入的数据，就把数据赋值给form
        if(rowData){
            Object.assign(form,rowData)
            // 更新选中的权限
            treeRef.value.setCheckedKeys(rowData.permissions)
        }
    })

}

// 表单校验
const rules = reactive({
    name: [
        { required: true, message: '请输入权限名称', trigger: 'blur',validator: validate_name}
    ]
    
})

// 表单提交
const submitForm = async (formEl) =>{
    if(!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            const checkedKeys = JSON.stringify(treeRef.value.getCheckedKeys())

            userSetmenu({name:form.name,permissions:checkedKeys,id:form.id}).then(({data})=>{
                // console.log(data,'userSetmenu')
                // 关闭弹窗
                beforeClose()
                // 请求列表数据
                getListData()
            })
        } else {
            console.log('error submit!!', fields);
        }
    });

}

</script>

<style lang="less" scoped>
.btns{
    background-color: #fff;
    padding: 10px 0 10px 10px;
}
.pagination-block {
    background-color: #fff;
    height: 30px;
    .pagination{
        justify-content: end;
        margin-right: 20px;
    }
}
</style>