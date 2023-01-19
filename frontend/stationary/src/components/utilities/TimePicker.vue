<template>
  <v-menu ref="dialog" v-model="menu" :close-on-content-click="false" :max-width="350">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field :label="label" :value="time" v-bind="attrs" v-on="on" prepend-icon="timer" hide-details
        readonly dense @click="initializeTime" append-icon="clear" @click:append="clearInput"></v-text-field>
    </template>
    <v-card>
      <v-time-picker v-model="time" format="24hr" :min="minTime"
          :max="maxTime" />
    </v-card>
  </v-menu>
</template>
<script>
import moment from 'moment';

export default {
  name: 'TimePicker',
  props: {
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: 'Timepicker'
    },
    minTime: {
      type: String,
      default: '00:00'
    },
    maxTime: {
      type: String,
      default: '23:59'
    }
  },
  components: {},
  data() {
    return {
      menu: null,
      displayedTime: null,
      time: null
    }
  },
  created: function () { },
  mounted: function () { },
  methods: {
    clearInput: function () {
      this.time = null
    },
    initializeTime: function () {
      if (this.time) {
        return
      }
      this.time = moment().format('HH:mm')
    }
  },
  watch: {
    value: { 
      handler: function (newVal) {
        if (!newVal) {
          return
        }
        this.time = newVal
      },
      immediate: true
    },
    time: function (newVal) {
      this.$emit('input', newVal)
    }
  },
  computed: {}
}
</script>
