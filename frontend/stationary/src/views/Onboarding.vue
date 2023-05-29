<template>
  <v-container>
    <v-carousel v-model="model" :height="maxHeight" :continuous="false">
      <v-carousel-item>
        <v-sheet height="100%">
          <v-card
            class="d-flex align-center flex-column mb-6 px-14"
            height="100%"
            flat
            tile
            >
            <span class="mt-auto font-weight-black">Hallo</span>
            <span>Ich brauche ein paar Informationen von dir, damit ich dich an die richtige Stelle leiten kann!</span>
            <div class="mb-auto">
              <v-row>
                <v-col cols="6"><v-btn block color="primary" @click="model++">Hier gehts weiter.</v-btn></v-col>
              </v-row>
            </div>
          </v-card>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item>
        <v-sheet height="100%">
          <v-card
            class="d-flex align-center flex-column mb-6 px-14"
            height="100%"
            flat
            tile
            >
            <span class="mt-auto font-weight-black">Deine Rolle</span>
            <span>Welche Art von Station stellst du dar?</span>
            <span>Bei einer Basisstation werden z.B Speisen und Getränke hergerichtet und zusammengestellt.</span>
            <span>Bei der <span class="font-weight-bold">Verrechnung</span> werden Bestellungen aufgenommen und verrechnet.</span>
            <div class="mb-auto">
              <v-row>
                <v-col cols="6"><v-btn block color="primary" @click="setBuffet"><v-icon>apps</v-icon>Basisstation</v-btn></v-col>
                <v-col cols="6"><v-btn block color="primary" @click="setCalculator"><v-icon>calculate</v-icon>Verrechnung</v-btn></v-col>
              </v-row>
            </div>
          </v-card>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item>
        <v-sheet height="100%">
          <v-card
            class="d-flex align-center flex-column mb-6 px-14"
            height="100%"
            flat
            tile
            >
            <span class="mt-auto font-weight-black">Die Verrechnung</span>
            <span>Als nächstes muss ich wissen, ob deine Bestellungen direkt abgeschlossen werden, oder nicht.</span>
            <span>Beantworte dazu einfach folgende Frage:</span>
            <span>Wenn jemand eine Bestellung bei dir aufgibt, können die bestellten Sachen auch sofort mitgenommen werden, oder müssen sie erst zubereitet werden?</span>
            <span>Sofort fertig wäre zum Beispiel ein bestelltes Gruppen-T-Shirt, zubereitet werden muss zum Beispiel ein Apfelsaft-Gespritzt.</span>
            <div class="mb-auto">
              <v-row>
                <v-col cols="6"><v-btn block color="primary" @click="setImmediatelyFinished">Sofort fertig (z.b. Merch)</v-btn></v-col>
                <v-col cols="6"><v-btn block color="primary" @click="setPreparation">Muss zubereitet werden (Essen und Getränke)</v-btn></v-col>
              </v-row>
            </div>
          </v-card>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item>
        <v-sheet height="100%">
          <v-card
            class="d-flex align-center flex-column mb-6 px-14"
            height="100%"
            flat
            tile
            >
            <span class="mt-auto font-weight-black">Dein Stationsname</span>
            <span>Zu guter letzt brauche ich noch den Namen deiner Station.</span>
            <span>Am besten ist, wenn dieser Name eindeutig deine Station repräsentiert.</span>
            <span>Beispiele sind: Buffet, Getränkestation_1, Merch_1</span>
            <div class="mb-auto">
              <v-row dense>
                <v-col cols="12"><v-text-field v-model="stationName" label="Stationsname"></v-text-field></v-col>
              </v-row>
              <v-row>
                <v-col cols="12"><v-btn block color="primary" :disabled="stationName === null || stationName === ''" @click="model++">Hier gehts weiter.</v-btn></v-col>
              </v-row>
            </div>
          </v-card>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item>
        <v-sheet height="100%">
          <v-card
            class="d-flex align-center flex-column mb-6 px-14"
            height="100%"
            flat
            tile
            >
            <span class="mt-auto font-weight-black">Zum Abschluss noch</span>
            <span>Vielen Dank für die Infos.</span>
            <span>Damit kann ich jetzt die App bestmöglich für dich vorbereiten und aufsetzen.</span>
            <div class="mb-auto">
              <v-row>
                <v-col cols="12"><v-btn block color="primary" @click="model++">Hier gehts weiter.</v-btn></v-col>
              </v-row>
            </div>
          </v-card>
        </v-sheet>
      </v-carousel-item>
      <v-carousel-item>
        <v-sheet height="100%">
          <v-card
            class="d-flex align-center flex-column mb-6 px-14"
            height="100%"
            flat
            tile
            >
            <span class="mt-auto font-weight-black"> </span>
            <span>Du wirst in drei Sekunden zu deiner personalisierten Applikation weitergeleitet!</span>
            <span>Sollte dies nicht der Fall sein, drücke bitte auf folgenden Button.</span>
            <v-btn @click="redirect" color="primary">Zur App</v-btn>
            <span class="mb-auto"> </span>
          </v-card>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-container>
</template>
<script>
import moment from 'moment'
import { mapMutations } from 'vuex'
export default {
  name: 'Onboarding_stationary',
  props: [],
  components: {},
  data () {
    return {
      model: 0,
      target: null,
      finishOrderImmediately: null,
      stationName: ''
    }
  },
  created: function () {},
  mounted: function () {},
  methods: {
    ...mapMutations('config', {
      updateImmediateOrderMode: 'updateImmediateOrderMode',
      updateName: 'updateName'
    }),
    redirect: function () {
      // ToDo: check if subscription for the target is rather new, if not redirect to subscriptions, else redirect to target
      console.log('Finished onboarding, continuing to main application...')
      window.localStorage.setItem('stationaryOnboardingCompletedAt', moment().format())
      let redirectTarget = 'Onboarding' // default
      let lastSubscribed = window.localStorage.getItem('subscriptionDate') // for buffet
      let lastConfigured = window.localStorage.getItem('displayedItemsDate') // for calculator
      if (this.target === 'Home') {
        if (!lastSubscribed || moment(lastSubscribed).isBefore(moment('2023-06-03T12:00:00.000Z'))) {
          redirectTarget = 'Subscriptions'
        } else {
          redirectTarget = 'Home'
        }
      } else if (this.target === 'Calculator') {
        if (!lastConfigured || moment(lastConfigured).isBefore(moment('2023-06-03T12:00:00.000Z'))) {
          redirectTarget = 'CalculatorConfig'
        } else {
          redirectTarget = 'Calculator'
        }
      }
      this.updateImmediateOrderMode({ value: this.finishOrderImmediately })
      this.updateName(this.stationName)
      setTimeout(() => {
        this.$router.push({ name: redirectTarget })
      }, 3000)
    },
    setBuffet: function () {
      this.target = 'Home'
      this.model = 5
    },
    setCalculator: function () {
      this.target = 'Calculator'
      this.model++
    },
    setImmediatelyFinished: function () {
      this.finishOrderImmediately = true
      this.model++
    },
    setPreparation: function () {
      this.finishOrderImmediately = false
      this.model++
    },
  },
  watch: {
    model: {
      handler: function (newVal) {
        if (newVal === 5) {
          this.redirect()
        }
      }
    }
  },
  computed: {
    maxHeight: function () {
      return window.innerHeight - 56 - 2*12
    }
  }
}
</script>
<style scoped>
span {
  text-align: center;
}
</style>
