<template>
  <v-row>
    <v-col cols="12" v-if="!denseMode.value">
      <v-card style="border: thin solid;" class="rounded-pill" :id="`category_${category.id}`">
        <v-card-text class="text-center">
          {{ category.name }}
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <GridLayout
        :layout.sync="usedLayout"
        :col-num="12"
        :row-height="30"
        :is-draggable="configMode.value"
        :is-resizable="configMode.value"
        :use-css-transforms="true"
        @layout-updated="layoutUpdatedEvent">
        <GridItem v-for="item in usedLayout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          :style="gridElementStyle">
          <v-card style="height: 100%;" :color="category.color" @click.stop="!configMode.value ? item.entity.handler(item.entity.params) : null">
            <v-card-text class="text-center mx-auto">
              <span class="text-h4">{{ item.entity.displayName }}</span>
            </v-card-text>
          </v-card>
        </GridItem>
      </GridLayout>
    </v-col>
    <v-dialog v-model="dialog" max-width="600px" @click:outside="closeDialog">
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
              <v-radio v-for="flavour in flavours" :key="`flavour_${flavour.id}`" :label="`${flavour.name}`"
                :value="flavour.id" :disabled="disabledFlavours.includes(flavour.id)" dense></v-radio>
            </v-radio-group>
            <v-divider class="mb-4"></v-divider>
            <span class="text-body-1">Größe:</span>
            <v-radio-group v-model="selectedSize" dense>
              <v-radio v-for="size in sizes" :key="`size_${size.id}`" :label="`${size.name}`" :value="size.id"
                :disabled="disabledSizes.includes(size.id)" dense></v-radio>
            </v-radio-group>
            <v-divider class="mb-4"></v-divider>
            <span v-if="additions.length > 0" class="text-body-1">Extras:</span>
            <v-checkbox v-for="addition in additions" :key="`category_${categoryId}_checkbox_addition_${addition.id}`"
              :value="addition.id" v-model="selectedAdditions" :label="addition.name" dense hide-details>
              <template #label>
                <span>{{ addition.name }}</span>
                <span v-if="addition.priceModifier !== 0" class="ml-2">{{ `( +${addition.priceModifier}€ )` }}</span>
              </template>
            </v-checkbox>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-btn block elevation="2" fab rounded @click="addToOrder">
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
import { GridLayout, GridItem } from 'vue-grid-layout'

export default {
  name: 'SingleCategory_Calc',
  props: {
    category: {
      required: true,
      type: Object
    }
  },
  components: {
    GridLayout,
    GridItem
  },
  data: () => ({
    dialog: false,
    selectedItem: null,
    selectedFlavour: null,
    selectedSize: null,
    selectedAdditions: [],
    quantity: 1,
    usedLayout: [],
    isChangeable: true
  }),
  created: function () { },
  mounted: async function () { },
  methods: {
    ...mapMutations('waiter', {
      addItemToOrder: 'addOrderedItem'
    }),
    ...mapMutations('config', {
      updateLayout: 'updateLayout'
    }),
    selectBaseItem: function (baseItem) {
      this.selectedItem = baseItem
      let allItems = this.findItems({ query: { baseItemId: baseItem.id } }).data
      let defaultItems = allItems.filter(({ default: def }) => def)

      let defaultItem = defaultItems[0] || allItems[0]
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
      this.selectedAdditions = []
      this.dialog = false
      this.quantity = 1
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
        this.addItemToOrder({ itemId: item.id, quantity: this.quantity, comment: '', additions: [...this.selectedAdditions] })
        this.closeDialog()
      }
    },
    decrementQuantity: function () {
      this.quantity -= 1
      if (this.quantity < 1) this.quantity = 1
    },
    addItem: function (item) {
      // this will only happen in quickmode
      this.addItemToOrder({ itemId: item.id, quantity: 1, comment: '', additions: [] })
    },
    calculateLayout: function () {
      if (this.storedLayout === null) {
        console.log('Stored layout is null => not initialized')
        return
      }
      if (!this.shownEntities || this.shownEntities.length === 0) {
        console.log('Shown entities either not ready or empty')
        return
      }
      let temporaryLayout = []
      let notInitializedGridItems = []
      this.shownEntities.forEach(entity => {
        let { id } = entity.params
        let temporaryI = `${this.quickMode.quickMode ? 'itemId' : 'baseItemId'}_${id}`
        let storedGridItem = this.storedLayout.find(({ i }) => i === temporaryI)
        if (!storedGridItem) {
          notInitializedGridItems.push({ entity, x: null, y: null, h: 2, w: 2, i: temporaryI })
        } else {
          temporaryLayout.push({ ...storedGridItem, entity })
        }
      })
      notInitializedGridItems.forEach(gridItem => {
        temporaryLayout.push({ ...gridItem,
          x: (temporaryLayout.length * 2) % 12,
          y: temporaryLayout.length + 12
        })
      })

      let equalLayouts = true
      this.usedLayout.forEach(usedGridItem => {
        let exactSameGridItem = temporaryLayout.find(storedGridItem => {
          return storedGridItem.i === usedGridItem.i
            && storedGridItem.x === usedGridItem.x
            && storedGridItem.y === usedGridItem.y
            && storedGridItem.w === usedGridItem.w
            && storedGridItem.h === usedGridItem.h
        })
        if (!exactSameGridItem) {
          equalLayouts = false
        }
      })
      temporaryLayout.forEach(storedGridItem => {
        let exactSameGridItem = this.usedLayout.find(usedGridItem => {
          return storedGridItem.i === usedGridItem.i
            && storedGridItem.x === usedGridItem.x
            && storedGridItem.y === usedGridItem.y
            && storedGridItem.w === usedGridItem.w
            && storedGridItem.h === usedGridItem.h
        })
        if (!exactSameGridItem) {
          equalLayouts = false
        }
      })
      if (!equalLayouts) {
        this.usedLayout = temporaryLayout
      }
    },
    layoutUpdatedEvent: function (newLayout) {
      // incoming event from layout
      // pass it to store since store handles changes in layout
      // first displayed layout must be parsed to stored-layout
      // additionally this layout is only a small part of the overall saved layout (for all categories)
      // thus the layouts must be merged
      console.log('Saving new layout')
      this.updateLayout(newLayout.map(({ i, x, y, w, h }) => ({ i, x, y, w, h })))
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
    ...mapGetters('config', {
      quickMode: 'quickMode',
      displayedItems: 'displayedItems',
      formatItem: 'formatItem',
      storedLayout: 'layout',
      configMode: 'configMode',
      denseMode: 'denseMode'
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
    gridElementStyle: function () {
      let style = {}
      if (this.configMode.value) {
        style['touch-action'] = 'none'
      }
      return style
    },
    baseItems: function () {
      return this.findBaseItems({ query: { categoryId: this.categoryId, id: { $in: this.displayedItems } } }).data
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
      if (!this.selectedSize) {
        return []
      }
      let possibleItems = this.findItems({ query: { sizeId: this.selectedSize } }).data
      let possibleFlavourIds = possibleItems.map(({ flavourId }) => flavourId)
      return this.flavourIds.filter(id => !possibleFlavourIds.includes(id))
    },
    disabledSizes: function () {
      if (!this.selectedFlavour) {
        return []
      }
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
    },
    allItems: function () {
      let allBaseItems = this.findBaseItems({ query: { categoryId: this.categoryId } }).data
      let filteredBaseItems = allBaseItems.filter(({ id }) => this.displayedItems.includes(id))
      let items = this.findItems({ query: { baseItemId: { $in: filteredBaseItems.map(({ id }) => id) } } }).data
      return items.map(item => {
        return {
          ...item,
          baseItemName: this.getBaseItem(item.baseItemId)?.name,
          sizeName: this.getSizes(item.sizeId)?.name,
          flavourName: this.getFlavour(item.flavourId)?.name
        }
      })
    },
    shownEntities: function () {
      let data = []
      if (this.quickMode.quickMode) {
        this.allItems.forEach(item => {
          data.push({
            displayName: this.formatItem(item),
            handler: this.addItem,
            params: item
          })
        })
      } else {
        this.baseItems.forEach(baseItem => {
          data.push({
            displayName: baseItem.name,
            handler: this.selectBaseItem,
            params: baseItem
          })
        })
      }
      return data
    }
  },
  watch: {
    storedLayout: {
      handler: function () {
        this.calculateLayout()
      },
      deep: true,
      immediate: true
    },
    shownEntities: {
      handler: function () {
        this.calculateLayout()
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style>
.bordered {
  border-color: #2196f3 !important;
  border-width: 2px;
}
</style>