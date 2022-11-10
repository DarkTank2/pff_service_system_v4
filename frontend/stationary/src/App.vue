<template>
  <v-app>
    <v-app-bar app id="_appbar">
      <v-app-bar-nav-icon @click="sideNav = !sideNav"></v-app-bar-nav-icon>
      <template v-if="meta.titleReplacement">
        <component :is="meta.titleReplacement" />
      </template>
      <v-toolbar-title v-else>{{ env ? env.occasion : 'Loading...' }}</v-toolbar-title>
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
      <component v-if="meta.appBarComponent" :is="meta.appBarComponent" />
      <v-spacer v-if="meta.appBarComponent"></v-spacer>
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
        <v-list-item>
          <v-list-item-content>
            <v-btn :to="{ name: 'Home' }" block outlined>
              <v-icon>home</v-icon>
              <span class="ml-2">Home</span>
            </v-btn>
          </v-list-item-content>
        </v-list-item>
        <template v-if="meta.sideNavbarComponents">
          <v-list-item v-for="(component, index) in meta.sideNavbarComponents" :key="`side_navbar_component_index_${index}`">
            <v-list-item-content>
              <component :is="component" />
            </v-list-item-content>
          </v-list-item>
        </template>
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
export default {
  name: 'App',
  components: {
    Loading,
    Notification
  },
  data: () => ({
    darkMode: true,
    sideNav: null
  }),
  created: function () {
    this.$vuetify.theme.dark = this.darkMode
    this.fetchENV()
  },
  methods: {
    ...mapActions('env', {
      fetchENV: 'find'
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
    mainStyle: function () {
      return `padding: ${this.meta.extension ? '104' : '56'}px 0px 0px;`
    }
  }
};
</script>
