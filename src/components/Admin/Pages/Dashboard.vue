<template>
  <v-tabs  centered background-color="primary" dark style="min-height : 84vh">
    <v-tab>Usuarios</v-tab>
    <v-tab>Roles y Permisos</v-tab>
    <v-tab>Historial</v-tab>
    <v-tab-item tabindex>
      <Users/>
    </v-tab-item>
    <v-tab-item tabindex>
      <Rols />
    </v-tab-item>    
    <v-tab-item tabindex>
      <Logs/>
    </v-tab-item>
  </v-tabs>
</template>

<script>
import Users from "../Organisms/Users.vue";
import Rols from "../Organisms/Rols.vue";
import Logs from "../Organisms/Logs.vue";

export default {
  name: "Dashboard",
  components: {
    Users,
    Rols,
    Logs
  },
  data : ()=>({
  })
};
</script>