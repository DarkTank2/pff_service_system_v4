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
    name: 'Order',
    component: () => import(/* webpackChunkName: "ordering" */ '../views/Order.vue'),
    children: [
      {
        path: '',
        name: 'TypeSelection', // supposed to select the type
        component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/TypeSelection.vue'),
        meta: {
          breadCrumbItem: () => ({
            to: { name: 'TypeSelection' }, // acts as an id for identifying the already pushed items
            text: `Wähle deinen Typ...`,
            disabled: true 
          })
        },
      },
      {
        path: 'type/:typeId',
        name: 'TypeProxy', // supposed to route forward to category selection of said type
        component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/TypeProxy.vue'),
        meta: {
          breadCrumbItem: () => ({
            to: { name: 'TypeSelection' },
            text: `Typ: ${this.selectedType?.name}`,
            disabled: false
          })
        },
        children: [
          {
            path: '',
            name: 'CategorySelection', // supposed to select category
            component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/CategorySelection.vue'),
            meta: {
              breadCrumbItem: () => ({
                to: { name: 'CategorySelection' },
                text: `Wähle deine Kategorie...`,
                disabled: true
              })
            }
          },
          {
            path: 'category/:categoryId',
            name: 'CategoryProxy', // supposed to route forward to the selection of the base item
            component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/CategoryProxy.vue'),
            meta: {
              breadCrumbItem: () => ({
                to: { name: 'CategorySelection' },
                text: `Kategorie: ${this.selectedType?.name}`,
                disabled: true
              })
            },
            children: [
              {
                path: '',
                name: 'BaseItemSelection',
                component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/BaseItemSelection.vue'),
                meta: {
                  breadCrumbItem: () => ({
                    to: { name: 'BaseItemSelection' },
                    text: `Wähle dein Basis-Item...`,
                    disabled: true
                  })
                }
              },
              {
                path: 'baseItem/:baseItemId',
                name: 'BaseItemProxy',
                component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/BaseItemProxy.vue'),
                meta: {
                  breadCrumbItem: () => ({
                    to: { name: 'BaseItemSelection' },
                    text: `Basis-Item: ${this.selectedType?.name}`,
                    disabled: true
                  })
                },
                children: [
                  {
                    path: '',
                    name: 'FlavourSelection',
                    component: () => import(/* webpackChunkName: "ordering" */ '../components/Order/FlavourSelection.vue'),
                    meta: {
                      breadCrumbItem: () => ({
                        to: { name: 'FlavourSelection' },
                        text: `Wähle deinen Flavour...`,
                        disabled: true
                      })
                    }
                  }
                ]
              }
            ]
          }
        ]
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
