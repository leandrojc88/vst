<template>
 <v-sheet height="100%" class="d-flex align-center">
  <v-card class="mx-auto" max-width="400" outlined>
    <v-img alt="" src="@/assets/Error.svg" contain height="70" class="error" color="primary"/>
    <v-card-title primary-title>
        Error 404.</v-card-title>
    <v-card-text>
      <h2>Lo sentimos la La página no existe.!!!</h2>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="$router.go(-1)">
        <v-icon left>mdi-keyboard-backspace</v-icon>
        Atrás</v-btn>
        <v-spacer></v-spacer>
      <v-btn color="primary" to="/" outlined>
      <v-icon left>mdi-home</v-icon> Ir al Inicio </v-btn>
    </v-card-actions>
  </v-card>
 </v-sheet>
</template>

<script>
export default {
  
}
</script>