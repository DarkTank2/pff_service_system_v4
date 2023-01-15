<template>
  <v-dialog v-model="dialog" width="800px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        icon
        outlined
      >
        <v-icon>add</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Keybinding hinzufügen
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-text-field outlined disabled :value="key" label="Beliebige Taste drücken"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select :items="modifiedItems" item-value="id" item-text="displayName" v-model="selectedItem"></v-select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-btn
          text
          @click="close">
          Abbrechen
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="save"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'KeybindingDialog',
  props: [],
  components: {},
  data () {
    return {
      dialog: false,
      key: null,
      selectedItem: null
    }
  },
  created: function () {},
  mounted: function () {},
  methods: {
    ...mapMutations('keybindings', {
      updateKeybindings: 'updateKeybindings'
    }),
    keyupCallback: function (event) {
      let { key } = event
      if (key === 'Enter') {
        console.log('Enter preserved, cannot choose Enter!')
        return
      }
      this.key = key
    },
    save: function () {
      if (!this.key) {
        return
      }
      if (!this.selectedItem) {
        return
      }
      this.updateKeybindings({ key: this.key, itemId: this.selectedItem })
      this.close()
    },
    close: function () {
      this.selectedItem = null
      this.key = null
      this.dialog = false
    }
  },
  watch: {
    dialog: function (newVal) {
      if (newVal) {
        document.addEventListener('keyup', this.keyupCallback)
      } else {
        document.removeEventListener('keyup', this.keyupCallback)
      }
    }
  },
  computed: {
    ...mapGetters('items', {
      rawItems: 'list'
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
    modifiedItems: function () {
      return this.rawItems.map(item => {
        return {
          ...item,
          displayName: `${this.getSize(item.sizeId).name} ${this.getBaseItem(item.baseItemId).name}, ${this.getFlavour(item.flavourId).name}`
        }
      })
    }
  }
}
</script>
