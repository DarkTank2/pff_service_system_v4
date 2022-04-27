import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/lib/services/goto'
import OrderExtension from '../components/appBarExtensions/OrderExtension.vue'
import OrderComponent from '../components/navBarComponents/OrderComponent.vue'
import CashButton from '../components/sideNavbarComponents/CashButton.vue'
import OrderButton from '../components/sideNavbarComponents/OrderButton.vue'
import BuffetAppBarCOmponent from '../components/appBarComponents/BuffetComponent.vue'
import BuffetConfigButton from '../components/sideNavbarComponents/BuffetConfigButton.vue'

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
    name: 'Order',
    component: () => import(/* webpackChunkName: "ordering" */ '../views/Order.vue'),
    meta: {},
    children: [
      {
        path: '',
        name: 'TypeSelection', // supposed to select the type
        component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/TypeSelection.vue'),
        meta: {
          breadCrumbItem: {
            to: { name: 'TypeSelection' }, // acts as an id for identifying the already pushed items
            text: `Wähle deinen Typ...`,
            disabled: true 
          },
          bottomNavbarComponent: OrderComponent,
          sideNavbarComponents: [CashButton]
        },
      },
      {
        path: 'type/:typeId',
        name: 'CategoryView', // supposed to route forward to category selection of said type
        component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/CategoryView.vue'),
        props: route => ({ typeId: parseInt(route.params.typeId) }),
        meta: {
          breadCrumbItem: {
            to: { name: 'TypeSelection' },
            text: `Typ: `,
            disabled: false
          },
          extension: OrderExtension,
          bottomNavbarComponent: OrderComponent,
          sideNavbarComponents: [CashButton]
        }
      }
    ]
  },
  {
    path: '/cash',
    name: 'Cash',
    component: () => import(/* webpackChunkName: "cashing" */ '../views/Cash.vue'),
    meta: {
      sideNavbarComponents: [OrderButton]
    }
  },
  {
    path: '/buffet',
    name: 'Buffet',
    component: () => import(/* webpackChunkName: "buffet" */ '../views/Buffet.vue'),
    meta: {
      appBarComponent: BuffetAppBarCOmponent,
      sideNavbarComponents: [BuffetConfigButton]
    }
  },
  {
    path: '/buffetConfig',
    name: 'BuffetConfig',
    component: () => import(/* webpackChunkName: "buffet" */ '../views/BuffetConfig.vue'),
    meta: {
      appBarComponent: BuffetAppBarCOmponent
    }
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
    component: () => import(/* webpackChunkName: "master" */ '../views/Configurator.vue')
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
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo = 0

    if (to.hash) {
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }

    return goTo(scrollTo, { duration: 600, offset: 15, easing: 'easeInOutCubic', })
  }
})

export default router
