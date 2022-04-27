<template>
  <div>
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
                {{ `${orderedItem.baseItemName}` }}
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
                        {{ `${orderedItem.cashableItem ? orderedItem.cashableItem.toBeCashed : 0}/${orderedItem.cashableItem ? orderedItem.cashableItem.cashable : orderedItem.quantity}` }}
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
                <br />
            </span>
        </template>
        </template>
      </v-list>
    </v-container>
    <v-btn
          elevation="2"
          fab
          fixed
          bottom
          right
          @click="cash"
          >
          <v-icon>euro_symbol</v-icon>
      </v-btn>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
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
    decrementId: function (oi) {
      this.decrementOrderedItem(oi)
    },
    incrementId: function (oi) {
      this.incrementOrderedItem(oi)
    },
    cash: function () {
      console.log('Now cashing')
      this.clearCash()
    }
  },
  watch: {},
  computed: {
    ...mapGetters('cash', {
      getCashableItem: 'get'
    }),
    ...mapGetters('ordered-items', {
      findOrderedItems: 'find'
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
        let cashableItem = this.getCashableItem(orderedItem.id)
        if (item) {
          return {
              ...orderedItem,
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
