<template>
    <v-btn :to="{ name: 'Subscriptions' }" block outlined>
        <v-icon>subscriptions</v-icon>
        <span class="ml-2">Abonnements</span>
    </v-btn>
</template>

<script>
export default {
    name: 'BuffetSubscriptionsButton'
}
</script>

<style>

</style>