<template>
	<main-container>
		<template #header>
			<view class="notice-header">
				<back-icon></back-icon>
				<view class="notice-title">通知</view>
			</view>
		</template>
		<template #content>
			<scroll-view class="notice-list" scroll-y="true">
				<view class="no-new-notice" v-if="applyList.length === 0">没有新的通知~</view>
				<apply-friend-item v-else @update="updateStatus" v-for="apply in applyList" :key="apply.id"
					:apply="apply">
				</apply-friend-item>
			</scroll-view>
		</template>
	</main-container>
</template>

<script>
	export default {
		data() {
			return {
				applyList: []
			}
		},
		onLoad() {
			this.getNotice()
		},
		methods: {
			// 获取通知
			async getNotice() {
				const result = await this.$get('/friend/notice')
				if (result.statusCode === 200) {
					this.applyList = result.data || []
				} else {
					this.$message(result.data)
				}
			},
			// 更新好友状态
			async updateStatus(id, applyUserId, friendId) {
				const result = await this.$put('/friend', {
					id,
					applyUserId,
					friendId,
					username: this.$store.state.user.username
				})
				if (result.statusCode === 200) {
					this.$message('添加好友成功~')
					this.getNotice()
				} else {
					this.$message(result.data)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.notice-header {
		height: 90rpx;
		padding: 0 32rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.notice-title {
			height: 90rpx;
			line-height: 90rpx;
			font-weight: 900;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.notice-list {
		height: 100%;

		.no-new-notice {
			height: 80rpx;
			line-height: 80rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
