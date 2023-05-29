<template>
  <v-switch v-model="modeRef" label="Bestellung sofort abschließen" class="mx-4"></v-switch>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ImmediateOrderSwitch',
  props: [],
  components: {},
  data () {
    return {
      modeRef: null
    }
  },
  methods: {
    ...mapMutations('config', {
      updateImmediateOrderMode: 'updateImmediateOrderMode'
    })
  },
  watch: {
    immediateOrderMode: {
      immediate: true,
      handler: function (newValue) {
        this.modeRef = newValue?.value
      }
    },
    modeRef: function (newValue) {
      if (newValue === null) {
        return
      }
      this.updateImmediateOrderMode({ value: newValue })
    }
  },
  computed: {
    ...mapGetters('config', {
      immediateOrderMode: 'immediateOrderMode'
    })
  }
}
</script>

<style>

</style>