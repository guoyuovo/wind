<template>
	<view class="chat-container" :style="{'padding-top':($store.state.barHeight+90)+'rpx'}">
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="chat-header" :style="{'top':$store.state.barHeight+'rpx'}">
			<back-icon></back-icon>
			<view class="chat-title">{{title || friendInfo.username}}</view>
			<view @tap="toUserDetail" class="iconfont icon-shenglvehao"></view>
		</view>
		<scroll-view :style="{'top':($store.state.barHeight+90)+'rpx','bottom':showBigContainer?'500rpx':'100rpx'}"
			:scroll-top='scrollTop' class="chat-message-container" scroll-y="true">
			<chat-item :key="index" v-for="(chat,index) of chatList" :chatInfo="chat"></chat-item>
		</scroll-view>
		<view class="chat-send-container" :class="{show:showBigContainer}">
			<view class="send-mini-container">
				<view v-show="!voiceVisible" @tap="showVoiceButon" class="iconfont icon-voice-circle">
				</view>
				<view v-show="voiceVisible" @tap="voiceVisible = false" class="iconfont icon-keyboard">
				</view>
				<view v-show="voiceVisible" class="chat-voice">按住 说话</view>
				<textarea @focus="onFocus" v-show="!voiceVisible" v-model="message" class="chat-text"
					type="text"></textarea>
				<view v-show="!emojiVisible" @tap="showEmoji" class="iconfont icon-smile"></view>
				<view v-show="emojiVisible" @tap="hideBigContainer" class="iconfont icon-keyboard keyboard">
				</view>
				<view @tap="showMore" v-show="!sendVisible" class="iconfont icon-add-circle"></view>
				<view @touchend.prevent="sendMessage" v-show="sendVisible" class="send-button">发送</view>
			</view>
			<scroll-view v-show="emojiVisible" class="emoji-scroll" scroll-y="true">
				<view class="emoji-container">
					<view @tap="addEmoji(emoji)" class="emoji" :key="index" v-for="(emoji,index) of emojiData">
						{{emoji}}
					</view>
				</view>
				<view class="delete-button">
					<view @tap="deleteMessage" class="iconfont icon-delete"></view>
				</view>
			</scroll-view>
			<view v-show="moreVisible" class="more">
				<view class="more-item">图片</view>
				<view class="more-item">视频</view>
				<view class="more-item">拍照</view>
				<view class="more-item">地图</view>
				<view class="more-item">红包</view>
				<view class="more-item">转账</view>
				<view class="more-item">卡包</view>
				<view class="more-item">分享</view>
			</view>
		</view>
	</view>
</template>

<script>
	import emoji from "../../static/emoji";
	import {
		handleLastTime
	} from '../../utils/utils.js'
	export default {
		data() {
			return {
				title: '',
				scrollTop: 0,
				emojiData: [],
				friendId: '',
				friendInfo: {},
				chatList: [],
				message: '',
				sendVisible: false,
				voiceVisible: false,
				showBigContainer: false,
				emojiVisible: false,
				moreVisible: false
			}
		},
		watch: {
			message(newVal) {
				this.sendVisible = newVal.length > 0
				if (newVal.length > 0) {
					this.$socket.emit('isInputting', {
						fromId: this.$store.state.user.id,
						toId: this.friendId
					})
				} else {
					this.$socket.emit('notInputting', {
						fromId: this.$store.state.user.id,
						toId: this.friendId
					})
				}
				this.$forceUpdate()
			},
			showBigContainer(newVal) {
				if (newVal) {
					this.scrollTop += 1
				}
			}
		},
		onHide() {
			this.$socket.emit('notInputting', {
				fromId: this.$store.state.user.id,
				toId: this.friendId
			})
		},
		onUnload() {
			this.$socket.emit('notInputting', {
				fromId: this.$store.state.user.id,
				toId: this.friendId
			})
		},
		onLoad(data) {
			this.$socket.on('isInputting', message => {
				const {
					fromId
				} = message
				if (fromId === this.friendId) {
					this.title = '用户正在输入...'
				}
			})
			this.$socket.on('notInputting', message => {
				const {
					fromId
				} = message
				if (fromId === this.friendId) {
					this.title = ''
				}
			})
			const {
				id
			} = data
			this.friendId = +id
			try {
				const friends = JSON.parse(uni.getStorageSync('friends')) || {}
				this.friendInfo = friends[this.friendId]
			} catch (e) {
				console.log(e)
			}
			this.emojiData = emoji
			uni.$on('updateChat', this.updateChat)
		},
		onShow() {
			this.updateChat()
			this.$nextTick(() => {
				this.scrollTop = 999999
			})
		},
		methods: {
			// 点击发送按钮发送消息
			async sendMessage() {
				if (!this.message) {
					return this.$message('不能发送空白消息~')
				}
				let showTime = ''
				const lastChat = this.chatList[this.chatList.length - 1]
				if (lastChat) {
					console.log(new Date(Date.now()).getHours())
					const timestamp = Date.now()
					if (timestamp - lastChat.timestamp >= 300000) {
						showTime = handleLastTime(new Date(timestamp))
					}
				}
				this.chatList.push({
					userId: this.$store.state.user.id,
					avatar: this.$store.state.user.avatar,
					message: this.message,
					type: 1,
					showTime: showTime
				})
				const message = this.message
				this.message = ''
				const result = await this.$post('/chat/user', {
					fromId: this.$store.state.user.id,
					toId: this.friendId,
					message: message,
					type: 1
				})
			},
			// 更新聊天记录
			updateChat() {
				try {
					const chats = JSON.parse(uni.getStorageSync('chats')) || {}
					const nowChat = chats[this.friendInfo.id]
					this.chatList = nowChat.map(item => {
						return {
							userId: item.fromId,
							avatar: item.fromId === this.friendId ? this.friendInfo.avatar : this.$store.state.user
								.avatar,
							timestamp: item.timestamp,
							message: item.message,
							type: item.type,
							showTime: item.showTime
						}
					})
					this.$nextTick(() => {
						this.scrollTop += 1
					})
				} catch (e) {
					console.log(e)
				}
			},
			// 输入框获取焦点
			onFocus() {
				this.scrollTop += 1
				this.voiceVisible = false
				this.showBigContainer = false
				this.emojiVisible = false
				this.moreVisible = false
			},
			// 显示更多功能
			showMore() {
				this.voiceVisible = false
				this.showBigContainer = true
				this.emojiVisible = false
				this.moreVisible = true
			},
			// 隐藏表情输入框
			hideBigContainer() {
				this.voiceVisible = false
				this.showBigContainer = false
				this.emojiVisible = false
				this.moreVisible = false
			},
			// 显示表情输入框
			showEmoji() {
				this.voiceVisible = false
				this.showBigContainer = true
				this.emojiVisible = true
				this.moreVisible = false
			},
			// 删除表情
			deleteMessage() {
				let number = this.message.substr(this.message.length - 2, this.message.length).search(
					/(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f])|(\ud83d[\ude80-\udeff])/i) == -1 ? 1 : 2
				this.message = this.message.substr(0, this.message.length - number)
			},
			// 点击表情输入表情
			addEmoji(emoji) {
				this.message += emoji
				this.$forceUpdate()
			},
			// 显示录音按钮
			showVoiceButon() {
				this.voiceVisible = true
				this.showBigContainer = false
				this.emojiVisible = false
				this.moreVisible = false
			},
			// 查看用户详情
			toUserDetail() {
				uni.navigateTo({
					url: `/pages/user-detail/user-detail?userId=${this.friendId}`
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.chat-container {
		height: 100%;
		background-color: #111111;
		position: relative;

		.chat-header {
			width: 100%;
			height: 90rpx;
			padding: 0 32rpx;
			background-color: #111111;
			display: flex;
			justify-content: space-between;
			align-items: center;
			position: fixed;

			.detail-title {
				height: 90rpx;
				line-height: 90rpx;
				font-weight: 900;
				position: absolute;
				top: 0;
				left: 50%;
				transform: translateX(-50%);
			}

			.iconfont {
				color: #FFFFFF;
				font-size: 48rpx;
			}
		}
	}

	@keyframes containerShow {
		from {
			transform: translateY(400rpx);
		}

		to {
			transform: translateY(0rpx);
		}
	}

	@keyframes containerHide {
		from {
			transform: translateY(0rpx);
		}

		to {
			transform: translateY(400rpx);
		}
	}

	.show {
		animation: containerShow 0.3s linear both;
	}

	.hide {
		animation: containerHide 0.3s linear both;
	}

	.slider {
		width: 375;
		height: 128;

		&-emoji {
			width: 40rpx;
			flex-direction: row;
			flex-wrap: wrap;
			justify-content: center;

			&-icon {
				width: 40rpx;
				text-align: center;
				padding: 10.5 0;
			}
		}
	}

	.chat-message-container {
		position: absolute;
		top: 0;
		bottom: 100rpx;
		left: 0;
		right: 0;
	}

	.chat-send-container {
		width: 100%;
		height: 500rpx;
		transform: translateY(400rpx);
		background-color: #1E1E1E;
		position: fixed;
		bottom: 0;

		.send-mini-container {
			width: 100%;
			height: 100rpx;
			background-color: #1E1E1E;
			display: flex;
			align-items: center;
			padding: 0 32rpx;

			.chat-voice {
				height: 72rpx;
				background-color: #292929;
				border-radius: 5px;
				flex: 1;
				box-sizing: border-box;
				padding: 10rpx;
				margin-left: 20rpx;
				text-align: center;
			}

			.chat-text {
				height: 72rpx;
				background-color: #292929;
				border-radius: 5px;
				flex: 1;
				box-sizing: border-box !important;
				padding: 10rpx;
				text-indent: 10rpx;
				margin-left: 20rpx;
				font-size: 32rpx;
			}

			.iconfont {
				font-size: 56rpx;
				color: #CCCCCC;
			}

			.icon-smile {
				margin: 0 20rpx;
			}

			.keyboard {
				margin: 0 20rpx;
			}

			.send-button {
				width: 100rpx;
				height: 60rpx;
				font-size: 28rpx;
				line-height: 60rpx;
				border-radius: 5px;
				text-align: center;
				background-color: #07C160;
			}
		}

		.emoji-scroll {
			position: absolute;
			top: 100rpx;
			bottom: 0;
			left: 0;
			right: 0;

			.delete-button {
				position: fixed;
				background-color: #111111;
				height: 60rpx;
				width: 120rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 5px;
				right: 30rpx;
				bottom: 30rpx;

				.iconfont {
					font-size: 48rpx;
				}
			}

			.emoji-container {
				display: flex;
				flex-wrap: wrap;

				.emoji {
					width: 12.5%;
					font-size: 50rpx;
					text-align: center;
				}
			}
		}

		.more {
			height: 400rpx;
			display: flex;
			flex-wrap: wrap;

			.more-item {
				width: 25%;
				height: 200rpx;
				text-align: center;
				line-height: 200rpx;
			}
		}
	}
</style>
