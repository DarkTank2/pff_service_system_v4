<template>
  <div>
    <v-card>
      <v-container v-if="displayedItems.length !== 0">
        <single-category v-for="category in shownCategories" :key="`calculator_single_category_${category.id}`"
          :category="category" />
      </v-container>
      <v-container v-else>
        <v-alert type="warning" outlined dense class="mt-4">
          Derzeit sind keine Items konfiguriert. Gehe in die Einstellugen und wähle Items aus!
        </v-alert>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import SingleCategory from '../components/Calculator/SingleCategory.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Calculator',
  components: { SingleCategory },
  props: [],
  data: () => ({
    dialog: false
  }),
  created: function () { },
  mounted: async function () {
    if (!this.env) {
      this.fetchEnv()
    }
    this.fetchCategories()
    this.fetchBaseItems()
    this.fetchSizes()
    this.fetchFlavours()
    this.fetchItems()
    this.fetchMaps()
    this.fetchAdditions()
    document.addEventListener('keyup', this.keyupCallback)
  },
  methods: {
    ...mapActions('env', {
      fetchEnv: 'find'
    }),
    ...mapActions('categories', {
      fetchCategories: 'find'
    }),
    ...mapActions('base-items', {
      fetchBaseItems: 'find'
    }),
    ...mapActions('sizes', {
      fetchSizes: 'find'
    }),
    ...mapActions('flavours', {
      fetchFlavours: 'find'
    }),
    ...mapActions('items', {
      fetchItems: 'find'
    }),
    ...mapActions('base-items-have-additions', {
      fetchMaps: 'find'
    }),
    ...mapActions('additions', {
      fetchAdditions: 'find'
    }),
    ...mapMutations('waiter', {
      addItemToOrder: 'addOrderedItem'
    }),
    ...mapActions('waiter', {
      quickCash: 'quickCash'
    }),
    keyupCallback: function (event) {
      let { key } = event
      if (key === 'Enter') {
        this.quickCash()
        return
      }
      let binding = this.keybindings.find(binding => binding.key === key)
      if (binding) {
        if (!this.displayedItems.includes(binding.itemId)) {
          console.log(`Item "${binding.itemId}" is registered to key "${key} but not displayed!"`)
          return
        }
        this.addItemToOrder({ itemId: binding.itemId, quantity: 1, comment: '', additions: [] })
      } else {
        console.log(`No binding found for key "${key}"`)
      }
    }
  },
  computed: {
    ...mapGetters('env', {
      listEnvs: 'list'
    }),
    ...mapGetters('categories', {
      findCategories: 'find'
    }),
    ...mapGetters('base-items', {
      findBaseItems: 'find'
    }),
    ...mapGetters('keybindings', {
      keybindings: 'keybindings'
    }),
    ...mapGetters('config', {
      displayedItems: 'displayedItems'
    }),
    shownCategories: function () {
      let displayedBaseItems = this.findBaseItems({ query: { id: { $in: this.displayedItems } } }).data
      let displayedCategories = this.findCategories({ query: { id: { $in: displayedBaseItems.map(({ categoryId }) => categoryId) } } }).data
      let displayedCategoriesIds = [...new Set(displayedCategories.map(({ id }) => id))]
      return this.findCategories({ query: { id: { $in: displayedCategoriesIds } } }).data
    }
  },
  watch: {},
  beforeDestroy: function () {
    console.log('Destroying')
    document.removeEventListener('keyup', this.keyupCallback)
  }
}
</script>

<style scoped>

</style>