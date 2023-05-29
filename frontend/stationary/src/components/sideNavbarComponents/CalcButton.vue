<template>
  <v-list-item :to="{ name: 'Calculator' }">
    <v-list-item-icon>
      <v-icon v-text="'calculate'"></v-icon>
    </v-list-item-icon>
    <v-list-item-title v-text="'Calculator'"></v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: 'CalcButton'
}
</script>

<style>

</style>