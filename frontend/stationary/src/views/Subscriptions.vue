<template>
  <v-container class="pt-6">
    <v-row v-for="category in itemStructure" :key="`row_category_${category.id}`">
      <v-col cols="12">
        <v-card style="border: thin solid;" class="rounded-pill" @click="updateSubscription(category.baseItems.map(({ id }) => id))">
          <v-card-text class="text-center">
            {{category.name}}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="1" v-for="baseItem in category.baseItems" :key="`col_base_item_${baseItem.id}`">
        <v-card style="aspect-ratio: 1;" :class="{ 'bordered': subscriptions.includes(baseItem.id) }" @click="updateSubscription(baseItem.id)">
          <v-card-text class="text-center">
            <span>{{ baseItem.name }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn fab icon bottom right fixed elevation="2" outlined :to="{ name: 'Home' }">
      <v-icon>home</v-icon>
    </v-btn>
  </v-container>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'Subscriptions',
  props: [],
  components: {},
  data () {
    return {}
  },
  created: function () {},
  mounted: function () {
    this.fetchBaseItems()
    this.fetchCategories()
  },
  methods: {
    ...mapActions('base-items', {
      fetchBaseItems: 'find'
    }),
    ...mapActions('categories', {
      fetchCategories: 'find'
    }),
    ...mapMutations('subscriptions', {
      updateSubscription: 'updateSubscription',
      removeSubscription: 'removeSubscription'
    })
  },
  watch: {},
  computed: {
    ...mapGetters('base-items', {
      findBaseItems: 'find'
    }),
    ...mapGetters('categories', {
      listCategories: 'list'
    }),
    ...mapGetters('subscriptions', {
      subscriptions: 'subscriptions'
    }),
    itemStructure: function () {
      if (!this.listCategories) {
        return []
      }
      let structure = []
      this.listCategories.forEach(category => {
        structure.push({ ...category, baseItems: this.findBaseItems({ query: { categoryId: category.id } }).data })
      })
      return structure
    }
  }
}
</script>
<style scoped>
.bordered {
  border: thin solid;
  border-color: #928cff;
}
</style>
