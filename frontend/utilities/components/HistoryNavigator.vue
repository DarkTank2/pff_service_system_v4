<template>
  <v-list-item :to="{ name: 'History' }">
    <v-list-item-icon>
      <v-icon v-text="'history'"></v-icon>
    </v-list-item-icon>
    <v-list-item-title v-text="'Verlauf'"></v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
    name: 'HistoryNavigator'
}
</script>

<style>

</style>