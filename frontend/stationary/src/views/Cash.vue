<template>
  <router-view></router-view>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'Cash',
  data: () => ({
    timer: null
  }),
  mounted: function () {
    this.fetchTables()
    this.fetchAgain()
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
    }),
    fetchAgain: function () {
      this.fetchOrderedItems({ query: { finished: true } }).then(data => {
        let notCashed = data.filter(({ cashed, quantity }) => cashed !== quantity)
        this.fetchMaps({ query: { orderedItemId: { $in: notCashed.map(({ id }) => id) } } }).then(() => {
          this.timer = setTimeout(this.fetchAgain, 10000)
        })
      })
    }
  },
  beforeDestroy: function () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
}
</script>

<style>

</style>