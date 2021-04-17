<template>
	<view class="apply-friend-item">
		<image :src="apply.user.avatar" mode="scaleToFill" class="user-avatar"></image>
		<view class="user-info">
			<view class="user-username">{{apply.user.username || ''}}</view>
			<view class="user-message">{{apply.authMessage || ''}}</view>
		</view>
		<view @tap="updateStatus" v-if="apply.status !== 1" class="user-handle">同意</view>
		<view v-else class="user-handle is-friend">已添加</view>
	</view>
</template>

<script>
	export default {
		name: "apply-friend-item",
		props: {
			apply: {
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
			updateStatus() {
				this.$emit('update', this.apply.id, this.apply.userId, this.apply.friendId)
			}
		}
	}
</script>

<style lang="less" scoped>
	.apply-friend-item {
		width: 100%;
		height: 128rpx;
		background-color: #18191D;
		box-sizing: border-box;
		border-bottom: 1px solid #2B2C30;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 32rpx;

		.user-avatar {
			width: 96rpx;
			height: 96rpx;
			border-radius: 12px;
			margin-right: 32rpx;
		}

		.user-info {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			overflow: hidden;

			.user-username {
				font-size: 36rpx;
				font-weight: bold;
			}

			.user-message {
				font-size: 28rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

		.user-handle {
			width: 120rpx;
			height: 48rpx;
			line-height: 48rpx;
			text-align: center;
			border-radius: 12px;
			font-size: 24rpx;
			background-color: #09D4A6;
		}

		.is-friend {
			background-color: #393A3D;
		}
	}
</style>
