<template>
  <v-app id="root">
    <v-app-bar app id="_appbar">
      <v-app-bar-nav-icon @click="sideNav = !sideNav"></v-app-bar-nav-icon>
      <template v-if="meta.titleReplacement">
        <component :is="meta.titleReplacement" />
      </template>
      <v-toolbar-title v-else>{{ env ? env.occasion : 'Loading...' }}</v-toolbar-title>
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <component v-if="meta.appBarComponent" :is="meta.appBarComponent" />
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <component v-for="element, i in quickConfigElements" :key="`quickConfigElement_${i}`" :is="element" />
      <template #extension v-if="meta.extension">
        <component :is="meta.extension" />
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="sideNav"
      app
      temporary
      >
      <v-list>
        <v-list-item>
          <v-list-item-title>
            <span>Service</span>
            <span class="font-weight-light text-uppercase">Tool</span>
          </v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-group
          :value="baseActive"
          prepend-icon="apps">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Buffet</v-list-item-title>
            </v-list-item-content>
          </template>
          <HomeButton class="ml-4" />
          <BuffetConfigButton class="ml-4" />
          <BuffetSubscriptionsButton class="ml-4" />
        </v-list-group>
        <v-list-group
          :value="calculatorActive"
          prepend-icon="calculate">
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>Calculator</v-list-item-title>
            </v-list-item-content>
          </template>
          <CalcButton class="ml-4" />
          <HistoryNavigator class="ml-4" />
          <CalcConfigButton class="ml-4" />
          <CalcKeybindingsConfigButton class="ml-4" />
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main :style="mainStyle">
      <router-view/>
      <loading />
      <notification />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loading from '@components/loading.vue'
import Notification from '@components/notification.vue'

import HomeButton from '@/sideNavbarComponents/HomeButton.vue'
import BuffetConfigButton from '@/sideNavbarComponents/BuffetConfigButton.vue'
import BuffetSubscriptionsButton from '@/sideNavbarComponents/BuffetSubscriptionsButton.vue'
import CalcKeybindingsConfigButton from '@/sideNavbarComponents/CalcKeybindingsConfigButton.vue'
import CalcButton from '@/sideNavbarComponents/CalcButton.vue'
import CalcConfigButton from '@/sideNavbarComponents/CalcConfigButton.vue'

import HistoryNavigator from '@components/HistoryNavigator.vue'
export default {
  name: 'App',
  components: {
    Loading,
    Notification,
    HomeButton,
    BuffetConfigButton,
    BuffetSubscriptionsButton,
    CalcKeybindingsConfigButton,
    CalcButton,
    CalcConfigButton,
    HistoryNavigator
  },
  data: () => ({
    darkMode: true,
    sideNav: null,
    calculatorActive: false,
    baseActive: false
  }),
  created: function () {
    this.$vuetify.theme.dark = this.darkMode
    this.fetchENV()
    this.initSubscriptions()
    this.initKeybindings()
    this.initConfig()
  },
  methods: {
    ...mapActions('env', {
      fetchENV: 'find'
    }),
    ...mapActions('subscriptions', {
      initSubscriptions: 'initSubscriptions'
    }),
    ...mapActions('keybindings', {
      initKeybindings: 'initKeybindings'
    }),
    ...mapActions('config', {
      initConfig: 'init'
    })
  },
  computed: {
    ...mapGetters('env', {
      getENV: 'get'
    }),
    env: function () {
      return this.getENV('_env')
    },
    meta: function () {
      return this.$route.meta
    },
    quickConfigElements: function () {
      return this.meta.quickConfigElements || []
    },
    sideNavbarComponents: function () {
      return this.meta.sideNavbarComponents || []
    },
    mainStyle: function () {
      return `padding: ${this.meta.extension ? '104' : '56'}px 0px 0px;`
    }
  }
};
</script>
