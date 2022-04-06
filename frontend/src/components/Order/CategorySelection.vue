<template>
  <div>
    <v-btn :to="{ name: 'BaseItemSelection', params: { categoryId: 1 } }">ReRouting</v-btn>
  </div>
</template>
<script>
export default {
  name: 'CategorySelection',
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
