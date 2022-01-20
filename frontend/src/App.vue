<template>
  <v-app>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    darkMode: true
  }),
  created: function () {
    this.$vuetify.theme.dark = this.darkMode
  }
};
</script>
