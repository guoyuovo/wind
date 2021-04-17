<template>
	<view class="friend" @tap="toFriendChat">
		<image class="friend-avatar" :src="friend.avatar" mode="scaleToFill"></image>
		<view class="friend-details">
			<view class="friend-info">
				<view class="friend-username">{{friend.username}}</view>
				<view class="friend-lasttime">{{friend.lastTime}}</view>
			</view>
			<view class="friend-message">
				{{friend.lastMessage}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "friend",
		props: {
			friend: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {

			}
		},
		methods: {
			toFriendChat() {
				uni.navigateTo({
					url: `/pages/chat/chat?id=${this.friend.id}`
				})
			}
		}
	}
</script>

<style lang="less">
	.friend {
		width: 100%;
		height: 130rpx;
		// background-color: #18191D;
		background-color: #111111;
		box-sizing: border-box;
		border-bottom: 1px solid #2B2C30;
		display: flex;
		align-items: center;
		padding: 0 20rpx;

		.friend-avatar {
			width: 96rpx;
			height: 96rpx;
			border-radius: 12px;
			margin-right: 20rpx;
		}

		.friend-details {
			height: 96rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			overflow: hidden;
			justify-content: space-around;

			.friend-info {
				display: flex;
				justify-content: space-between;

				.friend-username {
					font-size: 36rpx;
					font-weight: 500;
				}

				.friend-lasttime {
					color: #8C8C8E;
					font-size: 24rpx;
				}
			}

			.friend-message {
				color: #8C8C8E;
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}
</style>
