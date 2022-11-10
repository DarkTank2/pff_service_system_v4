<template>
  <v-container fluid style="padding-top: 20px;">
    <v-expansion-panels
      multiple
      >
      <v-expansion-panel>
        <v-expansion-panel-header>
          Additions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="additions"
            :dependencies="{}"
            :headers="[{value:'id',text:'ID'},{value:'name',text:'Name'},{value:'priceModifier',text:'Price-modification'}]"
            serviceConstructor="Addition"
            :config="{id:{changeable:false},name:{changeable:true},priceModifier:{changeable:true,type:'number'}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Base-items
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="baseItems"
            :dependencies="{ categories }"
            :headers="[{ value: 'id', text: 'ID' }, { value: 'name', text: 'Name' }, { value: 'categoryId', text: 'Category' },{value:'available',text:'Available'}]"
            serviceConstructor="BaseItem"
            :config="{ id: { changeable: false }, name: { changeable: true }, categoryId: { changeable: { key: 'categories', itemValue: 'id', itemText: 'name' } },available:{changeable:true,type:'boolean'} }"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Base-items-have-additions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="baseItemsHaveAdditions"
            :dependencies="{additions,baseItems}"
            :headers="[{value:'id',text:'ID'},{value:'baseItemId',text:'Item-Name'},{value:'additionId',text:'Addition'},{value:'default',text:'Default'}]"
            serviceConstructor="BaseItemHasAddition"
            :config="{id:{changeable:false},baseItemId:{changeable:{key:'baseItems',itemValue:'id',itemText:'name'}},additionId:{changeable:{key:'additions',itemValue:'id',itemText:'name'}},default:{changeable:true,type:'boolean'}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Categories
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="categories"
            :dependencies="{}"
            :headers="[{value:'id',text:'ID'},{value:'name',text:'Name'},{value:'color',text:'Color'},{value:'inactive',text:'Inactive'}]"
            serviceConstructor="Category"
            :config="{id:{changeable:false},name:{changeable:true},color:{changeable:true},inactive:{changeable:true,type:'boolean'}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Flavours
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="flavours"
            :dependencies="{}"
            :headers="[{value:'id',text:'ID'},{value:'name',text:'Name'}]"
            serviceConstructor="Flavour"
            :config="{id:{changeable:false},name:{changeable:true}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Items
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="items"
            :dependencies="{baseItems,sizes,flavours}"
            :headers="[{value:'id',text:'ID'},{value:'baseItemId',text:'Item-Name'},{value:'price',text:'Price'},{value:'flavourId',text:'Flavour'},{value:'sizeId',text:'Size'},{value:'default',text:'Default'}]"
            serviceConstructor="Item"
            :config="{id:{changeable:false},baseItemId:{changeable:{key:'baseItems',itemValue:'id',itemText:'name'}},price:{changeable:true,type:'number'},flavourId:{changeable:{key:'flavours',itemValue:'id',itemText:'name'}},sizeId:{changeable:{key:'sizes',itemValue:'id',itemText:'name'}},default:{changeable:true,type:'boolean'}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Ordered-items
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="orderedItems"
            :dependencies="{items,tables}"
            :headers="[{value:'id',text:'ID'},{value:'quantity',text:'Quantity'},{value:'itemId',text:'Item-Name'},{value:'tableId',text:'Table'},{value:'waiter',text:'Waiter'},{value:'comment',text:'Comment'}]"
            serviceConstructor="OrderedItem"
            :config="{id:{changeable:false},quantity:{changeable:true,type:'number'},itemId:{changeable:{key:'item',itemValue:'id',itemText:'id'}},tableId:{changeable:{key:'tables',itemValue:'id',itemText:'name'}},waiter:{changeable:true},comment:{changeable:true}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Ordered-items-have-additions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="orderedItemsHaveAdditions"
            :dependencies="{additions,orderedItems}"
            :headers="[{value:'id',text:'ID'},{value:'orderedItemId',text:'Ordered-Item-ID'},{value:'amount',text:'Amount'},{value:'additionId',text:'Addition'}]"
            serviceConstructor="OrderedItemHasAddition"
            :config="{id:{changeable:false},orderedItemId:{changeable:{key:'orderedItems',itemValue:'id',itemText:'id'}},amount:{changeable:true,type:'number'},additionId:{changeable:{key:'additions',itemValue:'id',itemText:'name'}}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Sizes
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="sizes"
            :dependencies="{}"
            :headers="[{value:'id',text:'ID'},{value:'name',text:'Name'}]"
            serviceConstructor="Size"
            :config="{id:{changeable:false},name:{changeable:true}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Tables
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="tables"
            :dependencies="{}"
            :headers="[{value:'id',text:'ID'},{value:'name',text:'Name'}]"
            serviceConstructor="Table"
            :config="{id:{changeable:false},name:{changeable:true}}"
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          ENV
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <service-table
            :items="env"
            :dependencies="{categories}"
            :headers="[{value:'id',text:'ID'},{value:'occasion',text:'Occasion'},{value:'disabledCategories',text:'Disabled categories'}]"
            serviceConstructor="Env"
            :config="{id:{changeable:false},occasion:{changeable:true},disabledCategories:{changeable:{key:'categories',itemValue:'id',itemText:'name',multiple:true}}}"
            no-new
            />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script>
import ServiceTable from '../components/configurator/serviceTable.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Configurator',
  components: {
    ServiceTable
  },
  data: () => ({
    newTable: null
  }),
  created: function () {
    let { Table } = this.$FeathersVuex.api
    this.newTable = new Table()
  },
  mounted: function () {
    this.setFetchPendingFlag().then(() => {
      let promises = []
      promises.push(this.fetchadditions())
      promises.push(this.fetchbaseItems())
      promises.push(this.fetchbaseItemsHaveAdditions())
      promises.push(this.fetchcategories())
      promises.push(this.fetchflavours())
      promises.push(this.fetchitems())
      promises.push(this.fetchorderedItems())
      promises.push(this.fetchorderedItemsHaveAdditions())
      promises.push(this.fetchsizes())
      promises.push(this.fetchtables())
      Promise.all(promises).then(() => {
        this.resetFetchPendingFlag()
      })
    })
  },
  methods: {
    ...mapActions('utilities', ['setFetchPendingFlag', 'resetFetchPendingFlag']),
    ...mapActions('additions', {
      fetchadditions: 'find'
    }),
    ...mapActions('base-items', {
      fetchbaseItems: 'find'
    }),
    ...mapActions('base-items-have-additions', {
      fetchbaseItemsHaveAdditions: 'find'
    }),
    ...mapActions('categories', {
      fetchcategories: 'find'
    }),
    ...mapActions('flavours', {
      fetchflavours: 'find'
    }),
    ...mapActions('items', {
      fetchitems: 'find'
    }),
    ...mapActions('ordered-items', {
      fetchorderedItems: 'find'
    }),
    ...mapActions('ordered-items-have-additions', {
      fetchorderedItemsHaveAdditions: 'find'
    }),
    ...mapActions('sizes', {
      fetchsizes: 'find'
    }),
    ...mapActions('tables', {
      fetchtables: 'find'
    }),
    ...mapActions('env', {
      fetchEnv: 'find'
    }),
    saveEntity: function ({ entityName, instanceName }) {
      this[entityName].save()
      let entityConstructor = this.$FeathersVuex.api[instanceName]
      this[entityName] = new entityConstructor()
    },
  },
  computed: {
    ...mapGetters('additions', {
      additions: 'list',
      getadditions: 'get'
    }),
    ...mapGetters('base-items', {
      baseItems: 'list',
      getbaseItems: 'get'
    }),
    ...mapGetters('base-items-have-additions', {
      baseItemsHaveAdditions: 'list',
      getbaseItemsHaveAdditions: 'get'
    }),
    ...mapGetters('categories', {
      categories: 'list',
      getcategories: 'get'
    }),
    ...mapGetters('flavours', {
      flavours: 'list',
      getflavours: 'get'
    }),
    ...mapGetters('items', {
      items: 'list',
      getitems: 'get'
    }),
    ...mapGetters('ordered-items', {
      orderedItems: 'list',
      getorderedItems: 'get'
    }),
    ...mapGetters('ordered-items-have-additions', {
      orderedItemsHaveAdditions: 'list',
      getorderedItemsHaveAdditions: 'get'
    }),
    ...mapGetters('sizes', {
      sizes: 'list',
      getsizes: 'get'
    }),
    ...mapGetters('tables', {
      tables: 'list',
      gettables: 'get'
    }),
    ...mapGetters('env', {
      env: 'list'
    })
  },
}
</script>