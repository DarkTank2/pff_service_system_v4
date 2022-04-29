<template>
    <v-btn outlined @click="removeAll">
        <v-icon>restart_alt</v-icon>
        Productive Swipe
    </v-btn>
    
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'ConfiguratorAppBarComponent',
    methods: {
        ...mapActions('ordered-items-have-additions', {
            fetchMaps: 'find',
            removeMap: 'remove'
        }),
        ...mapActions('ordered-items', {
            fetchOrderedItems: 'find',
            removeOrderedItem: 'remove'
        }),
        removeAll: function () {
            this.fetchMaps().then(maps => {
                let promises = []
                maps.forEach(map => {
                    promises.push(this.removeMap(map.id))
                })
                Promise.all(promises).then(() => {
                    this.fetchOrderedItems().then(orderedItems => {
                        // let promises = []
                        orderedItems.forEach(orderedItem => {
                            // promises.push(this.removeOrderedItem(orderedItem.id))
                            this.removeOrderedItem(orderedItem.id)
                        })
                    })
                })
            })
            let exp = []
            exp.push(this.exportService('types', 'types'))
            exp.push(this.exportService('categories', 'categories'))
            exp.push(this.exportService('baseItems', 'base_items'))
            exp.push(this.exportService('sizes', 'sizes'))
            exp.push(this.exportService('flavours', 'flavours'))
            exp.push(this.exportService('items', 'items'))
            exp.push(this.exportService('additions', 'additions'))
            exp.push(this.exportService('baseItemsHaveAdditions', 'base_items_have_additions'))
            exp.push(this.exportService('tables', 'tables'))
            let dataStr = JSON.stringify(exp)
            let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

            let exportFileDefaultName = 'seed.json'

            let linkElement = document.createElement('a')
            linkElement.setAttribute('href', dataUri)
            linkElement.setAttribute('download', exportFileDefaultName)
            linkElement.click()
        },
        exportService: function (listGetter, tableName, removeProperties = []) {
            let data = []
            let expObj = {
                tableName,
                data
            }
            this[listGetter].forEach(item => {
                let i = {}
                data.push(i)
                Object.keys(item).forEach(prop => {
                    if (!removeProperties.includes(prop)) {
                        i[prop] = item[prop]
                    }
                })
            })
            return expObj
        }
    },
    computed: {
        ...mapGetters('ordered-items-have-additions', {
            listMaps: 'list'
        }),
        ...mapGetters('ordered-items', {
            listOrderedItems: 'list'
        }),
        ...mapGetters('additions', {
            additions: 'list'
        }),
        ...mapGetters('base-items', {
            baseItems: 'list'
        }),
        ...mapGetters('base-items-have-additions', {
            baseItemsHaveAdditions: 'list'
        }),
        ...mapGetters('categories', {
            categories: 'list'
        }),
        ...mapGetters('flavours', {
            flavours: 'list'
        }),
        ...mapGetters('items', {
            items: 'list'
        }),
        ...mapGetters('sizes', {
            sizes: 'list'
        }),
        ...mapGetters('tables', {
            tables: 'list'
        }),
        ...mapGetters('types', {
            types: 'list'
        })
    }
}
</script>

<style>

</style>