<template>
  <div class="d-flex justify-space-around" style="width: 100%;">
    <v-btn outlined @click="openDialog()">
      <v-icon>shopping_cart</v-icon>
      <span class="ml-2">Bestellung ansehen</span>
    </v-btn>
    <v-btn outlined @click="cash">
      <v-icon>euro_symbol</v-icon>
      <span class="ml-2">Bestellung kassieren</span>
    </v-btn>
    <v-btn outlined @click="clearOrder">
      <v-icon>clear</v-icon>
      <span class="ml-2">Zurücksetzen</span>
    </v-btn>
    <v-dialog v-model="dialog" max-width="600px" @click:outside="closeDialog">
      <v-card>
        <v-card-title class="d-flex justify-space-around">
          <span>Deine Bestellung</span>
          <span>{{ `Summe: ${roundedSum}€` }}</span>
        </v-card-title>
        <v-card-text>
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
        <v-card-actions>
          <v-btn outlined @click="cash">
            <v-icon class="mr-2">send</v-icon>
            Bestellung absenden
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
      dialog: false
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
            this.closeDialog()
          })
        }
      })
    },
    closeDialog: function () {
      this.dialog = false
    },
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
  }
}
</script>
