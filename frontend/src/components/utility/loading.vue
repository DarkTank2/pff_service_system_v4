<template>
    <v-overlay :value="fetchPending">
        <v-progress-circular indeterminate></v-progress-circular>
    </v-overlay>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'Loading',
    props: [],
    computed: {
        ...mapGetters('utilities', ['fetchPending'])
    }
}
</script>
