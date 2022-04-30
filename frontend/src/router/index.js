import Vue from 'vue'
import VueRouter from 'vue-router'
import goTo from 'vuetify/lib/services/goto'
import OrderExtension from '../components/appBarExtensions/OrderExtension.vue'
import CalculatorExtension from '../components/appBarExtensions/CalculatorExtension.vue'
import OrderComponent from '../components/navBarComponents/OrderComponent.vue'
import CashButton from '../components/sideNavbarComponents/CashButton.vue'
import OrderButton from '../components/sideNavbarComponents/OrderButton.vue'
import BuffetAppBarComponent from '../components/appBarComponents/BuffetComponent.vue'
import BuffetConfigButton from '../components/sideNavbarComponents/BuffetConfigButton.vue'
import CashAppBarComponent from '../components/appBarComponents/CashComponent.vue'
import CashTableTitleReplacement from '../components/TitleReplacements/CashTableTitleReplacement.vue'
import ConfiguratorAppBarComponent from '../components/appBarComponents/ConfiguratorComponent.vue'
import CalculatorAppBarComponent from '../components/appBarComponents/CalculatorAppBarComponent.vue'

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
    path: '/buffet',
    name: 'Buffet',
    component: () => import(/* webpackChunkName: "buffet" */ '../views/Buffet.vue'),
    meta: {
      appBarComponent: BuffetAppBarComponent,
      sideNavbarComponents: [BuffetConfigButton]
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
