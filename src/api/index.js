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

// 权限管理列表
export function authAdmin(params) {
  return request.get('/auth/admin', { params })
}

// 菜单权限数据
export const userGetmenu = () =>{
  return request.get('/user/getmenu')
}

// 权限修改
export const userSetmenu = (data) =>{
  return request.post('/user/setmenu',data)
}

// 获取菜单权限列表
export const menuList = (params) =>{
  return request.get('/menu/list',{ params })
}

// 菜单权限下拉
export const menuSelectlist = () =>{
  return request.get('/menu/selectlist')
}

// 用户信息修改
export const updateUser = (data) =>{
  return request.post('/update/user',data)
}

// 用户菜单权限
export const menuPermissions = ()=>{
  return request.get('/menu/permissions')
}

// 陪护师头像
export const photoList = () =>{
  return request.get('/photo/list')
}

// 陪护师创建
export const companion = (data) =>{
  return request.post('/companion',data)
}

// 陪护师列表
export const companionList = (params)=>{
  return request.get('/companion/list',{params})
}

// 陪护师删除
export const deleteCompanion = (data) =>{
  return request.post('/delete/companion',data)
}