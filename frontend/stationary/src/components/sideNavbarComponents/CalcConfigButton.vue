<template>
  <v-list-item :to="{ name: 'CalculatorConfig' }">
    <v-list-item-icon>
      <v-icon v-text="'settings'"></v-icon>
    </v-list-item-icon>
    <v-list-item-title v-text="'Config'"></v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: 'CalcConfigButton'
}
</script>

<style>

</style>