<template>
  <v-app>
    <!-- Notificación -->
    <v-snackbar v-model="notify.visible" top :color="notify.color" :timeout="notify.time">
      {{notify.msg}}
      <v-icon dark @click="closeNotify">mdi-close</v-icon>
    </v-snackbar>

    <!-- Contenido -->
    <router-view />
    
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  data: () => ({}),
  computed: {
    ...mapState(["notify"])
  },
  methods: {
    ...mapMutations(["closeNotify"])
  }
};
</script>