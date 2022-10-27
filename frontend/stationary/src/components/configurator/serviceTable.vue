<template>
    <v-card>
        <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
                dense
                clearable
            ></v-text-field>
        </v-card-title>
        <v-data-table
            :headers="[...headers, { value: 'actions', text: 'Actions' }]"
            :items="noNew ? [...items] : [...items, newEntity]"
            hide-default-header
            class="elevation-1"
            :search="search"
            >
            <template v-for="{ value: key } in headers" v-slot:[`item.${key}`]="{ item }">
                <v-text-field 
                    v-if="config[key].changeable === false"
                    :key="`static_field_${serviceConstructor}_${key}_${item.id || item.__id}`"
                    readonly
                    v-model="item[key]"
                    :label="headers.find(({ value }) => value === key).text"
                    >
                </v-text-field>
                <v-switch
                    v-else-if="config[key].changeable === true && config[key].type === 'boolean'"
                    :key="`boolean_field_${serviceConstructor}_${key}_${item.id || item.__id}`"
                    v-model="item[key]"
                    :label="headers.find(({ value }) => value === key).text"
                    />
                <v-text-field
                    v-else-if="config[key].changeable === true"
                    :key="`dynamic_field_${serviceConstructor}_${key}_${item.id || item.__id}`"
                    v-model="item[key]"
                    :label="headers.find(({ value }) => value === key).text"
                    :type="config[key].type ? config[key].type : 'text'"
                    >
                </v-text-field>
                <v-select
                    v-else
                    :key="`foreign_key_field_${serviceConstructor}_${key}_${item.id || item.__id}`"
                    :items="dependencies[config[key].changeable.key]"
                    :item-text="config[key].changeable.itemText"
                    :item-value="config[key].changeable.itemValue"
                    :label="headers.find(({ value }) => value === key).text"
                    :multiple="config[key].changeable.multiple"
                    :chip="config[key].changeable.multiple"
                    v-model="item[key]"
                    >
                    <template v-if="config[key].changeable.multiple" v-slot:selection="{ item: chipAbleItem, index }">
                        <v-chip v-if="index < 2">
                            <span>{{ chipAbleItem.name }}</span>
                        </v-chip>
                        <span
                            v-if="index === 2"
                            class="grey--text text-caption"
                            >
                            (+{{ item[key].length - 2 }} others)
                        </span>
                    </template>
                </v-select>
            </template>
            <template
                v-slot:[`item.actions`]="{ item }"
                >
                <v-btn icon @click="saveEntity(item)">
                    <v-icon>save</v-icon>
                </v-btn>
                <v-btn v-if="item.id" icon @click="overlay = true && item.remove().then(() => { overlay = false })">
                    <v-icon>clear</v-icon>
                </v-btn>
            </template>
        </v-data-table>
        <loading :loading="overlay" />
    </v-card>
</template>

<script>
import Loading from '../utility/loading.vue'
export default {
    name: 'ServiceTable',
    props: { // https://vuejs.org/v2/guide/components-props.html#Prop-Validation
        items: {
            type: Array,
            required: true
        },
        dependencies: {
            type: Object,
            default: () => ({
                categories: [] // this should reference to the 'list' of a service, in this case it will update automaticall on change
            })
        },
        serviceConstructor: {
            type: String,
            required: true
        },
        headers: {
            type: Array,
            required: true,
            validator: (value = []) => {
                return value.every(header => header.value && header.text)
            }
        },
        config: {
            type: Object,
            required: true,
            default: () => ({
                id: {
                    changeable: false // indicating text-field readonly
                },
                name: {
                    changeable: true, // indicating text-field 
                    // type: 'Number' // optional if it is a number
                },
                categoryId: {
                    changeable: { // indicating select with content of key with id 'id'
                        key: 'categories',
                        itemValue: 'id',
                        itemNText: 'name'
                    }
                }
            })
        },
        noNew: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Loading
    },
    data: () => ({
        newEntity: {},
        search: '',
        overlay: false
    }),
    created: function () {
        if (!this.noNew) {
            this.createNewEntity()
        }
    },
    mounted: function () {},
    computed: {},
    methods: {
        createNewEntity: function () {
            let entityContructor = this.$FeathersVuex.api[this.serviceConstructor]
            this.newEntity = new entityContructor()
        },
        saveEntity: function (entity) {
            this.overlay = true
            let promise
            if (entity.id) {
                promise = entity.save()
            } else {
                promise = entity.save().then(() => {
                    this.createNewEntity()
                })
            }
            promise.then(() => {
                this.overlay = false
            })
        }
    }
}
</script>

<style>

</style>