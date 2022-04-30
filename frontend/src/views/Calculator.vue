<template>
  <div>
      <v-card>
          <v-card-title>
              <v-btn :to="{ name: 'Home' }" outlined disabled>
                  <v-icon class="mr-2">chevron_left</v-icon>
                  bestellung ansehen
              </v-btn>
              <v-btn>bestellung abschließen</v-btn>
              <v-btn>zurücksetzen</v-btn>
          </v-card-title>
          <v-container>
              <single-category v-for="category in categories" :key="`calculator_single_category_${category.id}`" :category="category" />
          </v-container>
      </v-card>
  </div>
</template>

<script>
import SingleCategory from '../components/Calculator/SingleCategory.vue'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'Calculator',
    components: { SingleCategory },
    props: [],
    data: () => ({}),
    created: function () {},
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
        }
    },
    computed: {
        ...mapGetters('env', {
            listEnvs: 'list'
        }),
        ...mapGetters('categories', {
            categories: 'list'
        })
    },
    watch: {}
}
</script>

<style scoped>

</style>