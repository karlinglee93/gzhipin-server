var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5')
const {UserModel} = require('../db/models')

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
            // 此方法经前端处理后可以让用户1天内免登录
            res.cookie('user_id', user._id, {maxAge: 1000 * 60 * 60 * 24})
            res.send({code: 0, data: {_id: user._id, username, type}})
          } else {
            res.send({code: 1, msg: err.message})
          }
        })
      }
    })
})

module.exports = router;
