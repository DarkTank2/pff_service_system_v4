<template>
    <span class="text-h6 bordered px-2">{{ `&sum; ${roundedSum}€` }}</span>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'CashAppBarComponent',
    computed: {
        ...mapGetters('cash', {
            cashingItems: 'list'
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
            return this.cashingItems
                .map(orderedItem => {
                    let { toBeCashed, id } = orderedItem
                    let fullOrderedItem = this.getOrderedItem(id)
                    if (!fullOrderedItem) {
                        return 0
                    }
                    let item = this.getItem(fullOrderedItem.itemId)
                    if (!item) {
                        return 0
                    }
                    let maps = this.findMaps({ query: { orderedItemId: id } }).data
                    let summedAdditions = maps
                        .map(({ additionId }) => this.getAddition(additionId))
                        .reduce((acc, val) => {
                            if (val) {
                                return acc + val.priceModifier
                            } else {
                                return acc + 0
                            }
                        }, 0)
                    return toBeCashed * (item.price + summedAdditions)
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
  border: 2px solid #928cff !important;
  border-radius: 8px;
}
</style>