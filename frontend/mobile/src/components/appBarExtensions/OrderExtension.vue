<template>
    <v-slide-group
        show-arrows
        center-active
        :value="activeCategoryId - 1"
        >
        <v-slide-item
            v-for="category in rawCategories"
            :key="`slide_item_category_${category.id}`"
            >
            <v-btn
                :input-value="category.id === activeCategoryId"
                active-class="active white--text"
                rounded
                outlined
                :disabled="category.disabled"
                @click="scrollToCategory(category)"
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
        scrollToCategory: function (category) {
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
        ...mapGetters('base', {
          activeCategoryId: 'firstActiveCategory'
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
.active {
  background-color: #928cff;
}
</style>