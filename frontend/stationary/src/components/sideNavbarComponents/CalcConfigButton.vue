<template>
  <v-btn :to="{ name: 'CalculatorConfig' }" block outlined>
      <v-icon>settings</v-icon>
      <span class="ml-2">Config</span>
  </v-btn>
</template>

<script>
export default {
  name: 'CalcConfigButton'
}
</script>

<style>

</style>