<template>
  <v-card>
      <v-card-title class="d-flex">
          <v-btn outlined class="mx-2 pl-2 pr-4" :to="{ name: 'TableSelection' }">
            <v-icon>chevron_left</v-icon>
            zurück
          </v-btn>
          <v-btn outlined class="flex-grow-1 mx-2 v-btn--active" v-if="listCashingItems.length === 0" @click="addAll()">
            <v-icon>library_add_check</v-icon>
            alles
          </v-btn>
          <v-btn outlined class="flex-grow-1 mx-2 v-btn--active" v-else @click="clearCash">
            <v-icon>clear</v-icon>
            nichts
          </v-btn>
      </v-card-title>
    <v-container fluid>
      <v-list>
        <template v-for="(orderedItem, i) in orderedItems">
          <v-divider
            v-if="i !== 0"
            :key="`cash_table__divider_index_${i}`"
            :class="(orderedItems.at(i - 1).additions && orderedItems.at(i - 1).additions.length > 0) ? 'mt-4' : ''"
            />
          <v-list-item
            :key="`cash_ordered_item_id_${orderedItem.id}_index_${i}`"
            :two-line="!orderedItem.comment"
            :three-line="!!orderedItem.comment"
            dense
            >
            <v-list-item-content>
              <v-list-item-title>
                {{ `${orderedItem.baseItemName}` }}<span class="ml-2">{{ `( à ${orderedItem.item.price + orderedItem.additionsPriceSum}€ )` }}</span>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ `${orderedItem.flavourName} | ${orderedItem.sizeName}` }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ orderedItem.comment }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
                <v-btn icon @click="decrementId(orderedItem)">
                    <v-icon>remove</v-icon>
                </v-btn>
            </v-list-item-action>
            <v-list-item-icon>
                <v-btn text disabled rounded outlined :class="{ bordered: (orderedItem.cashableItem && orderedItem.cashableItem.toBeCashed > 0) }">
                    <span class="white--text">
                        {{ `${orderedItem.cashableItem ? orderedItem.cashableItem.toBeCashed : 0}/${orderedItem.quantity - orderedItem.cashed}` }}
                    </span>
                </v-btn>
            </v-list-item-icon>
            <v-list-item-action style="margin-left:0px;">
                <v-btn icon @click="incrementId(orderedItem)">
                    <v-icon>add</v-icon>
                </v-btn>
            </v-list-item-action>
          </v-list-item>
          <template v-if="orderedItem.additions && orderedItem.additions.length > 0">
            <span
                v-for="(addition, index) in orderedItem.additions"
                :key="`addition_index_${index}_ordered_item_id_${orderedItem.id}`"
                class="mx-10 order-component-addition"
                >
                {{ addition.name }}
                <span v-if="addition.priceModifier !== 0" class="ml-2">{{ `( ${addition.priceModifier}€ )` }}</span>
                <br />
            </span>
          </template>
        </template>
        <template v-if="orderedItems.length === 0">
          <v-alert type="info" outlined prominent>Gibt nix zum sehen, zurück zu den Tischen mit dir! (Oder drücke <v-btn :to="{ name: 'TableSelection' }" plain outlined>hier</v-btn>)</v-alert>
        </template>
        <v-list-item></v-list-item>
      </v-list>
    </v-container>
    <v-btn
          elevation="2"
          fab
          fixed
          bottom
          right
          @click="cash"
          :disabled="listCashingItems.length === 0"
          >
          <v-icon>euro_symbol</v-icon>
      </v-btn>
  </v-card>
</template>
<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  name: 'CashTable',
  props: ['tableId'],
  components: {},
  data () {
    return {}
  },
  created: function () {},
  mounted: function () {},
  methods: {
    ...mapMutations('cash', {
      incrementOrderedItem: 'increment',
      decrementOrderedItem: 'decrement',
      clearCash: 'clear'
    }),
    ...mapActions('ordered-items', {
      updateOrderedItem: 'update'
    }),
    ...mapActions('utilities', {
        setFetchPendingFlag: 'setFetchPendingFlag',
        resetFetchPendingFlag: 'resetFetchPendingFlag',
        setNotification: 'setNotification'
    }),
    decrementId: function (oi) {
      this.decrementOrderedItem(oi)
    },
    incrementId: function (oi) {
      this.incrementOrderedItem(oi)
    },
    cash: function () {
      this.setFetchPendingFlag().then(() => {
        let promises = []
        this.listCashingItems.forEach(oi => {
          let orderedItemInStore = this.getOrderedItem(oi.id)
          let clone = { ...orderedItemInStore }
          clone.cashed += oi.toBeCashed
          promises.push(this.updateOrderedItem([oi.id, clone, null]))
        })
        Promise.all(promises).then(() => {
          this.clearCash()
          this.resetFetchPendingFlag().then(() => {
            this.setNotification({ message: 'Erfolg!', timeout: 2000, type: 'success' })
            if (this.orderedItems.length === 0) {
              this.$router.push({ name: 'TableSelection' })
            }
          })
        }).catch(() => {
            this.resetFetchPendingFlag().then(() => {
              this.setNotification({ message: `Fehler! Melde dich bitte bei Alex und zeige ihm die Tischnummer!`, timeout: -1, type: 'error' })
            })
          })
      })
    },
    addAll: function () {
      this.orderedItems.forEach(oi => {
        for (var i = 0; i<oi.quantity; i++) {
          this.incrementOrderedItem(oi)
        }
      })
    }
  },
  watch: {},
  computed: {
    ...mapGetters('cash', {
      getCashableItem: 'get',
      listCashingItems: 'list'
    }),
    ...mapGetters('ordered-items', {
      findOrderedItems: 'find',
      getOrderedItem: 'get'
    }),
    ...mapGetters('ordered-items-have-additions', {
      findMaps: 'find'
    }),
    ...mapGetters('items', {
        getItem: 'get'
    }),
    ...mapGetters('base-items', {
        getBaseItem: 'get'
    }),
    ...mapGetters('sizes', {
        getSize: 'get'
    }),
    ...mapGetters('flavours', {
        getFlavour: 'get'
    }),
    ...mapGetters('additions', {
        getAddition: 'get'
    }),
    rawOrderedItems: function () {
      return this.findOrderedItems({ query: { finished: true, tableId: this.tableId } }).data
        .filter(({ quantity, cashed }) => quantity !== cashed)
    },
    orderedItems: function () {
      return this.rawOrderedItems.map(orderedItem => {
        let item = this.getItem(orderedItem.itemId)
        let additions = this.findMaps({ query: { orderedItemId: orderedItem.id } }).data.map(({ additionId }) => this.getAddition(additionId) || {})
        let additionsPriceSum = additions.reduce((acc, val) => { if (val) { return acc + val.priceModifier } else { return acc }}, 0)
        let cashableItem = this.getCashableItem(orderedItem.id)
        if (item) {
          return {
              ...orderedItem,
              item,
              additionsPriceSum,
              baseItemName: this.getBaseItem(item.baseItemId)?.name,
              flavourName: this.getFlavour(item.flavourId)?.name,
              sizeName: this.getSize(item.sizeId)?.name,
              additions: additions || [],
              cashableItem
          }
        } else {
          return {}
        }
      })
    }
  },
  beforeDestroy: function () {
    this.clearCash()
  }
}
</script>

<style scoped>
.order-component-addition {
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1rem;
    color: rgba(255, 255, 255, 0.7);
}

.bordered {
  border-color: #2196f3 !important;
  border-width: 2px;
}
</style>
