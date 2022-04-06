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
    matchedMetaFields: function () {
      return this.$route.matched.reduce((acc, curr) => {
          if (acc.find(({ meta: { to: { name } } }) => name === curr.meta.to.name)) {
            acc.pop()
            acc.push(curr)
          } else {
            acc.push(curr)
          }
          return acc
        }, [])
        .map(matchedObject => matchedObject.meta)
    },
    items: function () {
      return [{ to: { name: 'Serve' }, text: 'Servieren', disabled: false }]
    },
    router: function () {
      return this.$router
    },
    route: function () {
      return this.$route
    }
  }
}
</script>

<style>

</style>