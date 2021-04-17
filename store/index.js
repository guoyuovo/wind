import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
	state: {
		user: {},
		barHeight: 0
	},
	mutations: {
		setUser(state, user) {
			state.user = user
		},
		setBarHeight(state, barHeight) {
			state.barHeight = barHeight
		},
	},
	actions: {}
})
export default store
