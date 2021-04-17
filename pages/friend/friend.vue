<template>
	<main-container>
		<template #header>
			<view class="friend-header" :style="{'top':$store.state.barHeight+'rpx'}">
				<image @tap="goPage(`/pages/user-home/user-home?userId=${$store.state.user.id}`)"
					:src="$store.state.user.avatar" mode="scaleToFill" class="avatar"></image>
				<view class="title">Wind</view>
				<view class="icon-box">
					<view @tap="goPage('/pages/notice/notice')" class="iconfont icon-notice">
						<view v-if="hasNewNotice" class="new-notice"></view>
					</view>
					<view @tap="goPage('/pages/search-user/search-user')" class="iconfont icon-search"></view>
					<!-- <view @tap="goPage('/pages/search-user/search-user')" class="iconfont icon-add"></view> -->
				</view>
			</view>
		</template>
		<template #content>
			<view class="no-friend" v-if="friendList.length === 0">
				<view class="no-friend-text">一个好友都没有~</view>
				<view class="search-user-button" @tap="goPage('/pages/search-user/search-user')">搜索好友</view>
			</view>
			<scroll-view v-else class="friend-container" scroll-y="true">
				<friend-item v-for="friend of friendList" :key="friend.id" :friend="friend"></friend-item>
			</scroll-view>
		</template>
	</main-container>
</template>

<script>
	import {
		compare,
		handleLastTime
	} from '../../utils/utils.js'
	export default {
		data() {
			return {
				friendList: [],
				hasNewNotice: false
			}
		},
		methods: {
			goPage(url) {
				uni.navigateTo({
					url
				})
			},
			// 判断是否有新通知
			async getHasNewNotice() {
				const result = await this.$get('/friend/notice')
				if (result.statusCode === 200) {
					this.noticeList = result.data || []
					// 判断是否有未审核的通知
					this.hasNewNotice = this.noticeList.some(notice => {
						return notice.status !== 1
					})
				} else {
					this.$message(result.data)
				}
			},
			// 获取好友列表
			async getFriendList() {
				const result = await this.$get('/friend')
				if (result.statusCode === 200) {
					const friendList = result.data || []
					this.getChatList(friendList)
					try {
						const obj = {}
						friendList.forEach(friend => {
							obj[friend.id] = friend
						})
						uni.setStorageSync('friends', JSON.stringify(obj))
					} catch (e) {
						console.log(e)
					}
				} else {
					this.$message(result.data)
				}
			},
			// 更新聊天记录
			getChatList(friendList) {
				this.$get(`/chat/user/${this.$store.state.user.id}`)
					.then(result => {
						if (result.statusCode === 200) {
							const chatList = result.data
							chatList.forEach((chat, index, arr) => {
								chat.timestamp = new Date(chat.createAt).getTime()
								const prevChat = arr[index - 1]
								if (prevChat) {
									if (chat.timestamp - prevChat.timestamp >= 300000) {
										chat.showTime = handleLastTime(new Date(chat.createAt))
									}
								} else {
									chat.showTime = handleLastTime(new Date(chat.createAt))
								}
							})
							const obj = {}
							friendList.forEach((friend, index) => {
								obj[friend.id] = chatList.filter(chat => {
									return chat.fromId === friend.id || chat.toId === friend.id
								})
								friend.lastMessage = obj[friend.id].slice().pop().message
								const lastTime = obj[friend.id].slice().pop().createAt
								friend.lastTime = handleLastTime(new Date(lastTime))
								friend.timestamp = new Date(lastTime).getTime()
							})
							friendList.sort(compare('timestamp'))
							this.friendList = friendList
							try {
								uni.setStorageSync('chats', JSON.stringify(obj))
								uni.$emit('updateChat')
							} catch (e) {
								console.log(e)
							}
						}
					})
			}
		},
		onShow() {
			this.getHasNewNotice()
			this.getFriendList()
			// 有新的通知消息
			this.$socket.on('newNotice', () => {
				this.hasNewNotice = true
				this.$message('有新的通知消息~')
				console.log('有新的通知消息~')
			})

			// 好友申请被通过
			this.$socket.on('applySuccess', (message) => {
				const {
					username
				} = message
				this.$message(`${username}通过了你的好友申请，开始聊天吧~`)
				this.getFriendList()
				console.log(`${username}通过了你的好友申请，开始聊天吧~`)
			})

			// 有新的聊天信息
			this.$socket.on('newChat', () => {
				console.log('newChat')
				this.getFriendList()
			})
		}
	}
</script>

<style lang="less" scoped>
	.friend-header {
		width: 100%;
		height: 90rpx;
		padding: 0 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.avatar {
			width: 68rpx;
			height: 68rpx;
			border-radius: 8px;
			background-color: #FFFFFF;
		}

		.title {
			height: 90rpx;
			line-height: 90rpx;
			font-weight: 900;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
		}

		.icon-box {
			display: flex;

			.icon-notice {
				font-size: 48rpx;
				position: relative;

				.new-notice {
					width: 16rpx;
					height: 16rpx;
					border-radius: 50%;
					background-color: #09D4A6;
					position: absolute;
					top: 0;
					right: 0;
				}
			}

			.icon-search {
				font-size: 48rpx;
				margin-left: 20rpx;
			}

			.icon-add {
				font-size: 52rpx;
				margin-left: 40rpx;
			}
		}
	}

	.friend-container {
		height: 100%;
	}

	.no-friend {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.no-friend-text {
			font-size: 36rpx;
			margin-bottom: 30rpx;
		}

		.search-user-button {
			width: 240rpx;
			height: 96rpx;
			line-height: 96rpx;
			text-align: center;
			font-size: 36rpx;
			border-radius: 24px;
			background-color: #09D4A6;
		}
	}
</style>
