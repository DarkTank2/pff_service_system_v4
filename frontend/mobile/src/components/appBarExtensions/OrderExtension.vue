<template>
    <span class="text-h5 bordered px-2 ml-auto mr-auto">{{ `Summe: ${beautifiedSum}€` }}</span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'OrderExtension',
    components: {},
    props: [],
    data: () => ({}),
    created: function () {},
    mounted: async function () {},
    methods: {},
    computed: {
        ...mapGetters('waiter', {
            rawOrder: 'order'
        }),
        ...mapGetters('items', {
            getItem: 'get'
        }),
        ...mapGetters('base-items', {
            getBaseItem: 'get'
        }),
        ...mapGetters('additions', {
            getAddition: 'get'
        }),
        ...mapGetters('flavours', {
            getFlavour: 'get'
        }),
        ...mapGetters('sizes', {
            getSize: 'get'
        }),
        orderedItems: function () {
            return this.rawOrder.map((orderedItem, index) => {
                let item = this.getItem(orderedItem.itemId)
                let baseItem = this.getBaseItem(item.baseItemId)
                let additionsPriceSum = orderedItem.additions.map(additionId => this.getAddition(additionId)).reduce((acc, val) => { if (val) { return acc + val.priceModifier } else { return acc }}, 0)
                return {
                    ...orderedItem,
                    index,
                    item,
                    additionsPriceSum,
                    baseItemName: baseItem.name,
                    available: baseItem.available,
                    flavourName: this.getFlavour(item.flavourId).name,
                    sizeName: this.getSize(item.sizeId).name
                }
            })
        },
        sum: function () {
            return this.orderedItems
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
    },
    watch: {}
}
</script>

<style>
.bordered {
  border: 2px solid #2196f3 !important;
  border-radius: 8px;
}
</style>