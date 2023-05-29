<template>
  <v-list-item :to="{ name: 'Subscriptions' }">
    <v-list-item-icon>
      <v-icon v-text="'subscriptions'"></v-icon>
    </v-list-item-icon>
    <v-list-item-title v-text="'Abonnements'"></v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
    name: 'BuffetSubscriptionsButton'
}
</script>

<style>

</style>