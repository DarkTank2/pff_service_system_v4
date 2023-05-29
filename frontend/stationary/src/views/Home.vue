<template>
  <v-container fluid class="px-10 mt-4" id="buffet_container">
      <v-row>
          <v-col cols="4" v-for="order in clusteredOrders" :key="`order_created_at_${order.createdAt}_by_${order.waiter}`">
              <cluster :order="order" :card-size="cardSize" @card-size="handleSizeChange" />
          </v-col>
          <v-col cols="12" v-if="clusteredOrders.length === 0 && showNothing === 1">
            <v-card width="100%" flat tile class="d-flex align-center flex-column pa-14">
              <object data="undraw_void_-3-ggu.svg" width="20%"></object>
              <v-card-text class="text-center">
                <span class="text-h2">Gibt grad nix zu sehen!</span>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" v-if="clusteredOrders.length === 0 && showNothing !== 1">
            <v-card width="100%" flat tile class="d-flex align-center flex-column pa-14">
              <object data="undraw_empty_re_opql.svg" width="20%"></object>
              <v-card-text class="text-center">
                <span class="text-h2">Ist grad alles leer!</span>
              </v-card-text>
            </v-card>
          </v-col>
      </v-row>
  </v-container>
</template>

<script>
import Cluster from '../components/Buffet/Cluster.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'Buffet',
    components: { Cluster },
    data: () => ({
        cardSize: null,
        showNothing: 0
    }),
    mounted: function () {
        this.fetchTables()
        this.fetchBaseItems()
        this.fetchItems()
        this.fetchSizes()
        this.fetchFlavours()
        this.fetchMaps()
        this.fetchAdditions()
        this.fetchOrderedItems()
        this.initSubscriptions()
        this.showNothing = Math.floor(Math.random()*2) % 2
    },
    methods: {
        ...mapActions('ordered-items', {
            fetchOrderedItems: 'find'
        }),
        ...mapActions('tables', {
            fetchTables: 'find'
        }),
        ...mapActions('base-items', {
            fetchBaseItems: 'find'
        }),
        ...mapActions('items', {
            fetchItems: 'find'
        }),
        ...mapActions('sizes', {
            fetchSizes: 'find'
        }),
        ...mapActions('flavours', {
            fetchFlavours: 'find'
        }),
        ...mapActions('ordered-items-have-additions', {
            fetchMaps: 'find'
        }),
        ...mapActions('additions', {
            fetchAdditions: 'find'
        }),
        ...mapActions('subscriptions', {
          initSubscriptions: 'initSubscriptions'
        }),
        handleSizeChange: function (newSize) {
            if (this.cardSize === null) {
                this.cardSize = newSize
                return
            }
            if (newSize > this.cardSize) {
                this.cardSize = newSize
            }
        }
    },
    computed: {
        ...mapGetters('ordered-items', {
            findOrderedItems: 'find'
        }),
        ...mapGetters('tables', {
            getTable: 'get'
        }),
        ...mapGetters('base-items', {
            getBaseItem: 'get'
        }),
        ...mapGetters('items', {
            getItem: 'get',
            findItems: 'find'
        }),
        ...mapGetters('sizes', {
            getSize: 'get'
        }),
        ...mapGetters('flavours', {
            getFlavour: 'get'
        }),
        ...mapGetters('ordered-items-have-additions', {
            findMaps: 'find'
        }),
        ...mapGetters('additions', {
            getAddition: 'get'
        }),
        ...mapGetters('subscriptions', {
          subscriptions: 'subscriptions'
        }),
        allOpenOrderedItems: function () {
            return this.findOrderedItems(this.orderedItemsQuery).data
        },
        orderedItemsQuery: function () {
          let queryObject = { query: { finished: false } }
          if (this.subscriptions && this.subscriptions.length !== 0) {
            let allowedItems = this.findItems({ query: { baseItemId: { $in: this.subscriptions } } }).data.map(({ id }) => id)
            queryObject.query.itemId = { $in: allowedItems }
          }
          return queryObject
        },
        clusteredOrders: function () {
            let currentOrder = { items: [], createdAt: null }
            let clusters = []
            this.allOpenOrderedItems.forEach(orderedItem => {
                let { waiter, tableId, createdAt, itemId } = orderedItem
                let table = this.getTable(tableId)
                if (currentOrder.createdAt !== createdAt) {
                    currentOrder = { waiter, tableId, table, createdAt, items: [] }
                    clusters.push(currentOrder)
                }
                let item = this.getItem(itemId)
                if (item) {
                    let size = this.getSize(item.sizeId)
                    let flavour = this.getFlavour(item.flavourId)
                    let baseItem = this.getBaseItem(item.baseItemId)
                    let maps = this.findMaps({ query: { orderedItemId: orderedItem.id } }).data
                    let additions = maps.map(({ additionId }) => this.getAddition(additionId))
                    currentOrder.items.push({ ...orderedItem, orderedItem, item, size, flavour, baseItem, additions })
                }
            })
            return clusters.map(cluster => {
              return {
                ...cluster,
                orderId: Math.min(...cluster.items.map(({ id }) => id))
              }
            })
        }
    },
    watch: {
        clusteredOrders: function () {
            this.cardSize = null
            this.showNothing = Math.floor(Math.random()*2) % 2
        }
    }
}
</script>

<style>
i.v-icon {
    transform: translate(0px, 0px);
    opacity: 1;
    transition: transform 2s, opacity 2s;
}
.clicked {
    transform: translate(100px, 0px) scale(0.7);
    opacity: 0;
}
</style>