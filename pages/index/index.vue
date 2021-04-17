<template>
	<index-background>
		<view class="content">
			<view class="btn" @tap="goPage('../login/login')">登陆</view>
			<view class="btn" @tap="goPage('../register/register')">注册</view>
		</view>
	</index-background>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad(data) {
			// 判断是否提示重新登陆
			const {
				reLogin
			} = data
			if (reLogin) {
				this.$message('账户退出成功，请重新登陆~')
			}
		},
		methods: {
			goPage(url) {
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.content {
		position: absolute;
		bottom: 180rpx;

		.btn {
			width: 600rpx;
			height: 120rpx;
			line-height: 120rpx;
			text-align: center;
			border-radius: 37px;
			cursor: pointer;

			&:first-child {
				background-color: #3EB575;
				color: #FFFFFF;
				margin-bottom: 30rpx;
			}

			&:last-child {
				background-color: #FFFFFF;
				color: #18191D;
			}
		}
	}
</style>
