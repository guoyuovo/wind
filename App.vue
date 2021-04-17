<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.getSystemStatusBarHeight()
			// 判断是否登陆
			try {
				const user = JSON.parse(uni.getStorageSync('user'))
				if (user) {
					this.$store.commit("setUser", user)
					// try {
					// 	uni.setStorageSync('token', user.token)
					// } catch (e) {
					// 	// error
					// }
					this.$socket.emit('login', this.$store.state.user)
					uni.redirectTo({
						url: '/pages/friend/friend'
					})
				}
			} catch (e) {
				// error
			}
		},
		onShow: function() {
			console.log('App Show')
			setTimeout(() => {
				// #ifdef APP-PLUS 
				plus.navigator.closeSplashscreen()
				// #endif
			}, 1000)
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			//获取系统状态栏高度
			getSystemStatusBarHeight() {
				let height = 0
				// #ifdef APP-PLUS
				// 获取到的为逻辑像素
				height = plus.navigator.getStatusbarHeight()
				// #endif
				// #ifdef H5
				height = 0
				// #endif
				const {
					screenWidth
				} = uni.getSystemInfoSync()
				const scale = 750 / screenWidth
				// 转换为rpx
				this.$store.commit("setBarHeight", height * scale)
				console.log(this.$store.state.barHeight)
			}
		}
	}
</script>

<style>
	@import url("./static/iconfont.css");

	/*每个页面公共css */
	page {
		height: 100%;
		color: #FFFFFF;
		background-color: #111111;
	}

	view {
		box-sizing: border-box;
	}

	.status_bar {
		height: var(--status-bar-height);
		background-color: #111111;
		width: 100%;
	}

	.w300h90 {
		width: 300px;
		height: 120rpx;
		line-height: 120rpx;
		text-align: center;
		border-radius: 37px;
		cursor: pointer;
	}
</style>
