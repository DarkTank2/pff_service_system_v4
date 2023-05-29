<template>
  <div>
    <v-card>
      <v-container style="margin-bottom: 56px; padding-bottom: 70px;">
        <single-category v-for="category in shownCategories" :key="`single_category_${category.id}`" :category="category" />
      </v-container>
    </v-card>
  </div>
</template>

<script>
import SingleCategory from '../components/Order/SingleCategory.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'CategoryView',
    components: { SingleCategory },
    props: ['typeId'],
    data: () => ({ timer: null }),
    created: function () {},
    mounted: async function () {
        if (!this.env) {
            this.fetchEnv()
        }
        this.fetchAgain()
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
        scrollToCategory: function (id) {
            return id
        },
        fetchAgain: function () {
          let fetches = []
          fetches.push(this.fetchCategories())
          fetches.push(this.fetchBaseItems())
          fetches.push(this.fetchSizes())
          fetches.push(this.fetchFlavours())
          fetches.push(this.fetchItems())
          fetches.push(this.fetchMaps())
          fetches.push(this.fetchAdditions())
          Promise.all(fetches).then(() => {
            this.timer = setTimeout(this.fetchAgain, 10000)
          })
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
        ...mapGetters('config', {
          displayedItems: 'displayedItems'
        }),
        itemHeight: function () {
            return `${(window.screen.width - 8) / 3}px`
        },
        itemStyle: function () {
            return `height: ${this.itemHeight};`
        },
        categories: function () {
          return this.findCategories({ query: { inactive: { $ne: true } } }).data
        },
        shownCategories: function () {
          let displayedBaseItems = this.findBaseItems({ query: { id: { $in: this.displayedItems } } }).data
          let displayedCategories = this.findCategories({ query: { id: { $in: displayedBaseItems.map(({ categoryId }) => categoryId) } } }).data
          let displayedCategoriesIds = [...new Set(displayedCategories.map(({ id }) => id))]
          return this.findCategories({ query: { id: { $in: displayedCategoriesIds } } }).data
        }
    },
    watch: {},
    beforeDestroy: function () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    }
}
</script>

<style scoped>

</style>