<template>
	<view class="search-user-item" @tap="goUserHome(user.id,user.isFriend)">
		<view class="user-info">
			<image :src="user.avatar" mode="scaleToFill" class="user-avatar"></image>
			<view class="user-username">{{user.username}}</view>
		</view>
		<view v-if="user.isFriend" class="user-relation is-friend">已添加</view>
		<view v-else class="user-relation">加好友</view>
	</view>
</template>

<script>
	export default {
		name: "search-user-item",
		props: {
			user: {
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
			goUserHome(userId, isFriend) {
				uni.navigateTo({
					url: `/pages/user-home/user-home?userId=${userId}&isFriend=${isFriend}`
				})
			}
		}
	}
</script>

<style lang="less">
	.search-user-item {
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 32rpx;

		.user-info {
			display: flex;
			align-items: center;

			.user-avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 10px;
				background-color: #FFFFFF;
				margin-right: 32rpx;
			}

			.user-username {
				font-size: 36rpx;
				color: #FFFFFF;
			}
		}

		.user-relation {
			width: 120rpx;
			height: 48rpx;
			line-height: 48rpx;
			text-align: center;
			border-radius: 12px;
			font-size: 24rpx;
			color: #FFFFFF;
			background-color: #09D4A6;
		}

		.is-friend {
			background-color: #393A3D;
		}
	}
</style>
