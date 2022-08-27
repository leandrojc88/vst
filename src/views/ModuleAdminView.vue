<template>
  <v-app>
    <vst-banner title="Administración" root_url="admin" app>
      <vst-modules-menu-items :menus="menus" module_name="Admin" />
    </vst-banner>
    <v-content app>
      <router-view></router-view>
    </v-content>
    <vst-footer app></vst-footer>
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "ModuleAdminView",
  data: () => ({
    menus: [{ name: "Nomencladores", config: [1, 10] }]
  }),
  methods: {
    // ...mapActions(['admin/loadUnidades'])
    ...mapActions("admin", ["loadUnidades", "loadCargos", "loadUsers"])
  },
  mounted() {
    //cargar los datos asincronos cuando se inicie el modulo
    this.loadUsers();
    this.loadUnidades();
    this.loadCargos();
  }
};
</script>