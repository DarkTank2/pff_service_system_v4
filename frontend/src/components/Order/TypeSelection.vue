<template>
  <v-container fluid>
    <v-row style="padding: 20px;">
      <v-col cols="12">
        <v-card style="border: thin solid;" class="rounded-pill">
          <v-card-text class="text-center">Typen</v-card-text>
        </v-card>
      </v-col>
      <v-col v-for="type in modifiedTypes" :key="`type_${type.id}`" cols="4" style="padding: 2px;">
        <v-card :style="typeStyle" :color="type.color" :to="type.to" :disabled="type.disabled">
          <v-card-text class="text-center mx-auto">
            {{ `${type.name}` }}
            <br/>
            <span v-if="type.disabled">(nicht verfügbar)</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'TypeSelection',
  props: [],
  components: {},
  data () {
    return {}
  },
  created: function () {},
  mounted: function () {
    if (!this.env) {
      this.fetchEnv()
    }
    this.fetchTypes().then(() => {
      Promise.resolve().then(() => {this.checkForReroute()})
    })
  },
  methods: {
    ...mapActions('types', {
      fetchTypes: 'find'
    }),
    ...mapActions('env', {
      fetchEnv: 'find'
    }),
    checkForReroute: function () {
      let activeTypes = this.modifiedTypes.filter(({ disabled }) => !disabled)
      if (activeTypes.length === 1) {
        console.log(`Since there is only one possible type to select, automated rerouting is done to type "${activeTypes[0].name}"`)
        this.$router.push(activeTypes[0].to)
      }
    }
  },
  watch: {},
  computed: {
    ...mapGetters('types', {
      types: 'list'
    }),
    ...mapGetters('env', {
      listEnv: 'list'
    }),
    env: function () {
      return this.listEnv[0]
    },
    modifiedTypes: function () {
      return this.types.map(type => {
        let disabled = this.env.disabledTypes.includes(type.id)
        return {
          id: type.id,
          name: type.name,
          to: { name: 'CategoryView', params: { typeId: type.id } },
          color: disabled ? 'grey darken-2' : 'blue darken-3',
          disabled
        }
      })
    },
    typeHeight: function () {
      return `${(window.screen.width - 8) / 3}px`
    },
    typeStyle: function () {
      return `height: ${this.typeHeight};`
    },
  }
}
</script>
