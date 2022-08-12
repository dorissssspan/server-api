# 初始化

### 1.创建项目

```hs
1.初始化包管理配置文件  npm init -y
2.安装特定版本的express  npm i express@4.17.1
3.在目录中新建app.js作为整个项目的入口文件并初始化
```

### 2.配置cors跨域

```hs
1.安装cors中间件  npm i cors@2.8.5
2.在app.js中导入并配置cors中间件
  2.1 导入cors中间件
  2.2 将 cors 注册为全局中间件
3.配置解析表单数据的中间件  只能解析application / x - www - form - urlencoded格式的表单数据
app.use(express.urlencoded({extended: false}))
```

### 3.初始化文件夹

> 1. **router** 文件夹，用来存放所有的路由模块<span style="color:red">   `只存放客户端的请求与处理函数之间的映射关系` </span>
> 2. **router_handler** 文件夹，用来存放所有的路由处理函数模块<span style="color:red"> `专门负责存放每个路由对象的处理函数` </span>
> 3. **db** 文件夹，用来创建数据库的连接对象<span style="color:red"> `index.js自定义模块中导入mysql模块` </span>

### 4.初始化用户路由模块 

`1.在router文件夹中，新建user.就是文件，作为用户的路由模块，并初始化代码`

`2.在app.js中，导入并使用用户路由模块`

postman测试：http://127.0.0.1:3007/api/login

#### 抽离用户路由模块中的处理函数

>  目的：为了保证<span style="color:red"> `路由模块`</span>的纯粹性，所有<span style="color:red"> `路由处理函数` </span>，必须抽离到对象的<span style="color:red">`路由处理函数模块`</span>中

`1.在/router_handler/user.js中，使用exports对象爱国，分别向外共享路由处理函数`

`2.将/router/user.js中的导入路由处理函数模块，通过对象使用对应函数模块`

# 登录注册

数据库新建表

### 安装并配置mysql模块

```hs
1.安装 mysql 模块   npm i mysql@2.18.1
2.db文件夹新建index.js文件，在自定义模块中创建数据库连接对象
 2.1 导入mysql模块
 2.2 创建数据库连接对象
 2.3 向外共享数据库连接对象
```

### 注册

```
1.检测表单数据是否合法  
  1.1 获取客户端提交到服务器的用户信息
  1.2 对表单数据进行合法性校验
2.检测用户名是否被占用
  2.1 导入数据库模块
  2.2 定义sql语句：  'select * from ev_users where username=?'
  2.3 指定sql语句并根据结果判断用户名是否被占用
3.对密码进行加密处理 <不建议在数据库以 明文 的形式保存用户密码，推荐对密码进行 加密存储>
  3.1 安装bcryptjs npm i bcryptjs@2.4.3
  3.2 在/router_handler/user.js中，导入bcryptjs模块
  2.3 调用 bcrypt.hashSync() 对面吗进行加密
4.插入新用户
  4.1 定义sql语句： insert into ev_users set ?
  4.2 执行sql语句并判断是否注册成功
```

### 优化

#### res.send()优化

多次调用`res.send（）`向客户端相应<span style="color:red"> `处理失败` </span>的结果，为了简化代码，可以手动封装一个`res.cc（)`函数

> 在app.js中封装的函数一定要在路由之间

#### 表单数据验证优化

<span style="color:red">`表单验证的原则： 前端验证为辅，后端验证为主，后端永远不要相信前端提交过来的任何内容`</span>

1. `@hapi/joi包` 为表单中携带的每个数据项，定义验证规则  **npm i @hapi/joi@17.1.0**

2. `@escook/express-joi中间件` 来实现自动对表单数据进行验证的功能  **npm i @escook/express-joi**

3. 新建**schema/user.js**

   3.1  导入定义验证规则包  **@hapi/joi**

   3.2  定义用户名和密码的验证规则

   3.3  定义验证注册和登录表单数据的规则对象

4. 在**router/user.js**

   4.1  导入验证表单数据的中间件 

    `const expressJoi = require('@escook/express-joi')`

   4.2  导入需要验证规则的对象   

   `const {reg_login_schema} = require('../schema/user')`

   4.3  在注册路由地址后添加 expressJoi(规则对象名)

   `router.post('/xxxxx', expressJoi(reg_login_schema), user_handler.reUser)`

### 登录

1. 在登录处理函数中，接收表单数据  `req.body`

2. 定义sql语句： `select * from ev_users where username=?`

3. 执行sql语句，根据用户名查询用户的信息

4. sql语句通过后，判断输入密码和数据库密码是否一致

   <span style="color:red">`核心实现思路：调用 bcryptjs.compareSync(用户提交的密码，数据库中的密码) 方法比较是否一致` </span>

   4.1  用户输入的密码和数据库中存储的密码进行对比

   4.2  如果对比的结果等于false，则证明用户输入的密码错误

5. 生成 JWT 的 Token 字符串

   <span style="color:red">`核心注意点：在生成Token字符串的时候，一定要提出*密码*和*头像*的值`</span>

   5.1  剔除值  const user = {...result[0],password:'',user_pic:''}  //每一行的密码和头像为空

   5.2  安装Token字符串的包    `npm i jsonwebtoken@8.5.1`

   5.3  router_handler导入 `jsonwebtoken`包，创建全局配置文件 config.js向外共享token字符串

   `module.exports = {jwtSecretKey: 'Scarlett Love Doris',expiresIn: '10h' // 有效期}`

   5.4  将用户信息对象加密成token字符串

   在router_handler，导入全局配置文件，生成token字符串，最后将生成字符串响应给客户端

   `jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})`

#### 配置解析Token的中间件

1. 安装Token的中间件  `npm i express-jet@5.3.3`

2. 在app.js中注册路由之前，配置解析token的中间件

   2.1  导入配置文件

   2.2  解析token的中间件

   2.3  使用 `.unless({ path: [/^\/api\//]})` 制定哪些接口不需要进行身份认证

3. 在app.js中的`错误级别中间件`里面，铺货并处理token认证失败后的错误

# 个人中心

### 获取用户的基本信息

1. 初始化 路由 模块
2. 初始化 路由处理函数 模块
3. 获取用户的基本信息

### 重置密码

1. 定义路由和处理函数
2. 验证表单数据
3. 实现重置密码的功能