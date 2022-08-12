// 导入定义验证规则的包
const joi = require('joi')

// String值必须为字符串、alphanum值只能是包含a-zA-Z0-9的字符串
// min最小长度、max最大长度、required值必须填、不能为undefined
// pattern（正则表达式）值必须符合正则表达式的规则

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
// 定义 id,nickname，email验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const user_email = joi.string().email().required()
const avatar = joi.string().dataUri().required()

// 验证规则对象 - 注册和登录
exports.reg_login_schema = {
  // 表示需要对 req.body 中的数据进行验证
  body: {
    username,
    password
  }
}

// 验证规则对象 - 更新用户
exports.update_userinfo_schema = {
  body: {
    id,
    nickname,
    email: user_email
  }
}

// 验证规则对象 - 更新密码
exports.update_password_schema = {
  body: {
    oldPwd: password,
    newPwd: joi.not(joi.ref('oldPwd')).concat(password)
  }
}

// 验证规则对象 - 更新头像
exports.update_avatar_schema = {
  body: {
    avatar
  }
}