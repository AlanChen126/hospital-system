<template>
    <div>
        <panelHeader :route="route" />
        <div class="btns">
            <el-button type="primary" @click="open(null)" :icon="Plus">新增</el-button>
            <el-popconfirm confirm-button-text="是" cancel-button-text="否" :icon="InfoFilled" icon-color="#626AEF"
                title="是否确认删除？" @confirm="confirmEvent" @cancel="cancelEvent">
                <template #reference>
                    <el-button type="danger" :icon="Delete">删除</el-button>
                </template>
            </el-popconfirm>
        </div>

        <el-table :data="tableData.list" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :selectable="selectable" width="55" />
            <el-table-column prop="id" label="id" />
            <el-table-column prop="name" label="昵称" />
            <el-table-column label="头像">
                <template #default="scope">
                    <el-image :src="scope.row.avatar" style="width: 50px;height: 50px;"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="性别">
                <template #default="scope">
                    {{scope.row.sex === '1' ? '男' : '女'}}
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

        <el-dialog v-model="dialogFormVisible" title="添加培护师" width="500" :before-close="beforeClose">
            <el-form ref="formRef" label-width="100px" label-position="right" :model="form" :rules="rules">
                <!-- 新增的时候通过用户输入来获取id -->
                <el-form-item v-show="false" prop="id">
                    <el-input v-model="form.id"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <el-button v-if="!form.avatar" type="primary" @click="dialogFormVisible2 = true">点击上传</el-button>
                    <el-image v-else :src="form.avatar" style="width: 100px;height: 100px;"></el-image>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-select v-model="form.sex" placeholder="请选择性别">
                        <el-option label="男" value="1"></el-option>
                        <el-option label="女" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input-number v-model="form.age" :min="18" :max="50" @change="handleChange" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="是否生效" prop="active">
                    <el-radio-group v-model="form.active">
                        <el-radio :value="0">失效</el-radio>
                        <el-radio :value="1">生效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialogFooter">
                    <el-button @click="beforeClose()">取 消</el-button>
                    <el-button type="primary" @click="submitForm(formRef)">确 定</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 选择头像弹窗 -->
        <el-dialog v-model="dialogFormVisible2" title="选择图片" width="680" :before-close="beforeClose2">
            <div class="img-list">
                <div v-for="(item,index) in imgList" :key="item.name" class="img-box" @click="selectIndex = index">
                    <div v-if="selectIndex === index" class="select">
                        <el-icon color="#fff">
                            <Check />
                        </el-icon>
                    </div>
                    <el-image style="width: 148px; height: 148px;" :src="item.url"></el-image>
                </div>
            </div>
            <template #footer>
                <div class="dialogFooter">
                    <el-button @click="beforeClose2()">取 消</el-button>
                    <el-button type="primary" @click="submitForm2()">确 定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import {ref,reactive,onMounted,nextTick} from 'vue'
import { Plus,Delete,InfoFilled } from '@element-plus/icons-vue';
import {photoList,companion,companionList,deleteCompanion} from '../../../api/index'
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
const route = useRoute()
// dialog信息
const dialogFormVisible = ref(false)
const dialogFormVisible2 = ref(false)

// 页表数据
const paginationData = reactive({
    pageNum:1,
    pageSize:10
})

// 列表数据
const tableData = reactive({
    list: [],
    total: 0
})

// 请求列表的数据(页码)
const getListData = ()=>{
    companionList(paginationData).then(({data})=>{
        const {list,total} = data.data
        tableData.list = list
        tableData.total = total
    })
}

// form表单
const formRef = ref()

const form = reactive({
    id:'',
    mobile:'',
    active:1,
    age:28,
    avatar:'',
    name:'',
    sex:''
})

const imgList = ref([])
const selectIndex = ref(0)

onMounted(() =>{
    photoList().then(({data})=>{
        imgList.value = data.data
    })
    getListData()
})

const handleSizeChange = (number) => {
    paginationData.pageSize = number
    getListData()
}
// 
const handleCurrentChange = (number) => {
    paginationData.pageNum = number
    getListData()
}

const rules = reactive({
    name: [
        { required: true, message: '请输入权限名称', trigger: 'blur'}
    ],
    avatar: [
        { required: true, message: '请选择头像'}
    ],
    sex: [
        { required: true, message: '请选择性别', trigger: 'change'}
    ],
    mobile: [
        { required: true, message: '请填写手机号', trigger: 'blur'}
    ],
})

// 点击编辑按钮，打开弹窗，编辑
const open = (rowData = {}) =>{
    dialogFormVisible.value = true
    nextTick(()=>{
        // 如果是编辑
        if(rowData){
            Object.assign(form,rowData)
        }
    })
}

// 弹窗关闭前的回调
const beforeClose = () =>{
    dialogFormVisible.value = false;
    // 重置表单
    formRef.value.resetFields()
}
// 弹窗关闭前的回调
const beforeClose2 = () =>{
    dialogFormVisible2.value = false;
}

// 表单提交
const submitForm = async (formEl) =>{
    if(!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            companion(form).then(({data})=>{
                if(data.code === 10000){
                    ElMessage.success('成功')
                    beforeClose()
                    getListData()
                }else{
                    ElMessage.error(data.message)
                }
            })
        } else {
            console.log('error submit!!', fields);
        }
    });

}
// 表单提交
const submitForm2 = () =>{
    form.avatar = imgList.value[selectIndex.value].url
    dialogFormVisible2.value = false;
}

const selectableData = ref([])
// 拿到勾选框的数据
const handleSelectionChange = (val) =>{
    selectableData.value = val.map(item =>{id:item.id})

}

const confirmEvent = () => {
    // 没有选择数据
    if(!selectableData.value.length){
        return ElMessage.warning('请选择至少一项数据')
    }
    deleteCompanion({id:selectableData.value}).then(({data})=>{
        if(data.code === 10000){
            getListData()
        }
    })
}
const cancelEvent = () => {
  console.log('cancel!')
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