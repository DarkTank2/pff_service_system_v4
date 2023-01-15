<template>
  <v-container class="mt-5">
    <v-row justify="center">
      <KeybindingDialog />
    </v-row>
    <v-row justify="center" class="pt-4">
      <KeybindingTable />
    </v-row>
  </v-container>
</template>
<script>
import KeybindingDialog from '../components/Keybindings/Dialog.vue';
import KeybindingTable from '../components/Keybindings/Table.vue'
export default {
  name: 'Keybindings',
  props: [],
  components: {
    KeybindingDialog,
    KeybindingTable
  },
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
