<template>
	<view class="user-detail-item" @tap="emitTap">
		<view class="user-detail-label">{{label}}</view>
		<view class="user-detail-content">
			<slot></slot>
		</view>
		<view v-if="edit" class="user-detail-update iconfont icon-right"></view>
	</view>
</template>

<script>
	export default {
		name: "user-detail-item",
		props: {
			label: {
				type: String,
				default: ''
			},
			edit: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {

			}
		},
		methods: {
			emitTap() {
				// 如果可以修改 触发事件
				this.edit && this.$emit('update')
			}
		}
	}
</script>

<style lang="less" scoped>
	.user-detail-item {
		min-height: 112rpx;
		display: flex;
		align-items: center;
		padding: 12rpx 0;

		.user-detail-label {
			font-size: 32rpx;
			font-weight: bold;
			margin: 0 32rpx;
		}

		.user-detail-content {
			height: 100%;
			flex: 1;
			overflow: hidden;

			.user-detail-avatar-image {
				width: 104rpx;
				height: 104rpx;
				border-radius: 10px;
			}
		}

		.user-detail-update {
			margin-right: 26rpx;
			margin-left: 12rpx;
			font-size: 38rpx;
		}
	}
</style>
