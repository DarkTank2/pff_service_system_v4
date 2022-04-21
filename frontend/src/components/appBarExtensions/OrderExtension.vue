<template>
    <v-slide-group
        v-model="activeCategory"
        show-arrows
        center-active
        >
        <v-slide-item
            v-for="category in rawCategories"
            :key="`slide_item_category_${category.id}`"
            v-slot="{ active, toggle }"
            >
            <v-btn
                :input-value="active"
                active-class="blue darken-3 white--text"
                rounded
                outlined
                @click="scrollToCategory(category, toggle)"
                >
                {{ category.name }}
            </v-btn>
        </v-slide-item>
    </v-slide-group>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'OrderExtension',
    components: {},
    props: [],
    data: () => ({
        activeCategory: null
    }),
    created: function () {},
    mounted: async function () {
        if (!this.env) {
            this.fetchEnv()
        }
        this.fetchCategories(this.categoryQuery)
    },
    methods: {
        ...mapActions('env', {
            fetchEnv: 'find'
        }),
        ...mapActions('categories', {
            fetchCategories: 'find'
        }),
        scrollToCategory: function (category, toggle) {
            toggle()
            this.$router.push({...this.$route, hash: `#category_${category.id}`})
        }
    },
    computed: {
        ...mapGetters('env', {
            listEnvs: 'list'
        }),
        ...mapGetters('categories', {
            findCategories: 'find'
        }),
        env: function () {
            return this.listEnvs[0]
        },
        typeId: function () {
            return parseInt(this.$route.params.typeId) || 0
        },
        categoryQuery: function () {
            return {
                query: {
                    typeId: this.typeId,
                    id: { $nin: this.env?.disableCategories || [] }
                }
            }
        },
        rawCategories: function () {
            return this.findCategories(this.categoryQuery).data
        },
        activeCategoryId: function () {
            return 1
        }
    },
    watch: {}
}
</script>

<style>

</style>