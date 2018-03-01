import Vue from 'vue'
import Router from 'vue-router'
import VueResource from 'vue-resource'
import goods from 'components/goods/goods'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

Vue.use(Router)
Vue.use(VueResource)

const routes = [
	{path: '/', component: goods},
	{path: '/goods', component: goods},
	{path: '/ratings', component: ratings},
	{path: '/seller', component: seller}
]

export default new Router({
  linkActiveClass: 'active', // 默认添加v-link-active
  routes  // 缩写，相当于routes:routes
})
