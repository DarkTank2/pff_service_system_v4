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
                :disabled="category.disabled"
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
    data: () => ({}),
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
            listCategories: 'list'
        }),
        env: function () {
            return this.listEnvs[0]
        },
        rawCategories: function () {
            return this.listCategories.map(category => {
                return {
                    ...category,
                    disabled: this.env.disabledCategories.includes(category.id)
                }
            })
        }
    },
    watch: {}
}
</script>

<style>

</style>