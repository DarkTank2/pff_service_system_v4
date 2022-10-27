<template>
  <div>
      <v-card>
          <v-card-title>
              <v-btn :to="{ name: 'Home' }" outlined>
                  <v-icon class="mr-2">chevron_left</v-icon>
                  zurück
              </v-btn>
          </v-card-title>
          <v-container>
              <single-category v-for="category in categories" :key="`single_category_${category.id}`" :category="category" />
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
            categories: 'list'
        }),
        itemHeight: function () {
            return `${(window.screen.width - 8) / 3}px`
        },
        itemStyle: function () {
            return `height: ${this.itemHeight};`
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