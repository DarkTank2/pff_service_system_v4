<template>
  <v-list-item :to="{ name: 'BuffetConfig' }">
    <v-list-item-icon>
      <v-icon v-text="'settings'"></v-icon>
    </v-list-item-icon>
    <v-list-item-title v-text="'Einstellungen'"></v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
    name: 'BuffetConfigButton'
}
</script>

<style>

</style>