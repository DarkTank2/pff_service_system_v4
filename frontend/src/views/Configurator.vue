<template>
  <v-container fluid>
    <v-expansion-panels
      multiple
      >
      <v-expansion-panel>
        <v-expansion-panel-header>
          Additions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Base-items
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Base-items-have-additions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Categories
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Flavours
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Items
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Ordered-items
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Ordered-items-have-additions
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Sizes
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Tables
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-container fluid>
            <v-row v-for="table in tables" :key="`table_${table.id}`" class="mt-0">
              <v-col cols="3">
                <v-text-field v-model="table.name" dense></v-text-field>
              </v-col>
              <v-btn icon>
                <v-icon>save</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>clear</v-icon>
              </v-btn>
            </v-row>
            <v-row class="mt-0" v-if="newTable">
              <v-col cols="3">
                <v-text-field v-model="newTable.name" dense></v-text-field>
              </v-col>
              <v-btn icon @click="saveEntity({ entityName: 'newTable', instanceName: 'Table' })">
                <v-icon>save</v-icon>
              </v-btn>
            </v-row>
          </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Types
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'Configurator',
  data: () => ({
    newTable: null
  }),
  created: function () {
    let { Table } = this.$FeathersVuex.api
    this.newTable = new Table()
  },
  mounted: function () {
    this.fetchadditions()
    this.fetchbaseItems()
    this.fetchbaseItemsHaveAdditions()
    this.fetchcategories()
    this.fetchflavours()
    this.fetchitems()
    this.fetchorderedItems()
    this.fetchorderedItemsHaveAdditions()
    this.fetchsizes()
    this.fetchtables()
    this.fetchtypes()
  },
  methods: {
    ...mapActions('additions', {
      fetchadditions: 'find'
    }),
    ...mapActions('baseItems', {
      fetchbaseItems: 'find'
    }),
    ...mapActions('baseItemsHaveAdditions', {
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
    ...mapActions('orderedItems', {
      fetchorderedItems: 'find'
    }),
    ...mapActions('orderedItemsHaveAdditions', {
      fetchorderedItemsHaveAdditions: 'find'
    }),
    ...mapActions('sizes', {
      fetchsizes: 'find'
    }),
    ...mapActions('tables', {
      fetchtables: 'find'
    }),
    ...mapActions('types', {
      fetchtypes: 'find'
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
    ...mapGetters('baseItems', {
      baseItems: 'list',
      getbaseItems: 'get'
    }),
    ...mapGetters('baseItemsHaveAdditions', {
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
    ...mapGetters('orderedItems', {
      orderedItems: 'list',
      getorderedItems: 'get'
    }),
    ...mapGetters('orderedItemsHaveAdditions', {
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
    ...mapGetters('types', {
      types: 'list',
      gettypes: 'get'
    }),
  },
}
</script>