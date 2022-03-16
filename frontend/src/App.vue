<template>
  <v-app>
    <v-main>
      <router-view/>
      <loading />
    </v-main>
  </v-app>
</template>

<script>
import Loading from './components/utility/loading.vue'
export default {
  name: 'App',
  components: {
    Loading
  },
  data: () => ({
    darkMode: true
  }),
  created: function () {
    this.$vuetify.theme.dark = this.darkMode
  }
};
</script>
