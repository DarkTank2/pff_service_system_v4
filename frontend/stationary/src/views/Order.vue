<template>
  <!-- <v-card>
    <v-card-text>
      <- <v-breadcrumbs :items="items" divider=">" class="px-0 py-0">
        <template v-slot:item="{ item }">
          <v-breadcrumbs-item :to="item.to" :disabled="item.disabled" :exact="true">
            {{item.text}}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </v-card-text>
  </v-card> -->
  <router-view></router-view>
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
          if (acc.find(({ meta: { breadCrumbItem: { to: { name } }} }) => name === curr.meta.breadCrumbItem.to.name)) {
            acc.pop()
            acc.push(curr)
          } else {
            if (curr.meta.breadCrumbItem) {
              acc.push(curr)
            }
          }
          return acc
        }, [])
        .map(matchedObject => matchedObject.meta)
    },
    items: function () {
      return this.matchedMetaFields.map(meta => meta.breadCrumbItem)
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