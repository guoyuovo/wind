<template>
	<view class="main-container" :style="{'padding-top':($store.state.barHeight+90)+'rpx'}">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="main-header" :style="{'top':$store.state.barHeight+'rpx'}">
			<slot name="header"></slot>
		</view>
		<view class="main-content" :style="{'top':($store.state.barHeight+90)+'rpx'}">
			<slot name="content"></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "main-container",
		data() {
			return {

			}
		}
	}
</script>

<style lang="less" scoped>
	.main-container {
		height: 100%;
		background-color: #111111;
		position: relative;

		.main-header {
			width: 100%;
			height: 90rpx;
			text-align: center;
			background-color: #111111;
			color: #FFFFFF;
			position: absolute;
		}

		.main-content {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
		}
	}
</style>
