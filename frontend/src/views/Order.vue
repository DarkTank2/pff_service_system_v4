<template>
  <v-card>
    <v-card-text>
      <v-breadcrumbs :items="items" divider=">" class="px-0 py-0">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :disabled="item.disabled">
            {{item.text}}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
      <router-view></router-view>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Order',
  data: () => ({
    
  }),
  created: function () {},
  methods: {},
  computed: {
    items: function () {
      return [{ to: 'Serve', text: 'Servieren', disabled: false }]
    }
  }
}
</script>

<style>

</style>