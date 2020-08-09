var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel, ChatModel} = require('../db/models')
const filter = {password: 0, __v: 0}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册一个路由: register
/**
 * a) path 为: /register
 * b) 请求方式为: POST
 * c) 接收 username 和 password 参数
 * d) admin 是已注册用户
 * e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
 * f) 注册失败返回: {code: 1, msg: '此用户已存在'}
 */
/**
 * 1. 获取请求参数
 * 2. 处理
 * 3. 返回响应数据
 */
router.post('/register', (req, res) => {
  // 1. 获取请求参数
  const {username, password, type} = req.body
  // 2. 处理
  // 3. 返回响应数据
    UserModel.findOne({username}, (err, user) => {
      if (user) {
        res.send({code: 1, msg: '用户名已存在，请重新输入'})
      } else {
        new UserModel({username, password: md5(password), type}).save((err, user) => {
          if (!err) {
            // 生成一个cookie(user_id: user._id), 并交给浏览器保存
            // 持久化cookie, 此方法经前端处理后, 浏览器会保存在本地文件，可以让用户1天内免登录
            res.cookie('user_id', user._id, {maxAge: 1000 * 60 * 60 * 24})
            res.send({code: 0, data: {_id: user._id, username, type}})
          } else {
            res.send({code: 1, msg: err.message})
          }
        })
      }
    })
})

router.post('/login', (req, res) => {
  const {username, password} = req.body
  UserModel.findOne({username, password: md5(password)}, filter, (err, user) => {
    if (user) {
      // 持久化cookie
      res.cookie('user_id', user._id, {maxAge: 1000 * 60 * 60 * 24})
      res.send({code: 0, data: user})
    } else {
      res.send({code: 1, msg: '用户名或密码错误!'})
    }
  })
})

router.post('/update', (req, res) => {
  // 从请求的cookie中得到user_id
  const user_id = req.cookies.user_id
  // cookie 不存在/被清除
  if (!user_id) {
    return res.send({code: 1, msg: '请重新登陆'})
  }

  const user = req.body
  UserModel.findByIdAndUpdate(user_id, user, (err, previousUser) => {
    if (!previousUser) {
      // 通知浏览器删除user_id cookie
      res.clearCookie('user_id')
      res.send({code: 1, msg: '请重新登陆'})
    } else {
      const {_id, username, type} = previousUser
      res.send({code: 0, data: {_id, username, type, ...user}})
    }
  })
})

// 获取用户信息的路由(通过cookie中的user_id)
router.get('/user', (req, res) => {
  const {user_id} = req.cookies
  if (!user_id) {
    return res.send({code: 1, msg: '请重新登陆'})
  }
  UserModel.findById(user_id, filter, (err, user) => {
    if (!user) {
      res.clearCookie('user_id')
      res.send({code: 1, msg: '请重新登陆'})
    } else {
      res.send({code: 0, data: user})
    }
  })
})

// 获取用户列表
router.get('/userlist', (req, res) => {
  const {type} = req.query
  UserModel.find({type}, filter, (err, users) => {
    res.send({code: 0, data: users})
  })
})

router.get('/msglist', (req, res) => {
  const {user_id} = req.cookies
  UserModel.find({}, filter, (err, userDocs) => {
    if (!err) {
      const users = {}
      userDocs.forEach(doc => {
        users[doc._id] = {username: doc.username, header: doc.header}
      })
      ChatModel.find({'$or': [{from: user_id}, {to: user_id}]}, (err, chatMsgs) => {
        if (!err) {
          res.send({code: 0, data: {users, chatMsgs}})
        } else {
          res.send({code: 1, msg: err})
        }
      })
    } else {
      res.send({code: 1, msg: err})
    }
  })
})

router.post('readmsg', (req, res) => {
  const {chat_id} = req.body
  ChatModel.update({chat_id}, {read: true}, {multi: true}, (err, chatMsgs) => {
    if (!err) {
      res.send({code: 0, data: {users, chatMsgs}})
    }
  })
})

module.exports = router;
