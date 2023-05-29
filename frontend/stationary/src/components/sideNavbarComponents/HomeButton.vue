<template>
  <v-list-item :to="{ name: 'Home' }">
    <v-list-item-icon>
      <v-icon v-text="'home'"></v-icon>
    </v-list-item-icon>
    <v-list-item-title v-text="'Home'"></v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: 'HomeButton'
}
</script>

<style>

</style>