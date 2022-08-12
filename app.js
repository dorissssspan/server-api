// 导入 express
const express = require('express')
// 创建服务器的实例对象
const app = express()

const joi = require('joi')

// 配置cors跨域
const cors = require('cors')
// 将 cors 注册为全局中间件
app.use(cors())

// 配置解析表单数据的中间件
// 注意：只能解析 application / x - www - form - urlencoded格式的表单数据
app.use(express.urlencoded({
  extended: false
}))

// 响应数据的中间件（封装res.send()）
app.use((req, res, next) => {
  // status默认值为1,表示失败 ，err的值，可能是错误对象也可能是错误的描述字符串
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})
// 配置解析token的中间件，要在路由之前
const config = require('./config')
const expressJWT = require('express-jwt')

app.use(expressJWT({
  secret: config.jwtSecretKey
}).unless({
  path: [/^\/api\//]
}))


// 导入并使用路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并使用用户信息模块
const userInforRoter = require('./router/userinfo')
app.use('/my', userInforRoter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err)
  // 身份认证失败后的错误
  if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')
  // 未知的错误
  res.cc(err)
})

// 启动服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007');
})