import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// ----------------------------------------------------------------------
// Auth mock

const isAuthenticated: boolean = false

// ----------------------------------------------------------------------
// Routes

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: () => import('../components/views/Home.vue')
	},

	{
		path: '/imu',
		name: 'IMUView',
		component: () => import('../components/views/charts/IMUView.vue'),
		children: [
			{
				path: 'accel',
				name: 'AccelView',
				component: () =>
					import('../components/views/charts/AccelView.vue')
			},
			{
				path: 'gyro',
				name: 'GyroView',
				component: () =>
					import('../components/views/charts/GyroView.vue')
			},
			{
				path: 'mag',
				name: 'MagView',
				component: () =>
					import('../components/views/charts/MagView.vue')
			}
		]
	},

	{
		path: '/accel',
		name: 'AccelDirect',
		component: () => import('../components/views/charts/AccelView.vue')
	},
	{
		path: '/gyro',
		name: 'GyroDirect',
		component: () => import('../components/views/charts/GyroView.vue')
	},
	{
		path: '/mag',
		name: 'MagDirect',
		component: () => import('../components/views/charts/MagView.vue')
	},

	{
		path: '/:pathMatch(.*)*',
		name: '404',
		component: () => import('../components/views/NotFoundView.vue')
	}
]

// ----------------------------------------------------------------------

const router = createRouter({
	history: createWebHistory(),
	routes
})

// ----------------------------------------------------------------------
// Guard

router.beforeEach((to) => {
	if (to.meta.requiresAuth && !isAuthenticated) {
		return { name: 'Home' }
	}
})

export default router
