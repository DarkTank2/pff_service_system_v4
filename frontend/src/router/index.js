import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'base',
    redirect: () => {
      console.log('[Router] redirecting from "/" to "/home"')
      return { name: 'Home' }
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/order',
    // name: 'Order',
    component: () => import('../views/Order.vue'),
    children: [
      {
        path: '',
        name: 'TypeSelection', // supposed to select the type
        component: () => import('../components/Order/TypeSelection.vue')
      },
      {
        path: '/type/:typeId',
        name: 'TypeProxy', // supposed to route forward to category selection of said type
        component: () => import('../components/Order/TypeProxy.vue'),
    //     children: [
    //       {
    //         path: '/',
    //         name: 'CategorySelection', // supposed to select category
    //         component: () => import('')
    //       },
    //       {
    //         path: '/category/:categoryId',
    //         name: 'CategoryProxy', // supposed to route forward to the selection of the base item
    //         component: () => import(''),
    //         children: [
    //           {
    //             path: '/',
    //             name: 'BaseItemSelection',
    //             component: () => import('')
    //           },
    //           {
    //             path: '/baseItem/:baseItemId',
    //             name: 'baseItemProxy',
    //             component: () => import(''),
    //             children: [
    //               {
    //                 path: '/',
    //                 name: 'FlavourSelection',
    //                 component: () => import('')
    //               }
    //             ]
    //           }
    //         ]
    //       }
    //     ]
      }
    ]
  },
  {
    path: '/serve',
    name: 'Serve',
    component: () => import('../views/Serve.vue')
  },
  {
    path: '/config',
    name: 'Config',
    redirect: () => {
      console.log('[Router] redirecting from "/config" to "/configurator"')
      return { name: 'Configurator' }
    }
  },
  {
    path: '/configurator',
    name: 'Configurator',
    component: () => import('../views/Configurator.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
