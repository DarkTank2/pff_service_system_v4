import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/lib/services/goto'
// import moment from 'moment'
import OrderExtension from '../components/appBarExtensions/OrderExtension.vue'
import OrderComponent from '../components/navBarComponents/OrderComponent.vue'
import CashButton from '../components/sideNavbarComponents/CashButton.vue'
import OrderButton from '../components/sideNavbarComponents/OrderButton.vue'
import CashAppBarComponent from '../components/appBarComponents/CashComponent.vue'
import CashTableTitleReplacement from '../components/TitleReplacements/CashTableTitleReplacement.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'base',
    redirect: () => {
      let onboardedAt = window.localStorage.getItem('onboardingCompletedAt')
      if (onboardedAt) {
        console.log('[Router] Redirecting to "/home" since device is already onboarded!')
        return { name: 'Home' }
      }
      console.log('[Router] Redirecting to onboarding-page since site is accessed for the first time!')
      return { name: 'Onboarding' }
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
    component: () => import(/* webpackChunkName: "ordering" */ '../views/CategoryView.vue'),
    meta: {
      extension: OrderExtension,
      bottomNavbarComponent: OrderComponent,
      sideNavbarComponents: [CashButton]
    }
  },
  {
    path: '/cash',
    name: 'Cash',
    component: () => import(/* webpackChunkName: "cashing" */ '../views/Cash.vue'),
    meta: {
      sideNavbarComponents: [OrderButton]
    },
    children: [
      {
        path: '',
        name: 'TableSelection',
        component: () => import(/* webpackChunkName: "cashing" */ '../components/Cash/SelectTable.vue'),
        meta: {
          sideNavbarComponents: [OrderButton]
        }
      },
      {
        path: 'table/:tableId',
        name: 'CashTable',
        component: () => import(/* webpackChunkName: "cashing" */ '../components/Cash/CashTable.vue'),
        props: route => ({ tableId: parseInt(route.params.tableId) }),
        meta: {
          sideNavbarComponents: [OrderButton],
          appBarComponent: CashAppBarComponent,
          titleReplacement: CashTableTitleReplacement
        }
      }
    ]
  },
  {
    path: '/hello',
    name: 'Onboarding',
    component: () => import(/* webpackChunkName: "about" */ '../views/Onboarding.vue')
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
