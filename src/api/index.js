import request from '../utils/request'

// 获取验证码
export function getCode(data) {
  return request.post('/get/code', data)
}

// 验证码验证
export function userAuthentication(data) {
  return request.post('/user/authentication', data)
}

// 登录
export function userLogin(data) {
  return request.post('/login', data)
}