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
      <template #extension v-if="meta.extension">
        <component :is="meta.extension" />
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="bottomNav"
      app
      temporary
      bottom
      v-if="meta.bottomNavbarComponent"
      >
      <component :is="meta.bottomNavbarComponent" @closeNavbar="bottomNav = false" />
    </v-navigation-drawer>
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
      <v-btn
            v-if="meta.bottomNavbarComponent"
            elevation="2"
            fab
            fixed
            bottom
            right
            @click="bottomNav = true"
            >
            <v-badge
              bordered
              :content="badgeContent"
              :value="badgeContent"
              :color="badgeColor"
              >
                <v-icon>shopping_cart</v-icon>
            </v-badge>
        </v-btn>
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
    bottomNav: null,
    sideNav: null,
    timer: null
  }),
  created: function () {
    this.$vuetify.theme.dark = this.darkMode
    this.fetchAgain()
  },
  methods: {
    ...mapActions('env', {
      fetchENV: 'find'
    }),
    fetchAgain: function () {
      this.fetchENV().then(() => {
        this.timer = setTimeout(this.fetchAgain, 5000)
      })
    }
  },
  computed: {
    ...mapGetters('env', {
      getENV: 'get'
    }),
    ...mapGetters('waiter', {
        rawOrder: 'order'
    }),
    ...mapGetters('items', {
        getItem: 'get'
    }),
    ...mapGetters('base-items', {
        getBaseItem: 'get'
    }),
    env: function () {
      return this.getENV('_env')
    },
    meta: function () {
      return this.$route.meta
    },
    mainStyle: function () {
      return `padding: ${this.meta.extension ? '104' : '56'}px 0px 0px;`
    },
    badgeContent: function () {
      return this.allAvailable ? this.rawOrder.reduce((acc, val) => acc + val.quantity, 0) : '!'
    },
    allAvailable: function () {
      return this.rawOrder.map((orderedItem) => {
          let item = this.getItem(orderedItem.itemId)
          let baseItem = this.getBaseItem(item.baseItemId)
          return baseItem.available
      }).reduce((acc, val) => acc && val, true)
    },
    badgeColor: function () {
      return this.allAvailable ? 'green' : 'error'
    }
  },
  beforeDestroy: function () {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
};
</script>
