<template>
  <v-app>
    <v-app-bar app id="_appbar">
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
            style="bottom: 70px !important;"
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
    <v-bottom-navigation color="primary" fixed grow v-if="$route.name !== 'Onboarding'">
      <v-btn :to="{ name: 'Order' }" >
        <span class="ml-2">Bestellung aufnehmen</span>
        <v-icon>brunch_dining</v-icon>
      </v-btn>
      <v-btn :to="{ name: 'TableSelection' }" >
        <span class="ml-2">Kassieren</span>
        <v-icon>euro_symbol</v-icon>
      </v-btn>
    </v-bottom-navigation>
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
    timer: null
  }),
  created: function () {
    this.$vuetify.theme.dark = this.darkMode
    this.fetchAgain()
    // testing purposes of notifications
    // this.setNotification({ message: 'Erfolg!', timeout: 5000, type: 'success' })
  },
  methods: {
    ...mapActions('env', {
      fetchENV: 'find'
    }),
    ...mapActions('utilities', {
      setNotification: 'setNotification'
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

<style>
/* @font-face {
  font-family: "Ailerons";
  src: local("Ailerons"),
   url(./fonts/Ailerons.otf) format("truetype");
}
* {
     font-family: "Ailerons", Helvetica, Arial;
} */
</style>
