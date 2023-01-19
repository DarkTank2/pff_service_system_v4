<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-expansion-panels :value="0">
          <v-expansion-panel>
            <v-expansion-panel-header>
              Filters
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row class="my-4">
                <v-col cols="4">
                  <v-select label="Stationsname" v-model="selectedStation" :items="stations" outlined
                    hide-details></v-select>
                </v-col>
                <v-col cols="4">
                  <v-select label="Kategorien" v-model="selectedCategories" :items="categories" outlined
                    item-text="name" item-value="id" multiple hide-details>
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index < 1">
                        <span>{{ item.name }}</span>
                      </v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ selectedCategories.length - 1 }} andere)
                      </span>
                    </template></v-select>
                </v-col>
                <v-col cols="4">
                  <v-select label="Items" multiple v-model="selectedItems" :items="modifiedItems" item-text="name"
                    item-value="id" outlined hide-details>
                    <template v-slot:selection="{ item, index }">
                      <v-chip v-if="index < 1">
                        <span>{{ item.name }}</span>
                      </v-chip>
                      <span v-if="index === 1" class="grey--text text-caption">
                        (+{{ selectedItems.length - 1 }} andere)
                      </span>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-row class="my-4">
                <v-col cols="3">
                  <DatePicker label="Start-Datum" v-model="startDate" />
                </v-col>
                <v-col cols="3">
                  <TimePicker label="Start-Zeit" v-model="startTime" />
                </v-col>
                <v-divider vertical></v-divider>
                <v-col cols="3">
                  <DatePicker label="End-Datum" v-model="endDate" />
                </v-col>
                <v-col cols="3">
                  <TimePicker label="End-Zeit" v-model="endTime" />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
      <v-col cols="12">
        <LineChartGenerator :chart-options="chartOptions" :chart-data="clusteredOrderedItems" dataset-id-key="label"
          :width="500" :plugins="[]" :css-classes="''" :styles="{}" :chart-id="'LineChart'" :height="400" />
      </v-col>
    </v-row>
    <v-speed-dial v-model="fab" direction="top" open-on-hover transition="slide-y-reverse-transition" elevation="2"
      bottom right fixed style="right: 45px; bottom: 55px;">
      <template v-slot:activator>
        <v-btn v-model="fab" fab fixed bottom right>
          <v-icon v-if="fab">
            close
          </v-icon>
          <v-icon v-else>
            download
          </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" @click="exportJson">
        {}
      </v-btn>
      <v-btn fab dark small color="indigo" @click="exportCsv">
        .csv
      </v-btn>
    </v-speed-dial>
  </v-container>
</template>
<script>
import TimePicker from '../components/utilities/TimePicker.vue'
import DatePicker from '../components/utilities/DatePicker.vue'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import { Line as LineChartGenerator } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement
)

export default {
  name: 'Statistics',
  props: [],
  components: {
    LineChartGenerator,
    TimePicker,
    DatePicker
  },
  data() {
    return {
      selectedStation: null,
      selectedCategories: [],
      selectedItems: [],
      timeFrameStart: null,
      timeFrameEnd: null,
      colors: [
        '#4dc9f6',
        '#f67019',
        '#f53794',
        '#537bc4',
        '#acc236',
        '#166a8f',
        '#00a950',
        '#58595b',
        '#8549ba'
      ],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      fab: null
    }
  },
  created: function () { },
  mounted: function () {
    Promise.all([this.fetchBaseItems(),
    this.fetchSizes(),
    this.fetchFlavours()]).then(() => {
      this.fetchItems()
    })
    this.fetchOrderedItems()
    this.fetchCategories()
  },
  methods: {
    ...mapActions('base-items', {
      fetchBaseItems: 'find'
    }),
    ...mapActions('items', {
      fetchItems: 'find'
    }),
    ...mapActions('ordered-items', {
      fetchOrderedItems: 'find'
    }),
    ...mapActions('categories', {
      fetchCategories: 'find'
    }),
    ...mapActions('sizes', {
      fetchSizes: 'find'
    }),
    ...mapActions('flavours', {
      fetchFlavours: 'find'
    }),
    addItemsByCategory: function (categoryId) {
      let baseItems = this.findBaseItems({ query: { categoryId } }).data
      let items = this.findItems({ query: { baseItemId: { $in: baseItems.map(({ id }) => id) } } }).data
      this.selectedItems = [...new Set([...this.selectedItems, ...items.map(({ id }) => id)])]
    },
    removeItemsByCategory: function (categoryId) {
      let baseItems = this.findBaseItems({ query: { categoryId } }).data
      let items = this.findItems({ query: { baseItemId: { $in: baseItems.map(({ id }) => id) } } }).data
      this.selectedItems = [...this.selectedItems.filter(itemId => !items.map(({ id }) => id).includes(itemId))]
    },
    downloadFile: function (filename = '', content = '') {
      let element = document.createElement('a')
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
      element.setAttribute('download', filename)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    },
    exportJson: function () {
      if (!this.startDate || !this.startTime || !this.endDate || !this.endTime) {
        return
      }
      let startTimestamp = moment(`${this.startDate}T${this.startTime}`)
      let endTimestamp = moment(`${this.endDate}T${this.endTime}`)
      let hourDifference = Math.ceil(endTimestamp.diff(startTimestamp, 'hours'))
      endTimestamp = moment(startTimestamp).add(hourDifference, 'hours')
      let data = this.filteredOrderedItems
        .filter(({ createdAt }) => {
          let created = moment.utc(createdAt)
          return created.isBetween(startTimestamp, endTimestamp, null, '[]')
        })
        .map(orderedItem => {
          let item = this.getItem(orderedItem.itemId)
          return {
            ...orderedItem,
            name: `${this.getSize(item.sizeId).name} ${this.getBaseItem(item.baseItemId).name}, ${this.getFlavour(item.flavourId).name}`
          }
        })
      if (data.length === 0) {
        console.log('Nothing to download!')
        return
      }
      let stringifiedData = JSON.stringify(data)
      this.downloadFile(`${startTimestamp.format()}_${endTimestamp.format()}_${this.selectedStation}.json`, stringifiedData)
    },
    exportCsv: function () {
      if (!this.startDate || !this.startTime || !this.endDate || !this.endTime) {
        return
      }
      let startTimestamp = moment(`${this.startDate}T${this.startTime}`)
      let endTimestamp = moment(`${this.endDate}T${this.endTime}`)
      let hourDifference = Math.ceil(endTimestamp.diff(startTimestamp, 'hours'))
      endTimestamp = moment(startTimestamp).add(hourDifference, 'hours')
      let data = this.filteredOrderedItems
        .filter(({ createdAt }) => {
          let created = moment.utc(createdAt)
          return created.isBetween(startTimestamp, endTimestamp, null, '[]')
        })
        .map(orderedItem => {
          let item = this.getItem(orderedItem.itemId)
          return {
            ...orderedItem,
            name: `${this.getSize(item.sizeId).name} ${this.getBaseItem(item.baseItemId).name}, ${this.getFlavour(item.flavourId).name}`
          }
        })
      if (data.length === 0) {
        console.log('Nothing to download!')
        return
      }
      let csvContentArray = ['Date;Time;Quantity;Item;Price;', ...data.map(({ createdAt, itemId, quantity }) => {
        let item = this.getItem(itemId)
        let itemName = `${this.getSize(item.sizeId).name} ${this.getBaseItem(item.baseItemId).name}, ${this.getFlavour(item.flavourId).name}`
        return `${moment(createdAt).format('YYYY-MM-DD')};${moment(createdAt).format('HH:mm:ss')};${quantity};${itemName};${item.price};`
      }), '']
      this.downloadFile(`${startTimestamp.format()}_${endTimestamp.format()}_${this.selectedStation}.csv`, csvContentArray.join('\r\n'))
    }
  },
  watch: {
    selectedCategories: {
      deep: true,
      handler: function (newVal = [], oldVal = []) {
        let addedCategories = newVal.filter(id => !oldVal.includes(id))
        let removedCategories = oldVal.filter(id => !newVal.includes(id))
        addedCategories.forEach(categoryId => this.addItemsByCategory(categoryId))
        removedCategories.forEach(categoryId => this.removeItemsByCategory(categoryId))
      }
    }
  },
  computed: {
    ...mapGetters('base-items', {
      baseItems: 'list',
      getBaseItem: 'get',
      findBaseItems: 'find'
    }),
    ...mapGetters('items', {
      allItems: 'list',
      findItems: 'find',
      getItem: 'get'
    }),
    ...mapGetters('ordered-items', {
      findOrderedItems: 'find'
    }),
    ...mapGetters('categories', {
      categories: 'list'
    }),
    ...mapGetters('sizes', {
      getSize: 'get'
    }),
    ...mapGetters('flavours', {
      getFlavour: 'get'
    }),
    orderedItems: function () {
      return this.findOrderedItems({ query: { finished: true } }).data
    },
    stations: function () {
      return [...new Set(this.orderedItems.map(({ waiter }) => waiter))]
    },
    modifiedItems: function () {
      return this.allItems.map(({ sizeId, flavourId, baseItemId, id }) => {
        return {
          id,
          name: `${this.getSize(sizeId).name} ${this.getBaseItem(baseItemId).name}, ${this.getFlavour(flavourId).name}`
        }
      })
    },
    filteredOrderedItems: function () {
      return this.findOrderedItems({ query: { waiter: this.selectedStation, itemId: { $in: this.selectedItems } } }).data
    },
    clusteredOrderedItems: function () {
      if (!this.startDate || !this.startTime || !this.endDate || !this.endTime) {
        return { labels: [], datasets: [] }
      }
      let startTimestamp = moment(`${this.startDate}T${this.startTime}`)
      let endTimestamp = moment(`${this.endDate}T${this.endTime}`)
      let hourDifference = Math.ceil(endTimestamp.diff(startTimestamp, 'hours'))
      let timeFrames = Array(Math.abs(hourDifference + 1)).fill(0).map(() => {
        let start = startTimestamp.format()
        let end = startTimestamp.add(1, 'hour').format()
        return { start, end }
      })
      let labels = timeFrames.map(({ start, end }) => {
        return `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`
      })
      let datasets = []
      this.selectedItems.forEach((itemId, index) => {
        let item = this.getItem(itemId)
        let label = `${this.getSize(item.sizeId).name} ${this.getBaseItem(item.baseItemId).name}, ${this.getFlavour(item.flavourId).name}`
        let backgroundColor = this.colors[index % this.colors.length]
        let borderColor = this.colors[index % this.colors.length]
        let data = timeFrames.map(({ start, end }) => {
          return this.filteredOrderedItems
            .filter(({ itemId: oiId }) => oiId === itemId)
            .filter(({ createdAt }) => {
              let created = moment.utc(createdAt)
              return created.isBetween(moment(start), moment(end), null, '(]')
            })
            .map(({ quantity }) => quantity)
            .reduce((acc, val) => acc + val, 0)
        })
        let pointRadius = 5
        let pointHoverRadius = 17
        datasets.push({ label, backgroundColor, borderColor, data, pointRadius, pointHoverRadius })
      })
      return { labels, datasets }
    }
  }
}
</script>
