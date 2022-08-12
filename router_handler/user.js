// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs 包
const bcryptjs = require('bcryptjs')
// 导入token包
const jwt = require('jsonwebtoken')
// 导入全局配置文件
const config = require('../config')

// 注册新用户的处理函数
exports.reUser = (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // 对表单数据，进行合法性校验 schema
  // 定义sql语句，查询用户名是否被占用
  const sqlStr = 'select * from ev_users where username=?'
  db.query(sqlStr, userinfo.username, (err, results) => {
    // 执行sql语句失败
    if (err) {
      // return res.send({status: 1,message: err.message})
      return res.cc(err)
    }
    // 判断用户名是否被占用
    if (results.length > 0) {
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    // TODO: 用户名可用
    // 调用 bcrypt.hashSync() 对面吗进行加密
    userinfo.password = bcryptjs.hashSync(userinfo.password, 10)
    // 插入新用户
    const sql = 'insert into ev_users set ?'
    db.query(sql, {
      username: userinfo.username,
      password: userinfo.password
    }, (err, results) => {
      // 判断sql语句是否执行成
      if (err) return res.cc(err)
      // 判断影响行数是否为1
      if (results.affectedRows !== 1)
        return res.cc('注册用户失败，请稍后再试')
      // 注册用户成功
      // res.send({status: 0,message: '注册成功！'})
      res.cc('注册成功!', 0)
    })
  })
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  // 定义sql语句，查询用户名是否被占用
  const sql = 'select * from ev_users where username=?'
  // 执行sql语句，根据用户名查询用户的信息
  db.query(sql, userinfo.username, (err, results) => {
    // sql语句失败
    if (err) return res.cc(err)
    // sql语句成功，但是获取到的数据条数不等于1
    if (results.length !== 1) return res.cc('登录失败~')

    // TODO:判断密码是否正确
    const compareResult = bcryptjs.compareSync(userinfo.password, results[0].password)
    if (!compareResult) return res.cc('登录失败')
    // TODO:在服务器端生成Token字符串
    // es6的高级语法，剔除 密码 和 头像 的值
    const user = {
      ...results[0],
      password: '',
      user_pic: ''
    }
    // 信息加密，生成token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })
    res.send({
      status: 0,
      message: '登录成功',
      token: 'Bearer ' + tokenStr
    })
  })

}