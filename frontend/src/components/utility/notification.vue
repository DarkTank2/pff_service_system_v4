<template>
    <v-snackbar
        :value="notification"
        rounded="pill"
        timeout="-1"
        >
        <div style="margin-left:20px;">
            <span v-if="notification" v-text="notification.message" :class="colorClass"></span>
        </div>
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
        }),
        icon: function () {
            let icons = {
                'success': 'check',
                'error': 'warning'
            }
            return this.notification.icon || icons[this.notification.type] || 'warning'
        },
        colorClass: function () {
            let colors = {
                'success': 'green--text text--lighten-1',
                'error': 'red--text text--lighten-1'
            }
            return this.notification?.colorClass || colors[this.notification?.type] || 'orange--text text-lighten-1'
        }
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