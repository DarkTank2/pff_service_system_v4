<template>
  <v-list>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>
          {{ `Verlauf für "${deviceName}"` }}
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-divider />
    <Order v-for="(order, i) in clusteredOrderedItems" :key="`history_order_index_${i}`" :order="order" />
    <v-divider />
    <v-list-item @click="initializeOrderedItemFetch">
      <template v-if="!loading">
        <v-list-item-icon>
          <v-icon v-text="'add'"></v-icon>
        </v-list-item-icon>
        <v-list-item-title v-text="'Mehr laden'"></v-list-item-title>
      </template>
      <template v-else>
        <div style="height: 100%; width: 100%;" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </template>
    </v-list-item>
  </v-list>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Order from './Order.vue'
export default {
  name: 'History',
  props: {
    deviceName: {
      default: '',
      type: String
    }
  },
  components: {
    Order
  },
  data: () => ({
    loading: false
  }),
  methods: {
    ...mapActions('ordered-items', {
      fetchOrderedItems: 'find'
    }),
    ...mapActions('utilities', {
      setNotification: 'setNotification'
    }),
    initializeOrderedItemFetch: async function () {
      this.loading = true
      await this.fetchOrderedItems(this.deviceQuery).catch((err) => {
        this.setNotification(`Fehler beim Laden der bestellten Items: ${err.message}`)
      })
      this.loading = false
    }
  },
  computed: {
    ...mapGetters('ordered-items', {
      findOrderedItems: 'find'
    }),
    ...mapGetters('config', {
      formatItem: 'formatItem'
    }),
    ...mapGetters('base-items', {
      getBaseItem: 'get',
      findBaseItems: 'find'
    }),
    ...mapGetters('items', {
      getItem: 'get'
    }),
    ...mapGetters('sizes', {
      getSizes: 'get'
    }),
    ...mapGetters('flavours', {
      getFlavour: 'get'
    }),
    ...mapGetters('additions', {
      findAdditions: 'find'
    }),
    deviceQuery: function () {
      return { query: { waiter: this.deviceName } }
    },
    filteredOrderedItems: function () {
      return this.findOrderedItems(this.deviceQuery).data
    },
    extendedOrderedItems: function () {
      return this.filteredOrderedItems.map(orderedItem => {
        let item = this.getItem(orderedItem.itemId)
        return {
          ...orderedItem,
          displayName: this.formatItem({
            baseItemName: this.getBaseItem(item?.baseItemId)?.name,
            sizeName: this.getSizes(item?.sizeId)?.name,
            flavourName: this.getFlavour(item?.flavourId)?.name
          })
        }
      })
    },
    clusteredOrderedItems: function () {
      let data = {}
      this.extendedOrderedItems.forEach(orderedItem => {
        if (!data[orderedItem.createdAt]) {
          data[orderedItem.createdAt] = []
        }
        data[orderedItem.createdAt].push(orderedItem)
      })
      return Object.keys(data).reverse().map(ts => data[ts])
    }
  },
  watch: {
    // deviceName: function (newName) {
    //   this.fetchOrderedItems({ query: { waiter: newName } })
    // }
  }
}
</script>
