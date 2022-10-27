<template>
    <v-card @click="selectOrder" class="d-flex flex-column" :class="{ 'card-finished': cardFinished, 'card-chosen': chosen, 'card-free': !chosen }" :id="cardId" :min-height="cardSize">
        <v-card-title :class="chosen === true ? 'red--text text-h4' : 'green--text text-h4'">
            <span>{{ order.table ? order.table.name : order.tableId }}</span>
            <span class="mx-4">{{ ' | ' }}</span>
            <span class="font-weight-light">{{ order.waiter }}</span>
        </v-card-title>
        <v-card-text class="flex-grow-1">
            <v-list>
                <template v-for="(orderedItem, index) in order.items">
                    <v-divider
                        v-if="index !== 0"
                        :key="`divider_index_${index}`"
                        :class="order.items.at(index - 1).additions.length > 0 ? 'mt-4' : ''"
                        />
                    <v-list-item dense :key="`ordered_item_index_${index}`" :two-line="!orderedItem.comment" :three-line="!!orderedItem.comment">
                        <v-list-item-content>
                            <v-list-item-title>
                                <span class="text-h4">{{ `${orderedItem.baseItem.name}` }}</span>
                            </v-list-item-title>
                            <v-list-item-subtitle>
                                <span class="text-h4">{{ `${orderedItem.flavour.name} | ${orderedItem.size.name}` }}</span>
                            </v-list-item-subtitle>
                            <v-list-item-subtitle v-if="!!orderedItem.comment" style="border: 2px solid #2196f3; border-radius: 4px;" class="pa-2">
                                <span class="text-h4">{{ orderedItem.comment }}</span>
                            </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                            <span class="text-h4">{{ `x ${orderedItem.quantity}` }}</span>
                        </v-list-item-action>
                    </v-list-item>
                    <template v-if="orderedItem.additions.length > 0">
                        <span
                            v-for="(addition, i) in orderedItem.additions"
                            :key="`addition_index_${i}_ordered_item_index_${index}`"
                            class="mx-10 cluster-addition text-subtitle-1"
                            >
                            {{ addition ? addition.name : 'Loading...' }}
                            <br />
                        </span>
                    </template>
                </template>
            </v-list>
        </v-card-text>
        <v-card-actions>
            <v-btn block @click="finishOrder">
                <v-icon :class="finished ? 'finished' : ''">send</v-icon>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'Cluster',
    props: ['order', 'cardSize'],
    components: {},
    data: () => ({
        chosen: false,
        finished: false,
        cardFinished: false,
    }),
    mounted: function () {
        this.executeSizePatch()
    },
    updated: function () {
        this.executeSizePatch()
    },
    methods: {
        ...mapActions('ordered-items', {
            updateOrderedItem: 'update'
        }),
        selectOrder: function () {
            this.chosen = true
            document.activeElement.blur()
        },
        finishOrder: function () {
            this.finished = true
            setTimeout(() => {
                this.cardFinished = true
                setTimeout(() => {
                    this.order.items.forEach(({ orderedItem }) => {
                        this.updateOrderedItem([orderedItem.id, { ...orderedItem, finished: true }, null])
                    })
                }, 500)
            }, 1000)
        },
        executeSizePatch: function () {
            let el = document.getElementById(this.cardId)
            this.$emit('card-size', el.clientHeight)
        }
    },
    computed: {
        cardId: function () {
            return `card_order_created_at_${this.order.createdAt}_by_${this.order.waiter}_for_table_id_${this.order.tableId}`
        }
    }
}
</script>

<style scoped>
.cluster-addition {
    font-size: 0.8125rem;
    font-weight: 500;
    line-height: 1rem;
    color: rgba(255, 255, 255, 0.7);
}
i.v-icon {
    transform: translate(0px, 0px);
    opacity: 1;
    transition: transform 500ms, opacity 500ms;
}
.finished {
    transform: translate(100px, -10px) scale(0.7) rotate(-20deg) !important;
    opacity: 0 !important;
}
div.v-card {
    transform: scale(1);
    transition: transform 500ms;
}
.card-finished {
    transform: scale(0) !important;
}
.flexcard {
    display: flex;
    flex-direction: column;
}
.card-chosen {
    border: 2px solid #F44336;
    border-radius: 4px;
}
.card-free {
    border: 2px solid #4CAF50;
    border-radius: 4px;
}
</style>