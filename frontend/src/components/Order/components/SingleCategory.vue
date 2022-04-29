<template>
    <v-row style="padding: 20px;">
        <v-col cols="12">
            <v-card style="border: thin solid;" class="rounded-pill" :id="`category_${category.id}`">
                <v-card-text class="text-center">
                    {{category.name}}
                    <span v-if="disabled">( Deaktiviert )</span>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-for="baseItem in baseItems" :key="`cat_${categoryId}_col_${baseItem.id}`" cols="4" style="padding: 2px;">
            <v-card :style="itemStyle" :color="chooseColor(baseItem, category)" @click.stop="selectBaseItem(baseItem)" :disabled="!baseItem.available || disabled">
                <v-card-text class="text-center mx-auto">
                    {{ `${baseItem.name}` }}
                    <br/>
                    <span v-if="!baseItem.available">(ausverkauft)</span>
                    <span v-if="disabled">( -> Buffet )</span>
                </v-card-text>
            </v-card>
        </v-col>
        <v-dialog
            v-model="dialog"
            fullscreen
            scrollable
            transition="dialog-bottom-transition"
            >
            <v-card v-if="selectedItem">
                <v-system-bar>
                    <v-spacer></v-spacer>
                    <v-btn icon @click.stop="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-system-bar>
                <v-toolbar max-height="56px">
                    <v-spacer></v-spacer>
                    <v-toolbar-title>{{selectedItem.name}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <span class="text-body-1">Variationen:</span>
                        <v-radio-group v-model="selectedFlavour" dense>
                            <v-radio
                                v-for="flavour in flavours"
                                :key="`flavour_${flavour.id}`"
                                :label="`${flavour.name}`"
                                :value="flavour.id"
                                :disabled="disabledFlavours.includes(flavour.id)"
                                dense
                            ></v-radio>
                        </v-radio-group>
                        <v-divider class="mb-4"></v-divider>
                        <span class="text-body-1">Größe:</span>
                        <v-radio-group v-model="selectedSize" dense>
                            <v-radio
                                v-for="size in sizes"
                                :key="`size_${size.id}`"
                                :label="`${size.name}`"
                                :value="size.id"
                                :disabled="disabledSizes.includes(size.id)"
                                dense
                            ></v-radio>
                        </v-radio-group>
                        <v-divider class="mb-4"></v-divider>
                        <span v-if="additions.length > 0" class="text-body-1">Extras:</span>
                        <v-checkbox
                            v-for="addition in additions"
                            :key="`category_${categoryId}_checkbox_addition_${addition.id}`"
                            :value="addition.id"
                            v-model="selectedAdditions"
                            :label="addition.name"
                            dense
                            hide-details
                            >
                            <template #label>
                                <span>{{ addition.name }}</span>
                                <span v-if="addition.priceModifier !== 0" class="ml-2">{{ `( +${addition.priceModifier}€ )` }}</span>
                            </template>
                        </v-checkbox>
                        <v-divider v-if="additions.length > 0" class="my-4"></v-divider>
                        <v-textarea
                            label="Kommentar"
                            v-model="comment"
                            hint="Füge diesem Item ein Kommentar hinzu."
                            outlined
                            />
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-container fluid>
                        <v-row>
                            <v-col cols="12">
                                <v-btn
                                    block
                                    elevation="2"
                                    fab
                                    rounded
                                    @click="addToOrder"
                                    >
                                    Zur Bestellung hinzufügen 
                                    <v-icon>add_shopping_cart</v-icon>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
    name: 'SingleCategory',
    props: {
        category: {
            required: true,
            type: Object
        }
    },
    data: () => ({
        dialog: false,
        selectedItem: null,
        selectedFlavour: null,
        selectedSize: null,
        comment: null,
        selectedAdditions: []
    }),
    created: function () {},
    mounted: async function () {},
    methods: {
        ...mapMutations('waiter', {
            addItemToOrder: 'addOrderedItem'
        }),
        selectBaseItem: function (baseItem) {
            this.selectedItem = baseItem
            let items = this.findItems({ query: { baseItemId: baseItem.id, default: true } }).data
            let defaultItem = items[0]
            this.selectedFlavour = defaultItem.flavourId
            this.selectedSize = defaultItem.sizeId

            let maps = this.findMaps({ query: { baseItemId: baseItem.id } }).data
            this.selectedAdditions = maps.filter(map => map.default).map(({ additionId }) => additionId)
            this.dialog = true
            
        },
        closeDialog: function () {
            this.selectedItem = null
            this.selectedFlavour = null
            this.selectedSize = null
            this.comment = null
            this.selectedAdditions = []
            this.dialog = false
        },
        chooseColor: function (baseItem, category) {
            if (!baseItem) {
                return 'grey lighten-1'
            }
            if (!baseItem.available || this.disabled) {
                return 'grey darken-2'
            }
            if (category.color) {
                return category.color
            }
            return 'blue darken-3'
        },
        addToOrder: function () {
            let item = this.findItems({
                query: {
                    baseItemId: this.selectedItem.id,
                    flavourId: this.selectedFlavour,
                    sizeId: this.selectedSize
                }
            }).data[0]
            if (!item) {
                console.log('No item with given configuration found!')
            } else {
                this.addItemToOrder({ itemId: item.id, quantity: 1, comment: this.comment, additions: [...this.selectedAdditions] })
                this.closeDialog()
            }
        }
    },
    computed: {
        ...mapGetters('env', {
            listEnv: 'list'
        }),
        ...mapGetters('base-items', {
            getBaseItem: 'get',
            findBaseItems: 'find'
        }),
        ...mapGetters('items', {
            findItems: 'find'
        }),
        ...mapGetters('sizes', {
            getSizes: 'get',
            findSizes: 'find'
        }),
        ...mapGetters('flavours', {
            getFlavour: 'get',
            findFlavours: 'find'
        }),
        ...mapGetters('base-items-have-additions', {
            findMaps: 'find'
        }),
        ...mapGetters('additions', {
            findAdditions: 'find'
        }),
        env: function () {
            return this.listEnv[0]
        },
        categoryId: function () {
            return this.category.id
        },
        disabled: function () {
            return this.env.disabledCategories.includes(this.categoryId)
        },
        itemHeight: function () {
            return `${(window.screen.width - 8) / 3}px`
        },
        itemStyle: function () {
            return `height: ${this.itemHeight};`
        },
        baseItems: function () {
            return this.findBaseItems({ query: {categoryId: this.categoryId} }).data
        },
        items: function () {
            return this.findItems({ query: { baseItemId: this.selectedItem?.id } }).data
        },
        flavourIds: function () {
            return [...new Set(this.items.map(({ flavourId }) => flavourId))]
        },
        flavours: function () {
            return this.findFlavours({ query: { id: { $in: this.flavourIds } } }).data
        },
        sizeIds: function () {
            return [...new Set(this.items.map(({ sizeId }) => sizeId))]
        },
        sizes: function () {
            return this.findSizes({ query: { id: { $in: this.sizeIds } } }).data
        },
        disabledFlavours: function () {
            let possibleItems = this.findItems({ query: { sizeId: this.selectedSize } }).data
            let possibleFlavourIds = possibleItems.map(({ flavourId }) => flavourId)
            return this.flavourIds.filter(id => !possibleFlavourIds.includes(id))
        },
        disabledSizes: function () {
            let possibleItems = this.findItems({ query: { flavourId: this.selectedFlavour } }).data
            let possibleSizeIds = possibleItems.map(({ sizeId }) => sizeId)
            return this.sizeIds.filter(id => !possibleSizeIds.includes(id))
        },
        mapQuery: function () {
            return { query: { baseItemId: this.selectedItem?.id } }
        },
        maps: function () {
            return this.findMaps(this.mapQuery).data
        },
        additionsQuery: function () {
            return { query: { id: { $in: this.maps.map(({ additionId }) => additionId) } } }
        },
        additions: function () {
            return this.findAdditions(this.additionsQuery).data
        }
    },
    watch: {}
}
</script>

<style>

</style>