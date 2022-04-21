<template>
  <div>
      <v-card>
          <v-container>
              <single-category v-for="category in rawCategories" :key="`single_category_${category.id}`" :category="category" />
              <!-- <v-row style="padding: 20px;">
                  <v-col v-for="n in 100" :key="`col_${n}`" cols="4" style="padding: 2px;">
                      <v-card :style="itemStyle" color="blue darken-3">
                          <v-card-text class="text-center my-auto">
                              {{n}}
                          </v-card-text>
                      </v-card>
                  </v-col>
              </v-row> -->
          </v-container>
      </v-card>
  </div>
</template>

<script>
import SingleCategory from './components/SingleCategory.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'CategoryView',
    components: { SingleCategory },
    props: ['typeId'],
    data: () => ({}),
    created: function () {},
    mounted: async function () {
        if (!this.env) {
            this.fetchEnv()
        }
        this.fetchCategories(this.categoryQuery)
        this.fetchBaseItems()
        this.fetchSizes()
        this.fetchFlavours()
        this.fetchItems()
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
        scrollToCategory: function (id) {
            return id
        }
    },
    computed: {
        ...mapGetters('env', {
            listEnvs: 'list'
        }),
        ...mapGetters('categories', {
            findCategories: 'find'
        }),
        env: function () {
            return this.listEnvs[0]
        },
        categoryQuery: function () {
            return {
                query: {
                    typeId: this.typeId,
                    id: { $nin: this.env?.disableCategories || [] }
                }
            }
        },
        rawCategories: function () {
            return this.findCategories(this.categoryQuery).data
        },
        activeCategoryId: function () {
            return 1
        },
        itemHeight: function () {
            return `${(window.screen.width - 8) / 3}px`
        },
        itemStyle: function () {
            return `height: ${this.itemHeight};`
        }
    },
    watch: {}
}
</script>

<style>

</style>