<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Cash',
  mounted: function () {
    this.fetchTables()
    this.fetchOrderedItems({ query: { finished: true } }).then(data => {
      this.fetchMaps({ query: { orderedItemId: { $in: data.map(({ id }) => id) } } })
    })
    this.fetchSizes()
    this.fetchFlavours()
    this.fetchBaseItems()
    this.fetchItems()
    this.fetchAdditions()
  },
  methods: {
    ...mapActions('tables', {
      fetchTables: 'find'
    }),
    ...mapActions('ordered-items', {
      fetchOrderedItems: 'find'
    }),
    ...mapActions('ordered-items-have-additions', {
      fetchMaps: 'find'
    }),
    ...mapActions('items', {
      fetchItems: 'find'
    }),
    ...mapActions('base-items', {
      fetchBaseItems: 'find'
    }),
    ...mapActions('sizes', {
      fetchSizes: 'find'
    }),
    ...mapActions('flavours', {
      fetchFlavours: 'find'
    }),
    ...mapActions('additions', {
      fetchAdditions: 'find'
    })
  }
}
</script>

<style>

</style>