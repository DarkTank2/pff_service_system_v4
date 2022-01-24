<template>
    <v-overlay :value="loading">
        <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
</template>

<script>
export default {
    name: 'Loading',
    props: ['loading']
}
</script>
