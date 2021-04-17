import BASE_URL from './bserUrl.js'
export const http = (method) => {
	return (url, data = {}) => {
		let Authorization = null
		try {
			Authorization = uni.getStorageSync('token')
		} catch (e) {

		}
		return new Promise((resolve, reject) => {
			uni.request({
				url: `http://${BASE_URL}:2021${url}`,
				method,
				header: {
					Authorization
				},
				data,
				success(result) {
					if (result.statusCode === 401) {
						uni.reLaunch({
							url: '/pages/index/index'
						})
					}
					resolve(result)
				},
				fail(err) {
					reject(err)
				}
			})
		})
	}
}
