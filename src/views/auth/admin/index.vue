<template>
    <div>
        <panelHeader />
        <el-table :data="tableData.list" style="width: 100%">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="昵称" />
            <el-table-column prop="permissions_id" label="所属组别">
                <template #default="scope">
                    {{permissionName(scope.row.permissions_id)}}
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" />
            <el-table-column prop="active" label="状态">
                <template #default="scope">
                    <el-tag :type="scope.row.active ? 'success' : 'danger'">
                        {{scope.row.active ? '正常' : '失效'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="create_time" label="创建时间">
                <template #default="scope">
                    <div class="flex-box">
                        <el-icon>
                            <Clock />
                        </el-icon>
                        <span style="margin-left: 5px;">{{scope.row.create_time}}</span>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" @click="open(scope.row)">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-block">
            <el-pagination :current-page="paginationData.pageNum" :page-size="paginationData.pageSize"
                :page-sizes="[10, 20, 30, 40]" :size="size" :disabled="disabled" :background="background"
                layout="sizes, prev, pager, next" :total="tableData.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" class="pagination" />
        </div>

        <el-dialog v-model="dialogFormVisible" title="添加权限" width="500" :before-close="beforeClose">
            <el-form ref="formRef" label-width="100px" label-position="right" :model="form" :rules="rules">
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile" disabled></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="菜单权限" prop="permissions_id">
                    <el-select v-model="form.permissions_id" placeholder="请选择菜单权限" style="width: 240px">
                        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

            </el-form>
            <template #footer>
                <div>
                    <el-button @click="beforeClose()">取 消</el-button>
                    <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {authAdmin,menuSelectlist,updateUser} from '../../../api/index'
import { ref,reactive,onMounted} from 'vue';
import panelHeader from '../../../components/panelHeader.vue'
import dayjs from 'dayjs';

const paginationData = reactive({
    pageNum:1,
    pageSize:10
})

// 列表数据
const tableData = reactive({
    list: [],
    total: 0
})

onMounted(()=>{
    // 请求列表数据
    getListData()
    // 菜单权限下拉
    menuSelectlist().then(({data})=>{
        options.value = data.data
    })
})
// 请求列表数据
const getListData = ()=> {
    // 权限管理列表
    authAdmin(paginationData).then(({data}) =>{
        console.log(data,'authAdmin')
        // 将获取到的列表数据赋值
        const {list,total} = data.data
        list.forEach(item =>{
            // 使用 dayjs 转换时间戳为年月日格式
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        })
        tableData.list = list
        tableData.total = total
    })
}

const options = ref([])
// 根据权限id匹配权限名称
const permissionName = (id) =>{
    const data =  options.value.find(el => el.id === id)
    return data ? data.name : '超级管理员'
}

const open = (rowData) =>{
    dialogFormVisible.value = true
    // 因为不存在新增和修改功能，所以不用异步
    Object.assign(form,{mobile:rowData.mobile,name:rowData.name,permissions_id:rowData.permissions_id})
}

const handleSizeChange = (number) =>{
    paginationData.pageSize = number
    authAdmin(paginationData)
}
const handleCurrentChange = (number) =>{
    paginationData.pageNum = number
    authAdmin(paginationData)
}

// 弹窗
const dialogFormVisible = ref(false)
const beforeClose = () =>{
    dialogFormVisible.value = false
    getListData()
}

// 编辑表单
const form = reactive({
    name:'',
    permissions_id:''
})

const formRef = ref()

// 表单验证规则
const rules = reactive({
    name:[{required:true,trigger:'blur',message:'请填写昵称'}],
    permissions_id:[{required:true,trigger:'blur',message:'请填写菜单权限'}]
})

// 表单提交
const submitForm = async (formEl) => {
    if(!formEl) return 
    await formEl.validate((valid, fields)=>{
        if(valid){
            const {name,permissions_id} = form
            updateUser({name,permissions_id}).then(({data})=>{
                if(data.code === 10000){
                    console.log(222)
                    dialogFormVisible.value = false
                    getListData()
                }
            })
        }else{
            console.log('error submit!!', fields);
        }
    })
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
.flex-box{
    display: flex;
    align-items: center;
}
</style>