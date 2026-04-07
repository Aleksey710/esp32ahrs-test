import { createRouter, createWebHistory } from 'vue-router'

import Home from '../components/views/Home.vue'

import IMUView from '../components/views/charts/IMUView.vue'
import AccelView from '../components/views/charts/AccelView.vue'
import GyroView from '../components/views/charts/GyroView.vue'
import MagView from '../components/views/charts/MagView.vue'

import NotFoundView from '../components/views/NotFoundView.vue'

// Для упрощения укажем это в переменной
const isAuthenticated = false

const router = createRouter({
	routes: [
		{
			path: '/',
			name: 'Home',
			component: Home
		},
		{
			path: '/imu',
			name: 'IMUView',
			component: IMUView,
			children: [
				{
					path: '/AccelView' 
					,name: 'AccelView'
					//,component: () => import ('../components/views/charts/AccelView.vue') 
					,component: AccelView
					//,meta: {
					//	requiresAuth: true
					//}
				},
				{
					path: '/GyroView' 
					,name: 'GyroView'
					,component: GyroView
					//,meta: {
					//	requiresAuth: true
					//}
				}
			]
		},
		{
			path: '/AccelView',
			component: AccelView,
			//children: [
			//  { path: 'stats', component: StatsView }
			//]
		},
		{
			path: '/GyroView',
			component: GyroView,
			//children: [
			//  { path: 'stats', component: StatsView }
			//]
		},
		{
			path: '/MagView',
			component: MagView,
			//children: [
			//  { path: 'stats', component: StatsView }
			//]
		},
		{
			path: '/:pathMatch(.*)*',
			name: '404',
			component: NotFoundView
		}
	],
	history: createWebHistory()
})

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth && !isAuthenticated) {
    return {
      name: 'Home'
    }
  }
})

export default router;

