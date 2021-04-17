<template>
	<view class="iconfont icon-back" @tap="backToPreviousPage"></view>
</template>

<script>
	export default {
		name: "back-icon",
		data() {
			return {

			}
		},
		methods: {
			backToPreviousPage() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="less" scoped>
	.icon-back {
		font-size: 48rpx;
		color: #FFFFFF;
	}
</style>
