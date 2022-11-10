import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/lib/services/goto'
import moment from 'moment'
import CalculatorExtension from '../components/appBarExtensions/CalculatorExtension.vue'
import BuffetAppBarComponent from '../components/appBarComponents/BuffetComponent.vue'
import BuffetConfigButton from '../components/sideNavbarComponents/BuffetConfigButton.vue'
import BuffetSubscriptionsButton from '../components/sideNavbarComponents/BuffetSubscriptionsButton.vue'
import ConfiguratorAppBarComponent from '../components/appBarComponents/ConfiguratorComponent.vue'
import CalculatorAppBarComponent from '../components/appBarComponents/CalculatorAppBarComponent.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'base',
    redirect: () => {
      let lastSubscribed = window.localStorage.getItem('subscriptionDate')
      if (!lastSubscribed) {
        // not ever subscribed
        return { name: 'Subscriptions' }
      }
      if (moment(lastSubscribed).isBefore(moment('2022-12-31T12:00:00.000Z'))) {
        // very old subscription, possible last year, maybe update it
        return { name: 'Subscriptions' }
      }
      return { name: 'Home' }
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      appBarComponent: BuffetAppBarComponent,
      sideNavbarComponents: [BuffetConfigButton, BuffetSubscriptionsButton]
    }
  },
  {
    path: '/buffetConfig',
    name: 'BuffetConfig',
    component: () => import(/* webpackChunkName: "buffet" */ '../views/BuffetConfig.vue'),
    meta: {
      appBarComponent: BuffetAppBarComponent
    }
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: () => import(/* webpackChunkName: "buffet" */ '../views/Subscriptions.vue'),
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import(/* webpackChunkName: "calculator" */ '../views/Calculator.vue'),
    meta: {
      appBarComponent: CalculatorAppBarComponent,
      extension: CalculatorExtension
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
    component: () => import(/* webpackChunkName: "master" */ '../views/Configurator.vue'),
    meta: {
      appBarComponent: ConfiguratorAppBarComponent
    }
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
