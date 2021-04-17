export const timeFormate = (date) => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
	const day = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
	const hour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
	const minutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
	const seconds = date.getSeconds() >= 10 ? date.getSeconds() : '0' + date.getSeconds()
	return `${year}-${month}-${day} ${hour}:${minutes}:${seconds}`
}

export const compare = (key) => {
	return (value1, value2) => {
		const val1 = value1[key]
		const val2 = value2[key]
		// return val1 - val2
		return val2 - val1
	}
}

export const handleLastTime = (date) => {
	// 获取当前时间与消息时间进行对比
	const nowTime = new Date()
	const year = date.getFullYear()
	const nowYear = nowTime.getFullYear()
	const month = date.getMonth()
	const nowMonth = nowTime.getMonth()
	const formatMonth = date.getMonth() + 1 >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
	const day = date.getDate()
	const nowDay = nowTime.getDate()
	const formatDay = date.getDate() >= 10 ? date.getDate() : '0' + date.getDate()
	const hour = date.getHours()
	const formatHour = date.getHours() >= 10 ? date.getHours() : '0' + date.getHours()
	const formatMinutes = date.getMinutes() >= 10 ? date.getMinutes() : '0' + date.getMinutes()
	if (nowYear > year) {
		return `${year}-${formatMonth}-${formatDay} ${formatHour}:${formatMinutes}`
	} else if (nowMonth > month) {
		return `${year}-${formatMonth}-${formatDay} ${formatHour}:${formatMinutes}`
	} else {
		if (nowDay - day > 1) {
			return `${year}-${formatMonth}-${formatDay} ${formatHour}:${formatMinutes}`
		} else if (nowDay - day === 1) {
			return `昨天 ${formatHour}:${formatMinutes}`
		} else {
			if (0 <= hour && hour < 6) {
				return `凌晨 ${formatHour}:${formatMinutes}`
			} else if (6 <= hour && hour < 12) {
				return `上午 ${formatHour}:${formatMinutes}`
			} else if (12 <= hour && hour < 18) {
				return `下午 ${formatHour}:${formatMinutes}`
			} else {
				return `晚上 ${formatHour}:${formatMinutes}`
			}
		}
	}
}
