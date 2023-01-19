<template>
  <v-menu ref="dialog" v-model="menu" :close-on-content-click="false" :max-width="350">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field :label="label" :value="displayedDate" v-bind="attrs" v-on="on" prepend-icon="event" hide-details
        readonly dense @click="initializeDate" append-icon="clear" @click:append="clearInput"></v-text-field>
    </template>
    <v-card>
      <v-date-picker v-model="date" format="24hr" :min="minDate"
          :max="maxDate" />
    </v-card>
  </v-menu>
</template>
<script>
import moment from 'moment';

export default {
  name: 'DatePicker',
  props: {
    value: {
      type: String,
      default: null
    },
    label: {
      type: String,
      default: 'Datepicker'
    },
    minDate: {
      type: String,
      default: undefined
    },
    maxDate: {
      type: String,
      default: undefined
    }
  },
  components: {},
  data() {
    return {
      menu: null,
      displayedDate: null,
      date: null
    }
  },
  created: function () { },
  mounted: function () { },
  methods: {
    clearInput: function () {
      this.date = null
    },
    initializeDate: function () {
      if (this.date) {
        return
      }
      this.date = moment().format('YYYY-MM-DD')
    }
  },
  watch: {
    value: { 
      handler: function (newVal) {
        if (!newVal) {
          return
        }
        this.date = newVal
      },
      immediate: true
    },
    date: function (newVal) {
      if (newVal) {
        this.displayedDate = moment(newVal).format('DD. MMM')
      } else {
        this.displayedDate = null
      }
      this.$emit('input', newVal)
    }
  },
  computed: {}
}
</script>
