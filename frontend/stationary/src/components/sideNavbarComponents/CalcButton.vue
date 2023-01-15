<template>
  <v-btn :to="{ name: 'Calculator' }" block outlined>
      <v-icon>calculate</v-icon>
      <span class="ml-2">Calculator</span>
  </v-btn>
</template>

<script>
export default {
  name: 'CalcButton'
}
</script>

<style>

</style>