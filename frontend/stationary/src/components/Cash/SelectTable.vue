<template>
  <v-container fluid>
    <v-list>
      <v-list-item
        v-for="table in tables"
        :key="`select_table__table_id_${table.id}`"
        :to="{ name: 'CashTable', params: { tableId: table.id } }"
        :disabled="table.orderedItems.length === 0"
        class="ma-1"
        :class="{ bordered: table.orderedItems.length !== 0 }"
        >
        <v-list-item-title>
          <span>{{ table.name }}</span>
        </v-list-item-title>
        <v-list-item-action v-if="table.orderedItems.length !== 0">
          <span>{{ table.orderedItems.length }}</span>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SelectTable',
  props: [],
  components: {},
  data () {
    return {}
  },
  created: function () {},
  mounted: function () {},
  methods: {},
  watch: {},
  computed: {
    ...mapGetters('tables', {
      listTables: 'list'
    }),
    ...mapGetters('ordered-items', {
      findOrderedItems: 'find'
    }),
    tables: function () {
      return this.listTables.map(table => {
        return {
          ...table,
          orderedItems: this.findOrderedItems({ query: { finished: true, tableId: table.id } }).data.filter(({ quantity, cashed }) => quantity !== cashed)
        }
      })
    }
  }
}
</script>
<style scoped>
.bordered {
  border: 1px solid #ffffff;
  border-radius: 4px;
}
</style>
