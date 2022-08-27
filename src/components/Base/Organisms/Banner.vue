<template>
  <v-app-bar app dense color="primary" dark justify="center">
    <slot name="title">
      <v-toolbar-title class="pl-0 mr-2">
        <v-btn
          class="text-capitalize title font-weight-light px-1"
          text
          outlined
          @click="routing(root_url)"
        >
          <v-icon>mdi-view-dashboard-outline</v-icon>
          {{title}}
        </v-btn>
      </v-toolbar-title>
    </slot>

    <!-- <v-divider class="mx-2 blue darken-1" vertical inset /> -->

    <!-- SLOT para menu personalizado dependiendo del modulo -->
    <slot></slot>
    <!-- <<<<<<<<<< END >>>>>>>>>> -->

    <v-spacer></v-spacer>

    <!-- Salir -->
    <slot name="exit">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon @click="logout" v-on="on">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <span>Salir</span>
      </v-tooltip>
    </slot>

    <!-- Menu de Opciones Usuario-->
    <slot name="options">
      <v-menu :offset-x="true" :offset-y="true" transition="slide-y-transition">
        <template v-slot:activator="{ on: menu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: tooltip }">
              <v-btn icon v-on="{ ...tooltip, ...menu }">
                <!-- <v-icon>mdi-dots-vertical</v-icon> -->
                <v-avatar color="light-blue darken-1" size="35">
                  <span class="white--text headline">{{firstLetter}}</span>
                </v-avatar>
              </v-btn>
            </template>
            <span>Opciones</span>
          </v-tooltip>
        </template>

        <v-card min-width="220">
          <v-card-title class="pt-1 title justify-space-between">
            {{currentUser.user.toUpperCase()}}
            <v-icon>mdi-account</v-icon>
          </v-card-title>
          <v-card-subtitle class="pb-2 caption">{{currentUser.full_name}}</v-card-subtitle>
          <v-divider class="my-0 mx-4" />
          <v-card-text class="pt-1">
            <v-list dense subheader flat>
              <v-subheader>Módulos</v-subheader>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                @click="routing(item.descrip)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon left>mdi-view-module</v-icon>
                    {{ item.descrip.firstUpperCase() }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="my-2" />
              <v-list-item @click="dialogConfig = !dialogConfig">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon left>mdi-settings-outline</v-icon>Configuración
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>
    </slot>

    <!-- <<<<<<<<<< END >>>>>>>>>> -->

    <!-- Modal de Configuración -->
    <v-dialog
      v-model="dialogConfig"
      scrollable
      persistent
      max-width="500px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-title primary-title>
          <v-icon left>mdi-settings-outline</v-icon>Configuración
        </v-card-title>
        <v-card-text>
          <v-icon left color="error">mdi-head-remove-outline</v-icon>Lo sentimos!. La funcionalidad no esta disponible en esta versión
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn class outlined @click="dialogConfig = !dialogConfig">Cancelar</v-btn>
          <v-btn class dark color="primary" @click="dialogConfig = !dialogConfig">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- <<<<<<<<<< END >>>>>>>>>> -->
  </v-app-bar>
</template>

<script>
import auth from "@/security/auth";
import { getRolModuleAccess } from "@/security/utils";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Banner",
  data: () => ({
    items: [],
    firstLetter: "",
    dialogConfig: false
  }),
  created() {
    this.items = [...getRolModuleAccess(this.$store.state.currentUser.rol)];

    this.firstLetter = this.currentUser.user.charAt(0);
  },
  computed: {
    ...mapState(["navigation_drawer", "currentUser"])
  },
  methods: {
    ...mapMutations(["changeNavegationDrawer", "getFirsLetterCurrentUser"]),
    logout() {
      auth.logout(); // eliminar los datos del localStore
      this.$ability.update([]); // eliminar las reglas de las ability de los usuarios
      this.$router.push("/");
    },
    routing(route) {
      this.$router.push({ path: `/${route.toLowerCase()}` }).catch(err => {
        console.log("Misma navegacion");
      });
    }
  },
  props: ["title", "root_url"]
};
</script>

<style scoped>
.logo {
  height: 2rem;
  width: 2rem;
  margin-right: 0.3em;
}
</style>