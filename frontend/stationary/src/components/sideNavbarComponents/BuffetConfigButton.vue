<template>
    <v-btn :to="{ name: 'BuffetConfig' }" block outlined>
        <v-icon>settings</v-icon>
        <span class="ml-2">Einstellungen</span>
    </v-btn>
</template>

<script>
export default {
    name: 'BuffetConfigButton'
}
</script>

<style>

</style>