<template>
	<index-background>
		<back-icon class="back-icon"></back-icon>
		<view class="content">
			<input v-model="email" class="w300h90" type="text" placeholder="请输入邮箱">
			<input v-model="password" password class="w300h90" type="text" placeholder="请输入密码">
			<view class="w300h90" @click="login">登陆</view>
		</view>
	</index-background>
</template>

<script>
	import validate from '../../utils/validate.js'
	export default {
		data() {
			return {
				email: '',
				password: ''
			}
		},
		onLoad(data) {
			const {
				email
			} = data
			this.email = email || ''
		},
		methods: {
			validateForm() {
				if (!this.email) {
					this.$message('邮箱不能为空')
					return false
				} else {
					if (!validate.email(this.email)) {
						this.$message('请输入正确的邮箱')
						return false
					}
				}
				if (!this.password) {
					this.$message('密码不能为空')
					return false
				} else {
					if (this.password.length < 6 || this.password.length > 18) {
						this.$message('请输入6-18位的密码')
						return false
					}
				}
				return true
			},
			async login() {
				if (this.validateForm()) {
					// localhost
					const result = await this.$post('/login', {
						email: this.email,
						password: this.$md5(this.password.trim())
					})
					console.log(result)
					if (result.statusCode === 200) {
						this.$message(result.data)
						this.$store.commit("setUser", result.data)
						try {
							uni.setStorageSync('token', result.data.token)
						} catch (e) {
							// error
						}
						try {
							uni.setStorageSync('user', JSON.stringify(result.data))
						} catch (e) {
							// error
						}
						this.$socket.emit('login', this.$store.state.user)
						uni.reLaunch({
							url: '/pages/friend/friend'
						})
					} else {
						this.$message(result.data)
					}
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.back-icon {
		position: absolute;
		top: 80rpx;
		left: 50rpx;
	}

	.content {
		position: absolute;
		bottom: 90rpx;

		.w300h90 {
			border: 1px solid #FFFFFF;
			color: #FFFFFF;

			&:first-child {
				margin-bottom: 30rpx;
			}

			&:nth-child(2) {
				margin-bottom: 90rpx;
			}

			&:last-child {
				border: none;
				background-color: #3EB575;
			}
		}
	}
</style>
