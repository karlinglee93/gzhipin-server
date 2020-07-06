var express = require('express');
var router = express.Router();

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
router.post('/register', (req, res, next) => {
  // post请求的参数在body里，get在query/params里
  const {username, password} = req.body

  // postman中，x-www-form-urlencoded表示模拟表单提交
  if (username === 'admin') {
    // 每个请求都会有一个专属的code，用来表示请求成功/失败
    res.send({code: 1, msg: '此用户已存在'})
  } else {
    res.send({code: 0, data: {_id: 'abc', username, password}})
  }
})

module.exports = router;
