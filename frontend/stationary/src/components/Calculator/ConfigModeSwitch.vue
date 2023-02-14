<template>
  <v-switch v-model="configModeRef" label="ConfigMode" class="mx-4"></v-switch>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ConfigModeSwitch',
  props: [],
  components: {},
  data () {
    return {
      configModeRef: null
    }
  },
  methods: {
    ...mapMutations('config', {
      updateConfigMode: 'updateConfigMode'
    })
  },
  watch: {
    configMode: {
      immediate: true,
      handler: function (newValue) {
        this.configModeRef = newValue.value
      }
    },
    configModeRef: function (newValue) {
      if (newValue === null) {
        return
      }
      this.updateConfigMode({ value: newValue })
    }
  },
  computed: {
    ...mapGetters('config', {
      configMode: 'configMode'
    })
  }
}
</script>

<style>

</style>