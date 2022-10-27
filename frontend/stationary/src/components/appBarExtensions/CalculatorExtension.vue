<template>
    <v-slide-group
        v-model="activeCategory"
        show-arrows
        center-active
        >
        <v-slide-item>
            <v-btn rounded outlined @click="$vuetify.goTo(staticTarget, staticOptions)">Nach oben</v-btn>
        </v-slide-item>
        <v-slide-item
            v-for="category in listCategories"
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
        staticTarget: 0,
        staticOptions: { duration: 600, offset: 15, easing: 'easeInOutCubic', }
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
            listCategories: 'list'
        }),
        env: function () {
            return this.listEnvs[0]
        }
    },
    watch: {}
}
</script>

<style>

</style>