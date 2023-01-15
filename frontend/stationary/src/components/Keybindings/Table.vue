<template>
  <v-data-table :headers="headers" :items="modifiedKeybindings" class="elevation-1">
    <template v-slot:[`item.action`]="{ item }">
      <v-btn icon @click="remove(item)">
        <v-icon>delete</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'KeybindingTable',
  props: [],
  components: {},
  data () {
    return {
      headers: [{ value: 'key', text: 'Key'}, { value: 'itemName', text: 'Item' }, { value: 'action', text: 'Action', sortable: false }]
    }
  },
  created: function () {},
  mounted: function () {},
  methods: {
    ...mapMutations('keybindings', {
      removeKeybinding: 'removeKeybinding'
    }),
    remove: function (item) {
      this.removeKeybinding(item)
    }
  },
  watch: {},
  computed: {
    ...mapGetters('keybindings', {
      keybindings: 'keybindings'
    }),
    ...mapGetters('items', {
      getItem: 'get'
    }),
    ...mapGetters('base-items', {
      getBaseItem: 'get'
    }),
    ...mapGetters('sizes', {
      getSize: 'get'
    }),
    ...mapGetters('flavours', {
      getFlavour: 'get'
    }),
    modifiedKeybindings: function () {
      return this.keybindings.map(binding => {
        let item = this.getItem(binding.itemId)
        if (!item) {
          return { ...binding, itemName: '<Empty>' }
        }
        return {
          ...binding,
          itemName: `${this.getSize(item.sizeId).name} ${this.getBaseItem(item.baseItemId).name}, ${this.getFlavour(item.flavourId).name}`
        }
      })
    }
  }
}
</script>
