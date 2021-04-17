<template>
	<main-container>
		<template #header>
			<view class="detail-header">
				<back-icon></back-icon>
				<view class="detail-title">详情</view>
			</view>
		</template>
		<template #content>
			<view class="detail-info">
				<user-detail-item label="头像" :edit="canEdit">
					<image @tap="updateUserInfo('avatar')" class="user-detail-avatar-image" :src="userInfo.avatar"
						mode="scaleToFill"></image>
				</user-detail-item>
				<user-detail-item label="签名" :edit="canEdit">
					<view class="slot" @tap="updateUserInfo('signature')">
						{{userInfo.signature}}
					</view>
				</user-detail-item>
				<user-detail-item label="注册" :edit="false">
					<view class="slot">
						{{userInfo.createAt}}
					</view>
				</user-detail-item>
				<user-detail-item label="昵称" :edit="canEdit">
					<view class="slot" @tap="updateUserInfo('username')">
						{{userInfo.username}}
					</view>
				</user-detail-item>
				<user-detail-item label="性别" :edit="canEdit">
					<picker :disabled="!canEdit" @change="onGenderChange" class="slot" mode="selector"
						:range="genderList" :value="genderIndex">
						<view>{{userInfo.gender}}</view>
					</picker>
				</user-detail-item>
				<user-detail-item label="生日" :edit="canEdit">
					<picker :disabled="!canEdit" @change="onBirthdayChange" class="slot" mode="date"
						:value="userInfo.birthday">
						<view>{{userInfo.birthday}}</view>
					</picker>
				</user-detail-item>
				<user-detail-item label="电话" :edit="canEdit">
					<view class="slot" @tap="updateUserInfo('phone')">
						{{userInfo.phone}}
					</view>
				</user-detail-item>
				<user-detail-item label="邮箱" :edit="canEdit">
					<view class="slot" @tap="updateUserInfo('email')">
						{{userInfo.email}}
					</view>
				</user-detail-item>
				<user-detail-item v-if="canEdit" label="密码">
					<view class="slot" @tap="updateUserInfo('password')">
						{{'●●●●●●●●'}}
					</view>
				</user-detail-item>
				<view v-if="canEdit" @tap="logout" class="logout">
					退出应用
				</view>
				<view class="detail-input-dialog" :class="{show:addShow,hide:addHide}">
					<textarea class="detail-textarea" v-model="updateValue" placeholder="" />
					<view class="update-box">
						<view @tap="hideDialog" class="update-cancel">取消</view>
						<view @tap="handleUpdate" class="update-send">修改</view>
					</view>
				</view>
			</view>
		</template>
	</main-container>
</template>

<script>
	import {
		timeFormate
	} from '../../utils/utils.js'
	import validate from '../../utils/validate.js'
	export default {
		data() {
			return {
				userId: '',
				userInfo: {},
				addShow: false,
				addHide: false,
				updateValue: '',
				genderIndex: 0,
				genderList: ['未知', '女', '男'],
				// 当前修改的字段
				key: '',
				canEdit: false
			}
		},
		onLoad(data) {
			const {
				userId
			} = data
			this.userId = +userId
			if (this.userId === this.$store.state.user.id) {
				this.canEdit = true
			}
			this.getUserInfo()
		},
		methods: {
			// 发送更新请求
			async sendUpdate() {
				const result = await this.$put('/user', this.userInfo)
				if (result.statusCode === 200) {
					this.getUserInfo()
					this.$message('修改个人信息成功~')
				} else {
					this.$message(result.data)
				}
			},
			// 点击修改处理更新数据
			handleUpdate() {
				if (this.key === 'password') {
					if (!this.updateValue.trim()) {
						this.$message('密码不能为空')
						return false
					} else {
						if (this.updateValue.trim().length < 6 || this.updateValue.trim().length > 18) {
							this.$message('请输入6-18位的密码')
							return false
						}
					}
					this.userInfo.password = this.$md5(this.updateValue.trim())
				} else if (this.key === 'email') {
					if (!this.updateValue.trim()) {
						this.$message('邮箱不能为空')
						return false
					} else {
						if (!validate.email(this.updateValue.trim())) {
							this.$message('请输入正确的邮箱')
							return false
						}
					}
					this.userInfo[this.key] = this.updateValue.trim()
				} else if (this.key === 'phone') {
					if (!this.updateValue.trim()) {
						this.$message('手机号不能为空')
						return false
					} else {
						if (!validate.phone(this.updateValue.trim())) {
							this.$message('请输入正确的手机号')
							return false
						}
					}
					this.userInfo[this.key] = this.updateValue.trim()
				} else {
					this.userInfo[this.key] = this.updateValue.trim()
				}
				this.hideDialog()
				this.sendUpdate()
			},
			// 更新用户信息
			updateUserInfo(key) {
				if (!this.canEdit) {
					return
				}
				this.key = key
				if (this.key === 'avatar') {
					uni.chooseImage({
						count: 1,
						success: (res) => {
							console.log(res.tempFilePaths)
							console.log(res.tempFiles)
							let url = ''
							if (process.env.NODE_ENV === 'development') {
								url = 'http://localhost:2021'
								console.log('开发环境')
							} else {
								url = 'http://106.55.160.184:2021'
								console.log('生产环境')
							}
							let Authorization = null
							try {
								Authorization = uni.getStorageSync('token')
							} catch (e) {

							}
							uni.uploadFile({
								url: `${url}/upload/avatar`,
								filePath: res.tempFilePaths[0],
								name: 'avatar',
								header: {
									Authorization
								},
								success: result => {
									if (result.statusCode === 200 && result.data) {
										this.userInfo.avatar = result.data
										this.sendUpdate()
									}
								},
								fail(err) {
									console.log(err)
								}
							})
						}
					})
				} else if (this.key === 'password') {
					this.addShow = true
					this.addHide = false
					this.$forceUpdate()
				} else {
					this.updateValue = this.userInfo[this.key]
					this.addShow = true
					this.addHide = false
					this.$forceUpdate()
				}
			},
			// 用户选择生日
			onBirthdayChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.userInfo.birthday = e.target.value
				this.sendUpdate()
			},
			// 用户选择性别
			onGenderChange(e) {
				console.log('picker发送选择改变，携带值为', e.target.value)
				this.genderIndex = e.target.value
				this.userInfo.gender = this.genderList[this.genderIndex]
				this.sendUpdate()
			},
			// 关闭修改弹框
			hideDialog() {
				this.addShow = false
				this.addHide = true
				this.updateValue = ''
				this.key = ''
			},
			// 获取用户信息
			async getUserInfo() {
				const result = await this.$get(`/user/${this.userId}`)
				if (result.statusCode === 200) {
					this.userInfo = result.data || {}
					if (this.userInfo.id === this.$store.state.user.id) {
						// 保存更新后的数据到vuex
						this.$store.commit("setUser", this.userInfo)
						try {
							uni.setStorageSync('user', JSON.stringify(this.userInfo))
						} catch (e) {
							// error
						}
					}
					const date = timeFormate(new Date(this.userInfo.createAt))
					this.userInfo.createAt = date
					this.genderIndex = this.genderList.indexOf(this.userInfo.gender)
				} else {
					this.$message(result.data)
				}
			},
			// 退出登陆
			logout() {
				uni.showModal({
					title: '此操作将退出当前账号，是否继续?',
					confirmColor: '#FF5D5B',
					success: res => {
						if (res.confirm) {
							this.$socket.emit('logout', this.$store.state.user)
							this.$store.commit("setUser", {})
							try {
								uni.clearStorageSync()
							} catch (e) {
								// error
								console.log(e)
							}
							uni.reLaunch({
								url: '/pages/index/index?reLogin=true'
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	@keyframes dialogShow {
		from {
			transform: translateY(100%);
		}

		to {
			transform: translateY(0%);
		}
	}

	@keyframes dialogHide {
		from {
			transform: translateY(0%);
		}

		to {
			transform: translateY(100%);
		}
	}

	.show {
		animation: dialogShow 0.3s linear both;
	}

	.hide {
		animation: dialogHide 0.3s linear both;
	}

	.detail-header {
		height: 90rpx;
		padding: 0 32rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		.detail-title {
			height: 90rpx;
			line-height: 90rpx;
			font-weight: 900;
			position: absolute;
			top: 0;
			left: 50%;
			transform: translateX(-50%);
		}
	}

	.detail-info {
		height: 100%;
		display: flex;
		flex-direction: column;
		position: relative;

		.slot {
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}

		.user-detail-avatar-image {
			width: 104rpx;
			height: 104rpx;
			border-radius: 10px;
		}

		.logout {
			width: 100%;
			position: absolute;
			bottom: 94rpx;
			font-size: 36rpx;
			color: #FF5D5B;
			text-align: center;
		}

		.detail-input-dialog {
			width: 100%;
			height: 100%;
			background-color: rgba(0, 0, 0, 0.8);
			position: fixed;
			padding: 30rpx;
			transform: translateY(100%);
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 10;
			display: flex;
			flex-direction: column;
			justify-content: flex-end;

			.detail-textarea {
				width: 100%;
				border-radius: 20px;
				padding: 30rpx;
				box-sizing: border-box;
				background-color: #2B2C30;
				margin-bottom: 180rpx;
			}

			.update-box {
				width: 100%;
				height: 80rpx;
				line-height: 80rpx;
				left: 0;
				bottom: 76rpx;
				padding: 0 32rpx;
				position: absolute;
				display: flex;
				justify-content: space-between;
				text-align: center;
				color: #FFFFFF;

				.update-cancel {
					width: 172rpx;
					height: 80rpx;
					border-radius: 5px;
					background-color: #393A3D;
				}

				.update-send {
					width: 480rpx;
					height: 80rpx;
					border-radius: 5px;
					background-color: #09D4A6;
				}
			}
		}
	}
</style>
