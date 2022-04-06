<template>
  <div>
    <v-btn :to="{ name: 'FlavourSelection', params: { baseItemId: 1 } }">ReRouting</v-btn>
  </div>
</template>
<script>
export default {
  name: 'BaseItemSelection',
  props: [],
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
