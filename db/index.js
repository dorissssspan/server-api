//  导入mysql模块
const mysql = require('mysql')
// 传数据库连接对象
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  database: 'my_demo_01'
})
//  向外暴露 db 数据可以连接对象
module.exports = db