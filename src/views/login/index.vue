<template>
    <el-row class="login-container" justify="center" align="middle">
            <el-card style="max-width: 480px ">
                <template #header>
                    <div class="card-header">
                        <img :src="imgUrl" alt="">
                    </div>
                </template>
                <div class="jump-link">
                    <el-link   type="primary" @click="handelChange">{{fromType ? '返回登录' : '注册账号'}}</el-link>
                </div>
                <!-- ref：用于获取 DOM 元素或组件实例的引用，允许你直接操作它们。适用于需要直接调用组件方法或访问 DOM 元素的场景。
                    :model：用于双向数据绑定，将数据模型绑定到表单元素或组件的值。适用于需要自动更新数据模型的场景。 -->
                <el-form :model="loginForm" label-width="60px" :rules="rules" ref="loginFormRef" >
                    <el-form-item label="手机号:" prop="userName">
                        <el-input v-model="loginForm.userName" placeholder="请输入手机号" :prefix-icon = 'UserFilled'/>
                    </el-form-item>
                    <el-form-item label="密码:" prop="passWord">
                        <el-input v-model="loginForm.passWord" type = "password" placeholder="请输入密码" :prefix-icon = 'Lock'/>
                    </el-form-item>
                    <el-form-item v-if="fromType" label="验证码:" prop="validCode">
                        <el-input v-model="loginForm.validCode" placeholder="请输入验证码" :prefix-icon = 'Lock'>
                            <template #append >
                                <span @click="countDownChange" style="cursor: pointer;">{{countDown.validText}}</span>
                            </template>
                        </el-input>
                    </el-form-item>
                </el-form>
                <el-form-item>
                        <el-button type="primary" style="width:100%" @click="submitForm(loginFormRef)">
                            {{fromType ? '注册' : '登录'}}
                        </el-button>
                    </el-form-item>
            </el-card>

    </el-row>
</template>

<script setup>
    import { Lock, UserFilled } from '@element-plus/icons-vue';
    import {ref,reactive,computed,toRaw} from 'vue'
    import { getCode,userAuthentication,userLogin,menuPermissions } from '../../api';
    import { ElMessage } from 'element-plus';
    import { useRouter} from 'vue-router'
    import { useStore } from 'vuex';
    const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href
    // 路由实例
    const router = useRouter()
    // vuex
    const store = useStore()
    // 表单实例
    const loginFormRef = ref()

    // 访问 state 的顺序是 state.模块名.属性名,用computed存储可以实现响应式
    const routerList = computed(()=> store.state.menu.routerList)

    const loginForm = reactive({
        userName: '',
        passWord: '',
        validCode: ''
    })

    // 验证码
    const countDown = reactive({
        time:60,
        validText:'获取验证码'
    })
    // 切换表单（0登录，1注册）
    const fromType = ref(0)
    // 点击切换登录和注册
    const handelChange = () =>{
        fromType.value = !fromType.value
    }
    let flag = true //定时器未被使用，可以点击使用
    const phoneReg = /^1[3-9]\d{9}$/

    // 获取验证码
    const countDownChange = () =>{
        if(!flag){//false，不能新建使用
            return
        }
        // 验证手机号
        if(!loginForm.userName || !phoneReg.test(loginForm.userName)){
            return ElMessage({
                message: '请输入正确的手机号',
                type: 'warning',
            })
        }
        if(countDown.time === 60){
            const timer = setInterval(() => {
                flag = false
                countDown.time--
                countDown.validText = `${countDown.time}秒后重新获取`
                if(countDown.time <= 0){
                    clearInterval(timer)
                    countDown.time = 60
                    countDown.validText = '获取验证码'
                    flag = true
                }
            }, 1000);
            getCode({tel:loginForm.userName}).then(res =>{
                console.log(res,'res')
                if(res.data.code === 10000){
                    console.log('验证码发送成功')
                    ElMessage.success('验证码发送成功')
                }
            })
        }
        
    }
    // 账号校验规则
    const validatePass_Name = (rule, value, callback) =>{
        //账号不能为空
        if(value === ''){
            callback(new Error('请输入账号'))
        }else{
            phoneReg.test(value) ? callback() : callback(new Error('手机号格式不对，请输入正确的手机号'))
        }
    }
    // 密码校验规则
    // 至少包含一个字母（大写或小写）
    // 至少包含一个数字
    // 总长度至少为8个字符
    const validatePass_Word = (rule, value, callback) =>{
        //密码不能为空
        if(value === ''){
            callback(new Error('请输入密码'))
        }else{
            const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
            passwordReg.test(value) ? callback() : callback(new Error('密码至少包含一个字母（大写或小写）,一个数字,总长度至少为8个字符'))
        }
    }
    // 验证码校验规则
    const validatePass_Code = (rule, value, callback) =>{
        //验证码不能为空
        if(value === ''){
            callback(new Error('请输入验证码'))
        }else{
            callback()
        }
    }

    // 表单校验
    const rules = reactive({
        userName:[{ validator: validatePass_Name, trigger: 'blur' }],
        passWord:[{ validator: validatePass_Word, trigger: 'blur' }],
        validCode:[{ validator: validatePass_Code, trigger: 'blur' }]
    })

    // 提交表单
    // formEl: 表单实例，获取表单实例的方法是通过 ref 获取，在此进行校验
    const submitForm = async (formEl) =>{
        if (!formEl) return
        // 手动触发校验
        await formEl.validate((valid, fields) => {
            if (valid) {
            console.log(loginForm,'submit!')
            // 注册页面逻辑
            if(fromType.value){
                userAuthentication(loginForm).then(res =>{
                    if(res.data.code === 10000){
                        ElMessage({
                            message: '注册成功，请登录',
                            type: 'success',
                        })
                        // 跳转到登录页面
                        fromType.value = 0
                    }
                })
            }else{
                // 登录页面逻辑
                userLogin(loginForm).then(res =>{
                    if(res.data.code === 10000){
                        ElMessage({
                            message: '登录成功',
                            type: 'success',
                        })
                        // 将用户信息和token缓存到浏览器
                        localStorage.setItem('pz_token',res.data.data.token)
                        // 将用户信息缓存到浏览器(因为用户信息是对象，需要转换成字符串进行保存)
                        localStorage.setItem('pz_userInfo',JSON.stringify(res.data.data.userInfo))
                        // 拿到当前账号对应的菜单权限
                        menuPermissions().then(({data})=>{
                            store.commit('dynamicsMenu',data.data)
                            // console.log(data,"res.data")
                            // console.log(routerList,"routerList")
                            // console.log(toRaw(routerList.value),"raw")
                            // 将响应式的路由数据(ref)转化为普通的路由数据
                            toRaw(routerList.value).forEach(item => {
                                // 动态传入路由数据
                                router.addRoute('main',item)
                            });
                        })
                        router.push('/')
                    }
                })
            }

            } else {
            console.log('error submit!', fields)
            }
        })


        
    }
</script>

<style lang="less" scoped>
  :deep(.el-card__header) {
    padding: 0
  }
//   修改el-form-item的错误提示字体大小
  :deep(.el-form-item__error) {
    font-size: 10px; 
}
  .login-container {
    height: 100%;
    .card-header{
      background-color: #899fe1;
      img {
        width: 430px;
      }
    }
    .jump-link {
      text-align: right;
      margin-bottom: 10px;
    }
  }
</style>