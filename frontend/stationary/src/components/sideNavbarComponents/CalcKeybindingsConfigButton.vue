<template>
  <v-list-item :to="{ name: 'Keybindings' }">
    <v-list-item-icon>
      <v-icon v-text="'keyboard'"></v-icon>
    </v-list-item-icon>
    <v-list-item-title v-text="'Keybindings'"></v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: 'CalcKeybindingsConfigButton'
}
</script>

<style>

</style>