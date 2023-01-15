<template>
  <v-btn :to="{ name: 'Keybindings' }" block outlined>
      <v-icon>keyboard</v-icon>
      <span class="ml-2">Keybindings</span>
  </v-btn>
</template>

<script>
export default {
  name: 'CalcKeybindingsConfigButton'
}
</script>

<style>

</style>