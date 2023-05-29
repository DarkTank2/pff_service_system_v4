<template>
  <v-list-group :value="true" append-icon="">
    <template v-slot:activator>
      <v-list-item-title>{{ order[0].createdAt }}</v-list-item-title>
    </template>
    <v-list-item v-for="orderedItem in order" :key="`history_ordered_item_${orderedItem.id}`">
      <v-list-item-icon>
        {{ `${orderedItem.quantity} x ` }}
      </v-list-item-icon>
      <v-list-item-title>
        {{ orderedItem.displayName }}
      </v-list-item-title>
    </v-list-item>
  </v-list-group>
</template>
<script>
export default {
  name: 'Order',
  props: {
    order: {
      default: () => [],
      type: Array
    }
  },
  components: {},
  data () {
    return {}
  },
  created: function () {},
  mounted: function () {},
  methods: {},
  watch: {},
  computed: {}
}
</script>
