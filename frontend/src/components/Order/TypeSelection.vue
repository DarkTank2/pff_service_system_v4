<template>
  <div>
    <v-btn :to="{ name: 'TypeProxy', params: { typeId: 1 } }">ReRouting</v-btn>
  </div>
</template>
<script>
export default {
  name: 'TypeSelection',
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
