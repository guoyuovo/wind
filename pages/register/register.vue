<template>
	<index-background>
		<back-icon class="back-icon"></back-icon>
		<view class="content">
			<input v-model.trim="username" class="w300h90" type="text" placeholder="请输入用户名">
			<input v-model.trim="email" class="w300h90" type="text" placeholder="请输入邮箱">
			<input v-model.trim="password" password class="w300h90" type="text" placeholder="请输入密码">
			<view @click="register" class="w300h90">注册</view>
		</view>
	</index-background>
</template>

<script>
	import validate from '../../utils/validate.js'
	export default {
		data() {
			return {
				username: '',
				email: '',
				password: ''
			}
		},
		methods: {
			validateForm() {
				if (!this.username) {
					this.$message('用户名不能为空')
					return false
				}
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
			async register() {
				if (this.validateForm()) {
					// localhost
					const result = await this.$post('/user', {
						username: this.username,
						email: this.email,
						password: this.password
					})
					if (result.statusCode === 200) {
						this.$message('注册成功,请登录')
						uni.navigateTo({
							url: `../login/login?email=${this.email}`
						})
					} else {
						this.$message(result.data)
					}
					console.log(result)
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
				margin-bottom: 30rpx;
			}

			&:nth-child(3) {
				margin-bottom: 90rpx;
			}

			&:last-child {
				border: none;
				background-color: #3EB575;
			}
		}
	}
</style>
