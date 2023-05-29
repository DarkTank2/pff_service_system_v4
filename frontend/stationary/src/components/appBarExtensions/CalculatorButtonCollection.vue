<template>
  <div class="d-flex justify-space-around" style="width: 100%;">
    <v-btn outlined @click="openDialog()">
      <v-icon>shopping_cart</v-icon>
      <span class="ml-2">Warenkorb</span>
    </v-btn>
    <v-btn outlined @click="cash">
      <v-icon>euro_symbol</v-icon>
      <span class="ml-2">Kassieren</span>
    </v-btn>
    <v-btn outlined @click="clearOrder">
      <v-icon>clear</v-icon>
      <span class="ml-2">Bestellung zurücksetzen</span>
    </v-btn>
    <v-dialog v-model="dialog" max-width="600px" @click:outside="closeDialog">
      <v-card>
        <v-card-title v-if="!orderId" class="d-flex justify-space-around">
          <span class="text-h4">Deine Bestellung</span>
          <span class="text-h4">{{ `Summe: ${beautifiedSum}€` }}</span>
        </v-card-title>
        <v-card-title v-else>
          <span class="text-h3">Deine Bestell-Nummer:</span>
        </v-card-title>
        <v-card-text v-if="!orderId">
          <v-list>
            <template v-for="(orderedItem, i) in orderedItems">
              <v-divider v-if="orderedItem.index !== 0" :key="`divider_index_${orderedItem.index}`"
                :class="orderedItems.at(i - 1).additions.length > 0 ? 'mt-4' : ''" />
              <v-list-item dense :key="`ordered_item_index_${orderedItem.index}`" two-line>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ `${orderedItem.baseItemName}` }}<span class="ml-2">{{ `( à ${orderedItem.item.price +
                    orderedItem.additionsPriceSum}€ )` }}</span>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ `${orderedItem.flavourName} | ${orderedItem.sizeName}` }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="decrementAtIndex(orderedItem.index)">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-icon>
                  <v-btn text disabled rounded outlined>
                    <span class="white--text">
                      {{ orderedItem.quantity }}
                    </span>
                  </v-btn>
                </v-list-item-icon>
                <v-list-item-action style="margin-left:0px;">
                  <v-btn icon @click="incrementAtIndex(orderedItem.index)">
                    <v-icon>add</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
              <template v-if="orderedItem.additions.length > 0">
                <span v-for="(additionId, index) in orderedItem.additions"
                  :key="`addition_index_${index}_ordered_item_index_${i}`" class="mx-10 order-component-addition">
                  {{ getAddition(additionId).name }}
                  <span v-if="getAddition(additionId).priceModifier !== 0" class="ml-2">{{ `(
                  ${getAddition(additionId).priceModifier}€ )` }}</span>
                  <br />
                </span>
              </template>
            </template>
            <v-list-item v-if="orderedItems.length === 0">
              <v-list-item-content>
                <v-alert type="warning" icon="add_shopping_cart">
                  Dein Warenkorb ist leider leer, wähle Items aus, damit diese bestellt werden können.
                </v-alert>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-text v-else style="height: 200px" class="d-flex flex-row justify-center">
          <span style="font-size: 10em; align-self: center;">{{ orderId }}</span>
        </v-card-text>
        <v-card-actions v-if="!orderId">
          <v-btn outlined @click="cash">
            <v-icon class="mr-2">send</v-icon>
            Bestellung absenden
          </v-btn>
        </v-card-actions>
        <v-card-actions v-else>
          <v-btn outlined @click="closeDialog">
            Fertig
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'CalculatorButtonCollection',
  props: [],
  components: {},
  data() {
    return {
      dialog: false,
      orderId: null
    }
  },
  created: function () { },
  mounted: function () { },
  methods: {
    ...mapActions('ordered-items', {
      createOrderedItems: 'create'
    }),
    ...mapActions('ordered-items-have-additions', {
      createMaps: 'create'
    }),
    ...mapMutations('waiter', {
      incrementAtIndex: 'incrementAtIndex',
      decrementAtIndex: 'decrementAtIndex',
      clearOrder: 'clearOrder'
    }),
    ...mapActions('waiter', {
      quickCash: 'quickCash',
      finalizeOrder: 'finalizeOrder'
    }),
    ...mapActions('utilities', {
      setFetchPendingFlag: 'setFetchPendingFlag',
      resetFetchPendingFlag: 'resetFetchPendingFlag'
    }),
    ...mapActions('utilities', {
      setNotification: 'setNotification'
    }),
    openDialog: function () {
      this.dialog = true
    },
    cash: function () {
      this.setFetchPendingFlag().then(() => {
        if (this.immediateOrderMode.value) {
          this.quickCash().then((res) => {
            console.log(res)
            this.resetFetchPendingFlag()
            this.closeDialog()
          })
        } else {
          this.finalizeOrder().then(res => {
            console.log(res)
            this.resetFetchPendingFlag()
            this.showOrderId(Math.min(...res.map(({ id }) => id)))
          })
        }
      })
    },
    closeDialog: function () {
      this.dialog = false
      this.orderId = null
    },
    showOrderId: function (id) {
      // only for this jubilaeum show the order-id as it will be the identifyer for customers and the base-station
      this.orderId = id
      this.dialog = true
    }
  },
  watch: {},
  computed: {
    ...mapGetters('waiter', {
      order: 'order'
    }),
    ...mapGetters('items', {
      getItem: 'get',
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
    ...mapGetters('config', {
      immediateOrderMode: 'immediateOrderMode'
    }),
    orderedItems: function () {
      return this.order.map((orderedItem, index) => {
        let item = this.getItem(orderedItem.itemId)
        let additionsPriceSum = orderedItem.additions.map(additionId => this.getAddition(additionId)).reduce((acc, val) => { if (val) { return acc + val.priceModifier } else { return acc } }, 0)
        return {
          ...orderedItem,
          index,
          item,
          additionsPriceSum,
          baseItemName: this.getBaseItem(item.baseItemId).name,
          flavourName: this.getFlavour(item.flavourId).name,
          sizeName: this.getSize(item.sizeId).name
        }
      })
    },
    sum: function () {
      return this.order
        .map(orderedItem => {
          let { quantity, itemId, additions: maps } = orderedItem
          let item = this.getItem(itemId)
          if (!item) {
            return 0
          }
          let summedAdditions = maps
            .map(additionId => this.getAddition(additionId))
            .reduce((acc, val) => {
              if (val) {
                return acc + val.priceModifier
              } else {
                return acc + 0
              }
            }, 0)
          return quantity * (item.price + summedAdditions)
        })
        .reduce((acc, val) => acc + val, 0)
    },
    roundedSum: function () {
      return Math.round(this.sum * 100) / 100
    },
    paddedSum: function () {
      return `${this.roundedSum}`.split('.').map((val, i) => {
        if (i === 1) {
          val = val.padEnd(2, '0')
        }
        return val
      }).join(',')
    },
    beautifiedSum: function () {
      if (this.paddedSum.includes(',')) {
        return this.paddedSum
      } else {
        return `${this.paddedSum},--`
      }
    }
  }
}
</script>
