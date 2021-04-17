import io from '@hyoga/uni-socket.io';
import BASE_URL from './bserUrl.js'
export const socket = io(`ws://${BASE_URL}:9999`, {
	query: {},
	transports: ['websocket', 'polling'],
	timeout: 5000
})
socket.on('connect', () => {
	// ws连接已建立，此时可以进行socket.io的事件监听或者数据发送操作
	console.log('ws 已连接')
	// socket.io 唯一连接id，可以监控这个id实现点对点通讯
	const {
		id
	} = socket
	socket.on(id, (message) => {
		// 收到服务器推送的消息，可以跟进自身业务进行操作
		console.log('ws 收到服务器消息：', message)
	})

	socket.on('error', (msg) => {
		console.log('ws error', msg)
	})
})
