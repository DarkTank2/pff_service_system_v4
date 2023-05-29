<template>
  <v-switch v-model="quickModeRef" label="Schneller Modus" class="mx-4"></v-switch>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'QuickModeSwitch',
  props: [],
  components: {},
  data () {
    return {
      quickModeRef: null
    }
  },
  methods: {
    ...mapMutations('config', {
      updateQuickMode: 'updateQuickMode'
    })
  },
  watch: {
    quickMode: {
      immediate: true,
      handler: function (newValue) {
        this.quickModeRef = newValue.quickMode
      }
    },
    quickModeRef: function (newValue) {
      if (newValue === null) {
        return
      }
      this.updateQuickMode({ quickMode: newValue })
    }
  },
  computed: {
    ...mapGetters('config', {
      quickMode: 'quickMode'
    })
  }
}
</script>

<style>

</style>