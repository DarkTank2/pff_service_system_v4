<template>
  <span class="text-h3">{{ time }}</span>
</template>

<script>
import moment from 'moment'
export default {
    name: 'BuffetAppBarComponent',
    data: () => ({
        time: null,
        toggleColon: false
    }),
    mounted: function () {
        this.timingCB()
    },
    methods: {
        timingCB: function () {
            let format = `HH${this.toggleColon ? ':' : ' '}mm`
            this.toggleColon = !this.toggleColon
            this.time = moment().format(format)
            setTimeout(this.timingCB.bind(this), 1000)
        }
    }
}
</script>

<style>

</style>