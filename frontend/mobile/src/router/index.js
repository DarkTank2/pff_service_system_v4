import Vue from 'vue'
import VueRouter from 'vue-router'
import moment from 'moment'
import goTo from 'vuetify/lib/services/goto'
// import moment from 'moment'
import OrderExtension from '../components/appBarExtensions/OrderExtension.vue'
import OrderComponent from '../components/navBarComponents/OrderComponent.vue'
// import CashButton from '../components/sideNavbarComponents/CashButton.vue'
// import OrderButton from '../components/sideNavbarComponents/OrderButton.vue'
// import CashAppBarComponent from '../components/appBarComponents/CashComponent.vue'
// import CashTableTitleReplacement from '../components/TitleReplacements/CashTableTitleReplacement.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'base',
    redirect: () => {
      let onboardedAt = window.localStorage.getItem('onboardingCompletedAt')
      if (!onboardedAt) {
        return { name: 'Onboarding' }
      }
      if (moment(onboardedAt).isBefore(moment('2023-06-03T12:00:00.000Z'))) {
        return { name: 'Onboarding' }
      }
      return { name: 'Order' }
    }
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import(/* webpackChunkName: "ordering" */ '../views/CategoryView.vue'),
    meta: {
      extension: OrderExtension,
      bottomNavbarComponent: OrderComponent
    }
  },
  {
    path: '/config',
    name: 'Config',
    component: () => import(/* webpackChunkName: "ordering" */ '../views/Config.vue'),
    meta: {
      // extension: OrderExtension,
      // bottomNavbarComponent: OrderComponent,
      // sideNavbarComponents: [CashButton]
    }
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
