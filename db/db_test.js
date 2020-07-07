/**
 * 测试使用mongoose操作mongodb
 * 1. 连接数据库
 * 	1.1. 引入 mongoose
 * 	1.2. 连接指定数据库(URL 只有数据库是变化的) 
 * 	1.3. 获取连接对象
 * 	1.4. 绑定连接完成的监听(用来提示连接成功)
 * 2. 得到对应特定集合的 Model
 * 	2.1. 字义 Schema(描述文档结构)
 * 	2.2. 定义 Model(与集合对应, 可以操作集合)
 * 3. 通过 Model 或其实例对集合数据进行 CRUD 操作
 * 	3.1. 通过 Model 实例的 save()添加数据
 * 	3.2. 通过 Model 的 find()/findOne()查询多个或一个数据 
 * 	3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据 
 * 	3.4. 通过 Model 的 remove()删除匹配的数据
 */
const md5 = require('blueimp-md5') // md5加密函数
/* 1. 连接数据库 */
// 1.1. 引入 mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL 只有数据库是变化的) 
mongoose.connect('mongodb://localhost:27017/gzhipin_test')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.once('open', () => {
	console.log('gzhipin_test 数据库连接成功！')
})

/* 2. 得到对应特定集合的 Model */
//	2.1. 字义 Schema(描述文档结构)
const userSchema = mongoose.Schema({
	// type, required, default
	username: {type: String, required: true},
	password: {type: String, required: true},
	type: {type: String, required: true}
})
//	2.2. 定义 Model(与集合对应, 可以操作集合)
// 其值为构造函数
const UserModel = mongoose.model('user', userSchema)

/* 3. 通过 Model 或其实例对集合数据进行 CRUD 操作 */
// 3.1. 通过 Model 实例的 save()添加数据
const testSave = () => {
	// 创建UserModel的实例
	const userModel = new UserModel({username: 'xiaoming', password: md5('123'), type: 'dashen'})
	// 调用save()保存到DB
	userModel.save((err, user) => {
		if (err) {
			console.log('存入数据库失败! Error: ', err)
		} else {
			console.log('存入数据库成功! User: ', user)
		}
	})
}
testSave()
// 3.2. 通过 Model 的 find()/findOne()查询多个或一个数据 
// 3.3. 通过 Model 的 findByIdAndUpdate()更新某个数据 
// 3.4. 通过 Model 的 remove()删除匹配的数据