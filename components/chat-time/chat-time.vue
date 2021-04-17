<template>
	<view class="chat-time">
		{{time}}
	</view>
</template>

<script>
	export default {
		name: "chat-time",
		props: {
			time: {
				type: String,
				dafault: ''
			}
		},
		data() {
			return {

			}
		}
	}
</script>

<style lang="less" scoped>
	.chat-time {
		width: 100%;
		height: 76rpx;
		line-height: 76rpx;
		font-size: 24rpx;
		color: #888888;
		text-align: center;
	}
</style>
