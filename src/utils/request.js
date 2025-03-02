import axios from 'axios'
import {ElMessage} from 'element-plus'

const http = axios.create({
    // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
    // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
    baseURL: 'https:/v3pz.itndedu.com/v3pz/',
     // 如果请求时间超过 `timeout` 的值，则请求会被中断
    timeout: 2000, // 默认值是 `0` (永不超时)
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('pz_token')
    // 白名单（不需要添加token的api）
    const whiteUrl = ['/get/code', '/user/authentication','/login','/update/user']
    if (token && !whiteUrl.includes(config.url)) {
        config.headers['x-token'] = token
    }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 对接口异常的数据，给用户进行提示
    if (response.data.code === -1) {
      ElMessage.warning(response.data.message)
    }
    // token有问题
    if(response.data.code === -2){
      // 清除token
      localStorage.removeItem('pz_token')
      localStorage.removeItem('pz_userInfo')
      localStorage.removeItem('pz')
      // 跳转到登录页
      window.location.href = window.location.origin
    }
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });

  export default http