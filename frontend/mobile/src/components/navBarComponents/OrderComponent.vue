<template>
    <div>
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="text-h6">
                        Deine Bestellung
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
            <template v-for="(orderedItem, i) in orderedItems">
                <v-divider
                    v-if="orderedItem.index !== 0"
                    :key="`divider_index_${orderedItem.index}`"
                    :class="orderedItems.at(i - 1).additions.length > 0 ? 'mt-4' : ''"
                    />
                <v-list-item dense :key="`ordered_item_index_${orderedItem.index}`" :two-line="!orderedItem.comment" :three-line="!!orderedItem.comment" class="ma-1" :class="{ bordered: !orderedItem.available }">
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
                        <v-list-item-subtitle v-if="!orderedItem.available">
                            Ausverkauft!
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
                        <v-btn icon @click="incrementAtIndex(orderedItem.index)" :disabled="!orderedItem.available">
                            <v-icon>add</v-icon>
                        </v-btn>
                    </v-list-item-action>
                </v-list-item>
                <template v-if="orderedItem.additions.length > 0">
                    <span
                        v-for="(additionId, index) in orderedItem.additions"
                        :key="`addition_index_${index}_ordered_item_index_${i}`"
                        class="mx-10 order-component-addition"
                        >
                        {{ getAddition(additionId).name }}
                        <span v-if="getAddition(additionId).priceModifier !== 0" class="ml-2">{{ `( ${getAddition(additionId).priceModifier}€ )` }}</span>
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
            <v-divider></v-divider>
            <v-divider></v-divider>
            <v-divider></v-divider>
            <v-list-item>
                <v-list-item-icon>
                    <v-icon>person_pin</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-text-field
                        dense
                        outlined
                        label="Dein Name"
                        hint="Gib hier bitte deinen Namen ein."
                        v-model="nameModel"
                        clearable
                        @change="handleName"
                        :error="getName === '' || getName === null"
                        />
                </v-list-item-content>
            </v-list-item>
            <v-list-item>
                <v-list-item-icon>
                    <v-icon>table_restaurant</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-select
                        dense
                        outlined
                        :items="tables"
                        @change="setTable"
                        item-text="name"
                        item-value="id"
                        label="Tisch-Nummer:"
                        hint="Wähle bitte einen Tisch aus."
                        :error="!getTableId"
                        :value="getTableId"
                        />
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <v-btn
                        block
                        elevation="2"
                        fab
                        rounded
                        outlined
                        @click="sendOrder"
                        :disabled="orderedItems.length === 0 || anyItemDisabled"
                        >
                        <v-icon class="mr-2">send</v-icon>
                        Bestellung absenden 
                    </v-btn>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    name: 'OrderNavBarComponent',
    components: {},
    data: () => ({
        nameModel: ''
    }),
    created: function () {},
    mounted: function () {
        this.fetchName()
        this.fetchTables()
        this.nameModel = this.getName
    },
    methods: {
        ...mapMutations('base', ['setName', 'fetchName', 'setTableId']),
        ...mapMutations('waiter', {
            incrementAtIndex: 'incrementAtIndex', 
            decrementAtIndex: 'decrementAtIndex',
            clearOrder: 'clearOrder'
        }),
        ...mapActions('tables', {
            fetchTables: 'find'
        }),
        ...mapActions('ordered-items', {
            createOrderedItems: 'create'
        }),
        ...mapActions('ordered-items-have-additions', {
            createMaps: 'create'
        }),
        ...mapActions('utilities', {
            setFetchPendingFlag: 'setFetchPendingFlag',
            resetFetchPendingFlag: 'resetFetchPendingFlag',
            setNotification: 'setNotification'
        }),
        handleName: function (newName) {
            if (newName === null) newName = ''
            if (newName.length > 20) newName = newName.slice(0, 20)
            this.setName(newName)
            this.nameModel = this.getName
        },
        setTable: function (tableId) {
            this.setTableId(tableId)
        },
        sendOrder: function () {
            if (this.getName === null || this.getName === '') {
                console.log('Invalid name')
                return
            }
            if (this.getTableId === null) {
                console.log('No table selected')
                return
            }
            let data = this.rawOrder.map((orderedItem) => {
                return {
                    ...orderedItem,
                    waiter: this.getName,
                    tableId: this.getTableId
                }
            })
            if (data.length === 0) return
            this.$emit('closeNavbar')
            this.setFetchPendingFlag().then(() => {
                this.createOrderedItems([data]).then((res) => {
                    let additions = []
                    data.forEach((item) => {
                        let i = res.findIndex(orderedItem => {
                            return orderedItem.itemId === item.itemId
                                && orderedItem.quantity === item.quantity
                                && orderedItem.comment === item.comment
                        })
                        if (item.additions.length > 0) {
                            // perform addition adding for searched ordered item
                            let { id: orderedItemId } = res.at(i)
                            item.additions.forEach(addition => {
                                additions.push({ orderedItemId, additionId: addition.id || addition, amount: addition.amount || 1 })
                            })
                        }
                        res[i] = {} // remove ordered item, so that the same item can not be found anymore
                    })
                    if (additions.length > 0) {
                        this.createMaps([additions]).then(() => {
                            this.resetFetchPendingFlag().then(() => {
                                this.setNotification({ message: 'Bestellung erfolgreich!', timeout: 2000, type: 'success' })
                            })
                            this.clearOrder()
                        }).catch(() => {
                            this.resetFetchPendingFlag().then(() => {
                                this.setNotification({ message: `Fehler! Melde dich bitte bei Alex und zeige ihm deinen Warenkorb!`, timeout: -1, type: 'error' })
                            })
                        })
                    } else {
                        this.resetFetchPendingFlag().then(() => {
                            this.setNotification({ message: 'Bestellung erfolgreich!', timeout: 2000, type: 'success' })
                        })
                        this.clearOrder()
                    }
                }).catch(() => {
                    this.resetFetchPendingFlag().then(() => {
                        this.setNotification({ message: `Fehler! Melde dich bitte bei Alex und zeige ihm deinen Warenkorb!`, timeout: -1, type: 'error' })
                    })
                })
            })
            return data
        }
    },
    computed: {
        ...mapGetters('base', ['getName', 'getTableId']),
        ...mapGetters('tables', {
            tables: 'list'
        }),
        ...mapGetters('waiter', {
            rawOrder: 'order'
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
        anyItemDisabled: function () {
            return !this.rawOrder.map((orderedItem) => {
                let item = this.getItem(orderedItem.itemId)
                let baseItem = this.getBaseItem(item.baseItemId)
                return baseItem.available
            }).reduce((acc, val) => acc && val, true)
        }
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
  border: 1px solid #F44336;
  border-radius: 4px;
}
</style>