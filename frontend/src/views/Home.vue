<template>
  <v-card>
    <v-card-title>Service-System</v-card-title>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col cols="6">
            <v-btn block :to="{ name: 'Order' }">Bestellung aufnehmen</v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn block :to="{ name: 'Serve' }">Servieren & Kassieren</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'home',
  data: () => ({
    
  }),
  created: function () {},
  methods: {},
  computed: {}
}
</script>
