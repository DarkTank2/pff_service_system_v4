<template>
  <v-toolbar-title>{{ table.name }}</v-toolbar-title>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'CashTableTitleReplacement',
    computed: {
        ...mapGetters('tables', {
            getTable: 'get'
        }),
        tableId: function () {
            return this.$route.params.tableId
        },
        table: function () {
            return this.getTable(this.tableId) || {}
        }
    }
}
</script>

<style>

</style>