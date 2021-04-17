<template>
	<main-container>
		<template #header>
			<view class="user-header">
				<back-icon></back-icon>
				<view @tap="toUserDetail" class="iconfont icon-shenglvehao"></view>
			</view>
		</template>
		<template #content>
			<view v-show="!addAreaFlag" class="user-info">
				<image :src="userInfo.avatar" mode="scaleToFill" class="user-avatar"></image>
				<view class="user-username">{{userInfo.username}}</view>
				<view class="user-signature">{{userInfo.signature}}</view>
				<!-- <view v-if="isFriend && userId != $store.state.user.id" class="is-friend">发消息</view> -->
				<view v-if="!isFriend && userId != $store.state.user.id" class="add-friend" @tap="showAddArea">加好友
				</view>
			</view>
			<view v-show="addAreaFlag" class="add-area">
				<view class="add-dialog">
					<image :src="userInfo.avatar" mode="scaleToFill" class="add-user-avatar"></image>
					<view class="add-user-username">{{userInfo.username}}</view>
					<textarea class="auth-message" v-model="authMessage" placeholder="亲爱的,快点来到我这里~" />
					<view class="add-box">
						<view @tap="hideAddArea" class="add-cancel">取消</view>
						<view @tap="sendApply" class="add-send">发送</view>
					</view>
				</view>
			</view>
		</template>
	</main-container>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: {},
				addAreaFlag: false,
				authMessage: '',
				userId: '',
				isFriend: false
			}
		},
		onLoad(data) {
			const {
				userId,
				isFriend
			} = data
			this.userId = userId
			this.isFriend = isFriend === 'false' ? false : true
		},
		onShow() {
			this.getUserInfo()
		},
		methods: {
			// 获取用户详情
			async getUserInfo() {
				const result = await this.$get(`/user/${this.userId}`)
				if (result.statusCode === 200) {
					this.userInfo = result.data || {}
				} else {
					this.$message(result.data)
				}
			},
			// 查看用户详情
			toUserDetail() {
				uni.navigateTo({
					url: `/pages/user-detail/user-detail?userId=${this.userId}`
				})
			},
			// 显示添加好友信息框
			showAddArea() {
				console.log(this.$store.state.user)
				this.authMessage = `${this.$store.state.user.username}想和你交个朋友哦~`
				this.addAreaFlag = true
			},
			// 隐藏添加好友信息框
			hideAddArea() {
				this.addAreaFlag = false
			},
			// 发送好友申请
			async sendApply() {
				const result = await this.$post('/friend', {
					userId: this.$store.state.user.id,
					friendId: this.userInfo.id,
					authMessage: this.authMessage
				})
				console.log(result)
				if (result.statusCode === 200) {
					this.hideAddArea()
					this.$message('发送好友申请成功~')
				} else {
					this.$message(result.data)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.user-header {
		height: 90rpx;
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.iconfont {
			color: #FFFFFF;
			font-size: 48rpx;
		}
	}

	.user-info {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;

		.user-avatar {
			width: 400rpx;
			height: 400rpx;
			border-radius: 24px;
			margin-top: 60rpx;
			margin-bottom: 48rpx;
		}

		.user-username {
			color: #FFFFFF;
			font-size: 52rpx;
			margin-bottom: 60rpx;
		}

		.user-signature {
			color: #FFFFFF;
			width: 550rpx;
			font-size: 28rpx;
		}

		.add-friend {
			width: 684rpx;
			height: 80rpx;
			border-radius: 5px;
			line-height: 80rpx;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			background-color: #09D4A6;
			position: absolute;
			bottom: 76rpx;
		}

		.is-friend {
			width: 684rpx;
			height: 80rpx;
			border-radius: 5px;
			line-height: 80rpx;
			font-size: 32rpx;
			color: #FFFFFF;
			text-align: center;
			background-color: #393A3D;
			position: absolute;
			bottom: 76rpx;
		}
	}

	.add-area {
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;

		.add-dialog {
			flex: 1;
			margin-top: 196rpx;
			border-radius: 20px 20px 0 0;
			padding: 0 60rpx;
			position: relative;
			background-color: #2B2C30;

			.add-user-avatar {
				width: 240rpx;
				height: 240rpx;
				border-radius: 50%;
				position: absolute;
				top: -120rpx;
				left: 60rpx;
			}

			.add-user-username {
				color: #FFFFFF;
				font-size: 52rpx;
				margin: 168rpx 0 40rpx 60rpx;
			}

			.auth-message {
				width: 100%;
				height: 500rpx;
				border-radius: 10px;
				background-color: #393A3D;
				color: #FFFFFF;
				font-size: 32rpx;
				padding: 18rpx;
				box-sizing: border-box;
			}

			.add-box {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				left: 0;
				bottom: 76rpx;
				padding: 0 32rpx;
				position: absolute;
				display: flex;
				justify-content: space-between;
				text-align: center;
				color: #FFFFFF;

				.add-cancel {
					width: 172rpx;
					height: 80rpx;
					border-radius: 5px;
					background-color: #393A3D;
				}

				.add-send {
					width: 480rpx;
					height: 80rpx;
					border-radius: 5px;
					background-color: #09D4A6;
				}
			}
		}
	}
</style>
