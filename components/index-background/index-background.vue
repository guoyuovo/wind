<template>
	<view class="index-background">
		<view class="wind"><span class="big">W</span>ind</view>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		name: "index-background",
		data() {
			return {

			}
		}
	}
</script>

<style lang="less" scoped>
	.index-background {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100%;
		background-color: #18191D;
		position: relative;

		.wind {
			height: 200rpx;
			text-align: center;
			margin-top: 200rpx;
			margin-bottom: 50rpx;
			color: #FFFFFF;
			font-weight: 400;
			font-size: 40px;

			.big {
				font-size: 90px;
			}
		}
	}
</style>
