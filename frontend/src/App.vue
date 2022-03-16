<template>
  <v-app>
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>{{ env ? env.occasion : 'Loading...' }}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      temporary
      >
      <!--  -->
    </v-navigation-drawer>
    <v-main>
      <router-view/>
      <loading />
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Loading from './components/utility/loading.vue'
export default {
  name: 'App',
  components: {
    Loading
  },
  data: () => ({
    darkMode: true,
    drawer: null
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
    }
  }
};
</script>
