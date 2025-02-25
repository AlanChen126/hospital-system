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
                <el-form :model="loginForm" label-width="60px" :rules="rules">
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
                        <el-button type="primary" style="width:100%" @click="submitForm">
                            {{fromType ? '注册' : '登录'}}
                        </el-button>
                    </el-form-item>
            </el-card>

    </el-row>
</template>

<script setup>
    import { Lock, UserFilled } from '@element-plus/icons-vue';
    import {ref,reactive} from 'vue'
    const imgUrl = new URL('../../../public/login-head.png', import.meta.url).href
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
    const submitForm = () =>{
        ElMessage({
            message: '登录成功',
            type: 'success',
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