const express = require('express')
// 创建路由对象 
const router = express.Router()
// 导入用户路由处理函数对应模块
const user_handler = require('../router_handler/user')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const {
  reg_login_schema
} = require('../schema/user')

// 注册用户
router.post('/reguser', expressJoi(reg_login_schema), user_handler.reUser)
// 登录
router.post('/login', expressJoi(reg_login_schema), user_handler.login)

// 共享路由
module.exports = router