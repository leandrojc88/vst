<template>
  <v-container fluid>
    <v-card>
      <v-tabs vertical>
        <v-tab
          style="justify-content: left;"
          v-for="(rol_item, index) in roles"
          :key="index"
          v-model="rol_name_selected"
          @click="rol_name_selected = rol_item.name"
        >
          <v-icon left>mdi-account-multiple-outline</v-icon>
          {{rol_item.name}}
        </v-tab>

        <!-- Tab Items -->
        <v-tab-item v-for="(rol_item, index) in roles" :key="index">
          <v-container>
            <v-toolbar flat color="white">
              <v-toolbar-title>Módulos</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip-group
                mandatory
                v-model="selection_module_first"
                active-class="primary--text elevation-2"
                class="ma-0"
              >
                <v-chip
                  outlined
                  class="ma-1"
                  v-for="(modules_item, index_modules) in listModulesRolAccess"
                  :key="index_modules"
                  @click="moduleSelected(modules_item.descrip)"
                >{{modules_item.descrip}}</v-chip>
              </v-chip-group>
            </v-toolbar>
            <!-- <v-divider class="mx-4" inset></v-divider> -->

            <!-- Lista de Permisos  -->
            <template v-if="module_name_selected !== 'no'">
              <v-list dense class="pt-0 pl-2">
                <v-subheader class="subtitle-2">PERMISOS:</v-subheader>

                <template v-if="permisions === 'all' ">
                  <h2 class="ml-3">Todos los Permisos</h2>
                </template>
                <template v-else v-for="(item_permis, indexp) in permisions">
                  <v-divider :key="'divider'+indexp"></v-divider>

                  <v-list-item :key="'list'+indexp">
                    <v-list-item-content>
                      <v-list-item-title v-if="!item_permis.not">
                        <v-icon small>mdi-menu-right-outline</v-icon>
                        {{item_permis.descrip}}
                      </v-list-item-title>
                      <v-list-item-title v-else>
                        <v-icon color="#FF5252" size="20">mdi-music-accidental-double-sharp</v-icon>
                        <span class="notRoles">{{item_permis.descrip}}</span>
                        <v-spacer></v-spacer>
                      </v-list-item-title>
                      <!-- <v-list-item-subtitle v-html="item_permis.subtitle"></v-list-item-subtitle> -->
                    </v-list-item-content>
                    <v-list-item-action class="flex-row" v-if="item_permis.permisions.length > 0">
                      <v-chip
                        v-for="(item_permision,index_permision) in item_permis.permisions"
                        :key="index_permision"
                        small
                        class="ml-1"
                        :class="classColors(item_permision)"
                      >{{traslate(item_permision)}}</v-chip>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-list>
            </template>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </v-container>
</template>

<script>
import roles from "@/security/roles.js";
import { getRolModuleAccess, getPermisionsFromModule } from "@/security/utils";

export default {
  name: "Rols",
  data: () => ({
    roles,
    rol_name_selected: "",
    module_name_selected: "",
    selection_module_first: 0
  }),
  watch: {
    rol_name_selected(val) {
      this.listModulesRolAccess;
      this.selection_module_first = 0;
      this.module_name_selected =
        this.listModulesRolAccess.length &&
        this.listModulesRolAccess[0].descrip;
    }
  },
  computed: {
    listModulesRolAccess() {
      return getRolModuleAccess(this.rol_name_selected);
    },

    permisions() {
      return this.module_name_selected
        ? getPermisionsFromModule(
            this.rol_name_selected,
            this.module_name_selected
          )
        : [];
    }
  },
  methods: {
    /**
     * Seleccion y deleccion del modulo que se va a visualizar y los permisos del mismo
     */
    moduleSelected(name) {
      this.module_name_selected = name;
    },

    classColors(permision) {
      const crud = ["crud", "create", "read", "update", "delete"];
      return {
        primary: permision === "manage" || false,
        secondary: crud.some(el => permision === el) || false,
        success:
          !["manage", "sin permisos", ...crud].some(el => permision === el) ||
          false,
        error: permision === "sin permisos" || false
      };
    },
    traslate(permision) {
      const crud = [
        ["manage", "Todos"],
        ["crud", "crud"],
        ["create", "crear"],
        ["read", "leer"],
        ["update", "actualizar"],
        ["delete", "borrar"]
      ];
      const find = crud.find(el => el[0] === permision)
      return (find && find[1]) || permision
    }
  },
  created() {
    this.rol_name_selected = this.roles[0].name;
    this.module_name_selected = this.roles[0].default;
  }
};
</script>

<style>
.notRoles {
  color: #b71c1c;
  text-decoration: line-through;
}
</style>