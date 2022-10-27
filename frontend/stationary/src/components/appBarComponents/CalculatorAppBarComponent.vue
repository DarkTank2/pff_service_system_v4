<template>
    <span class="text-h6 bordered px-2">{{ `&sum; ${roundedSum}€` }}</span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'CashAppBarComponent',
    computed: {
        ...mapGetters('waiter', {
            order: 'order'
        }),
        ...mapGetters('items', {
            getItem: 'get'
        }),
        ...mapGetters('ordered-items', {
            getOrderedItem: 'get'
        }),
        ...mapGetters('ordered-items-have-additions', {
            findMaps: 'find'
        }),
        ...mapGetters('additions', {
            getAddition: 'get'
        }),
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
        }
    }
}
</script>

<style scoped>
.bordered {
  border: 2px solid #2196f3 !important;
  border-radius: 8px;
}
</style>