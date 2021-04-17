<template>
	<main-container>
		<template #header>
			<view class="search-header" :style="{'top':$store.state.barHeight+'rpx'}">
				<input v-model.trim="value" @confirm="search" confirm-type="search" focus class="search-input"
					type="text" placeholder="请输入用户名/邮箱进行搜索">
				<view @tap="backChat" class="search-cancel">取消</view>
			</view>
		</template>
		<template #content>
			<scroll-view class="user-list" scroll-y="true">
				<search-user-item v-for="user of userList" :key="user.id" :user="user">
				</search-user-item>
				<view class="no-result" v-if="noResult">该用户不存在</view>
			</scroll-view>
		</template>
	</main-container>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				userList: [],
				noResult: false
			}
		},
		methods: {
			backChat() {
				uni.navigateBack()
			},
			async search() {
				if (!this.value) {
					this.$message('请输入用户名/邮箱进行搜索')
					return false
				}
				const result = await this.$get('/user', {
					value: this.value
				})
				if (result.statusCode === 200) {
					this.userList = result.data || []
					this.noResult = this.userList.length > 0 ? false : true
				} else {
					this.$message(result.data)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.search-header {
		width: 100%;
		height: 90rpx;
		text-align: left;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 32rpx;
		border-bottom: 1px solid #2B2C30;
		box-sizing: border-box;

		.search-input {
			flex: 1;
			height: 60rpx;
			border-radius: 5px;
			background-color: #393A3D;
			padding-left: 10px;
			box-sizing: border-box;
			font-size: 28rpx;
		}

		.search-cancel {
			margin-left: 30rpx;
			font-size: 28rpx;
		}
	}

	.user-list {
		height: 100%;
	}

	.no-result {
		height: 80rpx;
		line-height: 80rpx;
		font-size: 28rpx;
		color: #FFFFFF;
		text-align: center;
	}
</style>
