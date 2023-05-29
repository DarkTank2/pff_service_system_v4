<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="5">
        <History :device-name="name" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import History from '@components/History.vue'
export default {
  name: 'HistoryView',
  props: [],
  components: {
    History
  },
  data () {
    return {}
  },
  created: function () {},
  mounted: function () {},
  methods: {},
  watch: {},
  computed: {
    ...mapGetters('config', {
      name: 'name'
    }),
  }
}
</script>
