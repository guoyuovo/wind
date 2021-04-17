class Validate {
	email(value) {
		const reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
		return reg.test(value)
	}
	phone(value) {
		const reg = new RegExp("^[1][3,4,5,6,7,8,9][0-9]{9}$")
		return reg.test(value)
	}
}

module.exports = new Validate()
