<template>
	<view>
		<chat-time v-if="chatInfo.showTime" :time="chatInfo.showTime"></chat-time>
		<view :class="chatInfo.userId === $store.state.user.id ? 'is-from':'is-to'" class="chat-item">
			<image @tap="goUserHome()" class="user-avatar" :src="chatInfo.avatar" mode="scaleToFill">
			</image>
			<view class="user-message">{{chatInfo.message}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "chat-item",
		props: {
			chatInfo: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		methods: {
			goUserHome() {
				uni.navigateTo({
					url: `/pages/user-home/user-home?userId=${this.chatInfo.userId}&isFriend=true`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.chat-item {
		display: flex;
		padding: 10rpx 32rpx;

		.user-avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 10px;
		}

		.user-message {
			max-width: 64%;
			padding: 16rpx 22rpx;
			margin: 0 16rpx;
			font-size: 32rpx;
		}
	}

	.is-to {
		.user-message {
			background-color: #2C2C2C;
			border-radius: 0 10px 10px 10px;
			word-break: break-all;
		}
	}

	.is-from {
		flex-direction: row-reverse;

		.user-message {
			color: #111111;
			background-color: #3EB575;
			border-radius: 10px 0 10px 10px;
		}
	}
</style>
