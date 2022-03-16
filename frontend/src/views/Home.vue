<template>
  <v-card>
    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn block :to="{ name: 'TypeSelection' }">Bestellung aufnehmen</v-btn>
          </v-col>
          <v-col cols="12" sm="6">
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
