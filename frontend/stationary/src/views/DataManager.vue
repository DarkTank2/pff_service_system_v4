<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <span>DataManager</span>
      </v-col>
    </v-row>
    <v-row style="position: relative;">
      <v-col style="position:absolute; left:0; top:0; z-index: 5;" class="base grow" id="drop_col">
        <v-carousel
          v-model="importModel"
          height="100%"
          :continuous="false"
          :cycle="false"
          :show-arrows="importModel !== 0"
          :hide-delimiters="importModel === 0">
          <v-carousel-item>
            <v-card width="100%" height="100%" id="drop_zone" @drop="dropHandler" style="display: flex; justify-content: center; align-items: center;">
              <div class="drop-zone">
                <svg style="position: absolute; top:0;left:0;height:100%;width:100%;" preserveAspectRatio="none" :viewBox="viewBox">
                  <path :d="path" :stroke="stroke" :stroke-width="strokeWidth" stroke-linecap="round" fill="transparent" />
                </svg>
                <v-icon v-if="errorMessage" size="100" :color="stroke">clear</v-icon>
                <span v-if="errorMessage" :style="{ color: stroke }">{{ errorMessage }}</span>
                <v-icon v-if="!file && !errorMessage" size="100" :color="stroke">upload</v-icon>
                <span v-if="!file && !errorMessage" :style="{ color: stroke }">Drag file here!</span>
                <div v-if="file && !errorMessage">
                  <v-progress-circular v-if="loadingFile" size="100" color="rgb(60, 60, 60)" indeterminate></v-progress-circular>
                  <v-badge v-else
                    bordered
                    icon="clear"
                    overlap
                    @click.native="removeFile"
                    >
                    <v-icon size="100" color="rgb(60, 60, 60)">file_download_done</v-icon>
                  </v-badge>
                </div>
                <span v-if="file && !errorMessage" :style="{ color: stroke }">{{ file.name }}</span>
              </div>
            </v-card>
          </v-carousel-item>
          <v-carousel-item>
            <v-card width="100%" height="100%" id="scroll_parent">
              <v-card-title>
                Assign columns
              </v-card-title>
              <v-card-text>
                <GridLayout
                :layout.sync="importLayoutHeader"
                :col-num="gridCols"
                :row-height="30"
                :is-draggable="true"
                :is-resizable="false"
                :use-css-transforms="true"
                >
                
                </GridLayout>
                <GridLayout
                :layout.sync="importLayoutData"
                :col-num="gridCols"
                :row-height="30"
                :is-draggable="false"
                :is-resizable="false"
                :use-css-transforms="true"
                >
                <GridItem v-for="item in importLayoutData"
                  :x="item.x"
                  :y="item.y"
                  :w="item.w"
                  :h="item.h"
                  :i="item.i"
                  :key="item.key">
                  <v-card style="height: 100%;">
                    <v-card-text class="text-center mx-auto">
                      <span class="text-h4">{{ item.data }}</span>
                    </v-card-text>
                  </v-card>
                </GridItem>
                </GridLayout>
              </v-card-text>
            </v-card>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col style="position:absolute; right:0; top:0;" class="base">
        <v-card height="100%" max-height="100%" style="overflow-y: scroll;">
          <v-card-title style="position: sticky; top: 0px; justify-content: center;">
            Export
          </v-card-title>
          <v-card-text style="margin-top: -48px;">
            <v-treeview
              v-model="selectedExport"
              selectable
              :items="exportStructure"
            ></v-treeview>
          </v-card-text>
        </v-card>
        <v-btn fab absolute elevation="24" style="bottom: 20px; right: 40px;" @click="exportData">.csv</v-btn>
        <v-icon size="100" :color="inactiveColor" style="position:absolute; left: calc(50% - 50px); top: calc(50% - 50px);">download</v-icon>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import { GridLayout, GridItem } from 'vue-grid-layout'
export default {
  name: 'DataManager',
  props: [],
  components: {
    GridLayout,
    GridItem
  },
  data () {
    return {
      result: null,
      selected: [],
      selectedExport: [],
      loadingFile: false,
      file: null,
      offset: 0,
      partitionLength: 50,
      dutyCycle: 1/3,
      svgWidth: 1600,
      svgHeight: 600,
      strokeWidth: 7,
      fileDragged: false,
      inactiveColor: 'rgb(60, 60, 60)',
      activeColor: 'rgb(34, 150, 243)',
      timer: null,
      timeoutMS: 5,
      importModel: null,
      errorMessage: null,
      exportConfig: [
        { columnName: 'Was', key: 'baseItem.name' },
        { columnName: 'Ausprägung', key: 'flavour.name' },
        { columnName: 'Bereich', key: null },
        { columnName: 'Wo', key: null },
        { columnName: 'Wer', key: null },
        { columnName: 'Einkauf', key: null },
        { columnName: 'Grösse', key: 'size.name' },
        { columnName: 'Verkaufspreis', key: 'item.price' },
        { columnName: 'Verbrauch', key: null },
        { columnName: 'Kategorie', key: 'category.name' },
        { columnName: 'Kommentar', key: null }
      ],
      gridCols: 12,
      importLayoutHeader: [],
      importLayoutData: []
    }
  },
  created: function () {
    this.fetchCategories()
    this.fetchBaseItems().then(items => {
      this.selectedExport = items.map(({ id }) => id)
    })
    this.fetchItems()
    this.fetchSizes()
    this.fetchFlavours()
  },
  mounted: function () {
    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(event => {
      document.body.addEventListener(event, (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
      })
    })
    this.initializeEventHandler()
  },
  methods: {
    ...mapActions('categories', {
      fetchCategories: 'find'
    }),
    ...mapActions('base-items', {
      fetchBaseItems: 'find'
    }),
    ...mapActions('items', {
      fetchItems: 'find'
    }),
    ...mapActions('sizes', {
      fetchSizes: 'find'
    }),
    ...mapActions('flavours', {
      fetchFlavours: 'find'
    }),
    dropHandler: function (event) {
      if (this.file) {
        this.raiseError('Cannot overwrite file!')
        return
      }
      this.fileDragged = false
      if (event.dataTransfer.files.length > 1) {
        this.raiseError('Too many files! First file is accepted!')
      }
      this.removeEventHandler()
      this.file = event.dataTransfer.files[0]
      this.result = null
      this.loadingFile = true
      let reader = new FileReader()
      reader.addEventListener('load', () => {
        this.result = reader.result.split('\n').filter(line => line.length > 1)
        this.selected = new Array(this.result.length).fill(0).map(() => true)
        this.setNewLineAsImportExample()
        this.loadingFile = false
        setTimeout(() => {
          this.importModel = 1
        }, 500)
        console.log(`File "${this.file.name}" finished loading`)
      })
      reader.readAsText(this.file)
    },
    setNewLineAsImportExample: function () {
      // not first (ceil) and not last (length - 1) one from the first third
      let randomLine = this.result[Math.ceil(Math.random()*((this.result.length)/3 - 1))]
      let columns = randomLine.split(';')
      this.gridCols = columns.length
      this.importLayoutData = columns.map((data, i) => {
        return {
          x: i,
          y: 0,
          w: 1,
          h: 1,
          i,
          key: `cell_${i}`,
          data
        }
      })
    },
    raiseError: function (message) {
      this.errorMessage = message
      setTimeout(() => {
        this.errorMessage = null
      }, 2000)
    },
    removeFile: function () {
      this.file = null
      this.result = null
      this.selected = []
      this.loading = false
      this.initializeEventHandler()
    },
    initializeEventHandler: function () {
      let activeElements = this.getActiveElements()
      activeElements.forEach(el => {
        el.addEventListener('dragenter', this.activeEventHandler)
      })
      let inactiveElements = this.getInactiveElements()
      inactiveElements.forEach(el => {
        el.addEventListener('dragenter', this.inactiveEventHandler)
      })
    },
    removeEventHandler: function () {
      let activeElements = this.getActiveElements()
      activeElements.forEach(el => {
        el.removeEventListener('dragenter', this.activeEventHandler)
      })
      let inactiveElements = this.getInactiveElements()
      inactiveElements.forEach(el => {
        el.removeEventListener('dragenter', this.inactiveEventHandler)
      })
    },
    getActiveElements: function () {
      return document.querySelectorAll('#drop_zone *, #drop_zone')
    },
    getInactiveElements: function () {
      return document.querySelectorAll('.v-main__wrap, #drop_col')
    },
    activeEventHandler: function (ev) {
      ev.preventDefault()
      ev.stopPropagation()
      this.fileDragged = true
    },
    inactiveEventHandler: function (ev) {
      ev.preventDefault()
      ev.stopPropagation()
      this.fileDragged = false
    },
    exportData: function () {
      let items = this.findItems({ query: { baseItemId: { $in: this.selectedExport } } }).data
      let data = []
      items.map(({ baseItemId, flavourId, sizeId, price }) => {
        let baseItem = this.getBaseItem(baseItemId)
        let category = this.getCategory(baseItem.categoryId)
        let size = this.getSize(sizeId)
        let flavour = this.getFlavour(flavourId)
        return {
          item: { price },
          category,
          baseItem,
          size,
          flavour
        }
      }).forEach(item => {
        let line = []
        this.exportConfig.forEach(({ key }) => {
          if (key) {
            let [property, value] = key.split('.')
            line.push(`${item[property][value]}`)
          } else {
            line.push('')
          }
        })
        data.push(line.join(';'))
      })
      data.unshift(this.exportConfig.map(({ columnName }) => columnName).join(';'))
      let csvContent = 'data:text/csv;charset=utf-8,' + data.join('\r\n')
      let encodedUri = encodeURI(csvContent)
      let link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', 'export.csv')
      document.body.appendChild(link)

      link.click()
      link.remove()
    }
  },
  watch: {
    fileDragged: function (newVal) {
      if (newVal && !this.timer) {
        this.timer = setInterval(() => {
          this.offset++
          this.offset = this.offset % this.partitionLength
        }, this.timeoutMS)
      }
      if (!newVal && this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    }
  },
  computed: {
    ...mapGetters('categories', {
      listCategories: 'list',
      getCategory: 'get'
    }),
    ...mapGetters('base-items', {
      findBaseItems: 'find',
      getBaseItem: 'get'
    }),
    ...mapGetters('items', {
      findItems: 'find'
    }),
    ...mapGetters('sizes', {
      getSize: 'get'
    }),
    ...mapGetters('flavours', {
      getFlavour: 'get'
    }),
    viewBox: function () {
      // return `-${this.strokeWidth} -${this.strokeWidth} ${this.svgWidth + 2*this.strokeWidth} ${this.svgHeight + 2*this.strokeWidth}`
      return `0 0 ${this.svgWidth} ${this.svgHeight}`
    },
    path: function () {
      let circumference = 2 * this.svgWidth + 2 * this.svgHeight
      let amountDashes = Math.ceil(circumference / this.partitionLength)
      let dashes = Array(amountDashes).fill(0).map(() => {
        return {
          m: {
            x: (1 - this.dutyCycle) * this.partitionLength,
            y: 0
          },
          l: {
            x: this.dutyCycle * this.partitionLength,
            y: 0
          }
        }
      })
      let cornerIndexes = [
        Math.ceil((this.svgWidth - this.offset) / this.partitionLength),
        Math.ceil((this.svgWidth + this.svgHeight - this.offset) / this.partitionLength),
        Math.ceil((2 * this.svgWidth + this.svgHeight - this.offset) / this.partitionLength)
      ]
      dashes.forEach((dash, i) => {
        if (0 <= i && i < cornerIndexes[0]) {
          // do nothing
        } else if (cornerIndexes[0] <= i && i < cornerIndexes[1]) {
          // turn right -> switch x and y
          dash.m.y = dash.m.x
          dash.m.x = 0
          dash.l.y = dash.l.x
          dash.l.x = 0
        } else if (cornerIndexes[1] <= i && i < cornerIndexes[2]) {
          dash.m.x = -1 * dash.m.x
          dash.l.x = -1 * dash.l.x
        } else {
          dash.m.y = -1 * dash.m.x
          dash.m.x = 0
          dash.l.y = -1 * dash.l.x
          dash.l.x = 0
        }
      })
      let partitionStart = 0
      let dashEnd = 0
      let partitionEnd = 0
      partitionStart = this.offset + (cornerIndexes[0] - 1) * this.partitionLength
      dashEnd = partitionStart + this.dutyCycle * this.partitionLength
      partitionEnd = partitionStart + this.partitionLength
      dashes[cornerIndexes[0] - 1].interceptor = {
        mb: {
          x: this.svgWidth - partitionEnd,
          y: 0
        },
        l: {
          x: 0,
          y: Math.max(0, dashEnd - this.svgWidth)
        },
        m: {
          x: 0,
          y: partitionEnd - Math.max(dashEnd, this.svgWidth)
        }
      }
      partitionStart = this.offset + (cornerIndexes[1] - 1) * this.partitionLength
      dashEnd = partitionStart + this.dutyCycle * this.partitionLength
      partitionEnd = partitionStart + this.partitionLength
      dashes[cornerIndexes[1] - 1].interceptor = {
        mb: {
          x: 0,
          y: (this.svgWidth + this.svgHeight) - partitionEnd
        },
        l: {
          x: -1 * Math.max(0, dashEnd - (this.svgWidth + this.svgHeight)),
          y: 0
        },
        m: {
          x: Math.max(dashEnd, this.svgWidth + this.svgHeight) - partitionEnd,
          y: 0
        }
      }
      partitionStart = this.offset + (cornerIndexes[2] - 1) * this.partitionLength
      dashEnd = partitionStart + this.dutyCycle * this.partitionLength
      partitionEnd = partitionStart + this.partitionLength
      dashes[cornerIndexes[2] - 1].interceptor = {
        mb: {
          x: partitionEnd - (this.svgWidth*2 + this.svgHeight),
          y: 0
        },
        l: {
          x: 0,
          y: -1 * Math.max(0, dashEnd - (this.svgWidth*2 + this.svgHeight))
        },
        m: {
          x: 0,
          y: Math.max(dashEnd, this.svgWidth*2 + this.svgHeight) - partitionEnd
        }
      }
      partitionStart = this.offset + (dashes.length - 1) * this.partitionLength
      dashEnd = partitionStart + this.dutyCycle * this.partitionLength
      partitionEnd = partitionStart + this.partitionLength
      dashes[dashes.length - 1].interceptor = {
        mb: {
          x: 0,
          y: partitionEnd - circumference
        },
        l: {
          x: Math.max(0, dashEnd - circumference),
          y: 0
        },
        m: {
          x: partitionEnd - Math.max(dashEnd, circumference),
          y: 0
        }
      }
      return `M${this.offset},0` + dashes.map(({ l, m, interceptor }) => {
        let data = `l${l.x},${l.y}m${m.x},${m.y}`
        if (interceptor) {
          data += `m${interceptor.mb.x},${interceptor.mb.y}l${interceptor.l.x},${interceptor.l.y}m${interceptor.m.x},${interceptor.m.y}`
        }
        return data
      }).join('')
    },
    stroke: function () {
      return this.fileDragged ? this.activeColor : this.inactiveColor
    },
    exportStructure: function () {
      return this.listCategories.map(category => {
        return {
          name: category.name,
          id: `category_${category.id}`,
          children: this.findBaseItems({ query: { categoryId: category.id } }).data.map(({ id, name }) => {
            return { id, name }
          })
        }
      }).sort(({ categoryId: A }, { categoryId: B }) => A < B)
    }
  }
}
</script>
<style scoped>
.drop-zone {
  height: 97%;
  width: 97%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
	z-index: 0;
	border-radius: 10px;
	overflow: hidden;
	padding: 2rem;
}

.grow:hover, grow-class {
  animation-name: growing;
  animation-duration: 1s;
  animation-direction: normal;
  animation-fill-mode: forwards;
  z-index: 1;
}
@keyframes growing {
  to {
    width: 100%;
    height: 80vh;
    box-shadow: 0 0 80px 80px rgba(0, 0, 0, 0.4);
    padding: 0 0;
  }
}

.base {
  width: 50%;
  height: 300px;
  box-shadow: 0 0 0px 0px rgba(0, 0, 0, 0.4);
}

</style>