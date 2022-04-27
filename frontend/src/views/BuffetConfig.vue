<template>
    <v-container fluid class="mt-4">
        <v-row class="mx-1">
            <v-btn :to="{ name: 'Buffet' }" flat outlined>
                <v-icon>chevron_left</v-icon>
                zurück zum buffet
            </v-btn>
        </v-row>
        <v-row>
            <v-col cols="12">
                <service-table
                    :items="baseItems"
                    :dependencies="{}"
                    :headers="[{ value: 'id', text: 'ID' }, { value: 'name', text: 'Name' },{value:'available',text:'Available'}]"
                    serviceConstructor="BaseItem"
                    :config="{ id: { changeable: false }, name: { changeable: false },available:{changeable:true,type:'boolean'} }"
                    no-new
                    />
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ServiceTable from '../components/configurator/serviceTable.vue'
export default {
    name: 'BuffetConfig',
    components: { ServiceTable },
    mounted: function () {
        this.fetchBaseItems()
    },
    methods: {
        ...mapActions('base-items', {
            fetchBaseItems: 'find'
        })
    },
    computed: {
        ...mapGetters('base-items', {
            baseItems: 'list'
        })
    }
}
</script>

<style>

</style>