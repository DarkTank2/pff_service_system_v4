<template>
    <v-row style="padding: 20px;" v-intersect="{
        handler: onIntersect,
        options: { threshold, rootMargin: '0px 0px -56px' }
      }">
        <v-col cols="12">
            <v-card style="border: thin solid;" class="rounded-pill" :id="`category_${category.id}`">
                <v-card-text class="text-center">
                    {{category.name}}
                    <span v-if="disabled">( Deaktiviert )</span>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col v-for="baseItem in baseItems" :key="`cat_${categoryId}_col_${baseItem.id}`" cols="4" style="padding: 2px;">
            <v-card style="aspect-ratio: 1; background: linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.34) 30%, rgba(0,0,0,0) 100%);" :color="chooseColor(baseItem, category)" @click.stop="selectBaseItem(baseItem)" :disabled="!baseItem.available || disabled">
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
                        <v-icon>clear</v-icon>
                    </v-btn>
                </v-system-bar>
                <v-toolbar max-height="56px">
                    <v-spacer></v-spacer>
                    <v-toolbar-title>{{`${selectedItem.name} ( à ${currentPrice}€ )`}}</v-toolbar-title>
                    <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                    <v-container fluid>
                        <v-list-item class="d-flex">
                            <v-list-item-action>
                                <v-btn icon @click="decrementQuantity()">
                                    <v-icon>remove</v-icon>
                                </v-btn>
                            </v-list-item-action>
                            <v-list-item-icon>
                                <v-btn text disabled rounded outlined class="bordered">
                                    <span class="white--text">
                                        {{ quantity }}
                                    </span>
                                </v-btn>
                            </v-list-item-icon>
                            <v-list-item-action>
                                <v-btn icon @click="quantity += 1">
                                    <v-icon>add</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                        <v-divider></v-divider>
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
        selectedAdditions: [],
        quantity: 1,
        isIntersecting: false,
        threshold: new Array(101).fill(0).map((_, i) => i / 100)
    }),
    created: function () {},
    mounted: async function () {
      this.setCategoryVisibilityState({ active: false, id: this.categoryId })
    },
    methods: {
        ...mapMutations('waiter', {
            addItemToOrder: 'addOrderedItem'
        }),
        ...mapMutations('base', {
          setCategoryVisibilityState: 'setCategoryVisibilityState'
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
            this.quantity = 1
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
                this.addItemToOrder({ itemId: item.id, quantity: this.quantity, comment: this.comment, additions: [...this.selectedAdditions] })
                this.closeDialog()
            }
        },
        decrementQuantity: function () {
            this.quantity -= 1
            if (this.quantity < 1) this.quantity = 1
        },
        onIntersect (entries) {
          this.setCategoryVisibilityState({ active: entries[0].intersectionRatio, id: this.categoryId })
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
            findAdditions: 'find',
            getAddition: 'get'
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
        },
        currentPrice: function () {
            let item = this.findItems({
                query: {
                    baseItemId: this.selectedItem.id,
                    flavourId: this.selectedFlavour,
                    sizeId: this.selectedSize
                }
            }).data[0]
            let itemPrice = item ? item.price : 0
            let additionsSum = this.selectedAdditions.map(id => this.getAddition(id)).reduce((acc, val) => val ? (val.priceModifier + acc) : acc, 0)
            return (itemPrice + additionsSum)
        }
    },
    watch: {}
}
</script>

<style>

</style>