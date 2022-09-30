<template>
    <v-snackbar
        :value="notification"
        shaped
        timeout="-1"
        >
        <v-alert
            v-if="notification"
            border="left"
            dense
            colored-border
            :type="notification.type || 'warning'"
            :icon="notification.icon"
            >
            {{ notification.message }}
        </v-alert>
        <template v-slot:action="{ attrs }">
            <v-btn
                color="red"
                icon
                v-bind="attrs"
                @click="closeNotification"
                >
                <v-icon>close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
    data: () => ({
        timer: null
    }),
    created: function () {},
    methods: {
        ...mapActions('utilities', {
            resetNotification: 'resetNotification'
        }),
        closeNotification: function () {
            if (this.timer) {
                clearTimeout(this.timer)
            }
            this.timer = null
            this.resetNotification()
        }
    },
    computed: {
        ...mapState('utilities', {
            notification: 'notification'
        })
    },
    watch: {
        notification: {
            handler: function (newNotification) {
                if (newNotification) {
                    if (this.timer) {
                        clearTimeout(this.timer)
                    }
                    if (newNotification.timeout > 0) {
                        this.timer = setTimeout(this.closeNotification, newNotification.timeout)
                    }
                }
            }
        }
    }
}
</script>

<style>

</style>