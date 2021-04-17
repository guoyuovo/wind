import Vue from 'vue'
import App from './App'
import md5 from 'js-md5';
//引入vuex
import store from './store/index.js'
import {
	http
} from './utils/http.js'
import {
	socket
} from './utils/socket.js'
//把vuex定义成全局组件
Vue.prototype.$store = store
// 挂载MD5加密
Vue.prototype.$md5 = md5
Vue.config.productionTip = false
Vue.prototype.$post = http('POST')
Vue.prototype.$get = http('GET')
Vue.prototype.$put = http('PUT')

Vue.prototype.$message = (title) => {
	uni.showToast({
		title,
		icon: 'none'
	})
}
Vue.prototype.$socket = socket

App.mpType = 'app'

const app = new Vue({
	...App,
	//挂载
	store
})
app.$mount()
