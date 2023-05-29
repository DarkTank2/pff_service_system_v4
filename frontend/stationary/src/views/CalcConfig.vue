<template>
  <v-container class="pt-6">
    <v-row>
      <v-col cols="2">
        <v-btn color="primary" :to="{ name: 'Calculator' }" class="mt-auto mb-auto"><v-icon>calculate</v-icon>Zurück zur Oberfläche</v-btn>
      </v-col>
      <v-col cols="2">
        <v-text-field label="Der Name der Station" :value="name" @input="updateName"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-switch label="Dense Mode" v-model="denseMode"></v-switch>
      </v-col>
      <v-col cols="2">
        <QuickModeSwitch />
      </v-col>
      <v-col cols="2">
        <ImmediateOrderSwitch />
      </v-col>
    </v-row>
    <v-row v-for="category in itemStructure" :key="`row_category_${category.id}`">
      <v-col cols="12">
        <v-card style="border: thin solid;" class="rounded-pill" @click="updateDisplayedItems(category.baseItems.map(({ id }) => id))">
          <v-card-text class="text-center">
            {{category.name}}
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3" lg="1" v-for="baseItem in category.baseItems" :key="`col_base_item_${baseItem.id}`">
        <v-card class="item" :class="{ 'bordered': displayedItems.includes(baseItem.id) }" @click="updateDisplayedItems(baseItem.id)">
          <v-card-text class="text-center">
            <span>{{ baseItem.name }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import QuickModeSwitch from '../components/Calculator/QuickModeSwitch.vue'
import ImmediateOrderSwitch from '../components/Calculator/ImmediateOrderSwitch.vue'
export default {
  name: 'CalculatorConfig',
  props: [],
  components: {
    QuickModeSwitch,
    ImmediateOrderSwitch
  },
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
    ...mapMutations('config', {
      updateDisplayedItems: 'updateDisplayedItems',
      updateName: 'updateName',
      updateDenseMode: 'updateDenseMode'
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
    ...mapGetters('config', {
      displayedItems: 'displayedItems',
      name: 'name',
      storedDenseMode: 'denseMode'
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
    },
    denseMode: {
      get: function () {
        return this.storedDenseMode.value
      },
      set: function (newValue) {
        this.updateDenseMode({ value: newValue })
      }
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
