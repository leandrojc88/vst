<template>
  <v-container fluid>
    <v-data-table
      :headers="headers"
      :items="lista_usuarios"
      :search="search"
      sort-by="id"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title class="hidden-xs-only">Usuarios:</v-toolbar-title>
          <v-divider class="hidden-xs-only mx-4" inset vertical></v-divider>
          <v-text-field
            v-model="search"
            prepend-icon="mdi-account-search-outline"
            label="Buscar"
            hide-details
          ></v-text-field>
          <v-spacer></v-spacer>

          <!-- Dialogo de CRUD -->
          <v-dialog v-model="dialog" max-width="500px" persistent>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" dark class="mb-2" v-on="on" @click="openAddModal">
                <v-icon dark left>mdi-account-plus-outline</v-icon>
                <span class="hidden-xs-only">Nuevo</span>
              </v-btn>
            </template>
            <v-card>
              <v-card-title class="blue darken-4" style="color:white;">{{ formTitle }}</v-card-title>
              <v-card-text class="py-1">
                <v-container class="py-1">
                  <v-form ref="form" lazy-validation>
                    <v-row>
                      <v-col cols="12" md="12" class="pa-0">
                        <v-text-field
                          v-model="indexUser.user"
                          required
                          :rules="[rules.required, rules.user_string, exist_rule]"
                          label="Usuario"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12" class="pa-0">
                        <v-text-field
                          v-model="indexUser.full_name"
                          :rules="[rules.required]"
                          label="Nombre Completo"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="12" class="pa-0">
                        <v-select
                          v-model="indexUser.rol"
                          :items="rol_list"
                          item-text="name"
                          item-value="id"
                          :rules="[rules.required]"
                          label="Seleccione el Rol"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="12" class="pa-0">
                        <v-select
                          v-model="indexUser.cargo"
                          :items="list__cargos"
                          item-text="nombre"
                          item-value="id"
                          :rules="[rules.required]"
                          label="Seleccione el Cargo"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="12" class="pa-0">
                        <v-select
                          v-model="indexUser.unidad"
                          :items="list__unidades"
                          item-text="siglas"
                          item-value="id"
                          :rules="[rules.required]"
                          label="Seleccione la Unidad"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="12" class="pa-0" v-if="show_change_pass">
                        <v-checkbox
                          class="py-0 my-0"
                          style="height: 20px!important;"
                          v-model="chk_pass"
                          label="Cambiar contraseña"
                        ></v-checkbox>
                      </v-col>
                      <v-col cols="12" md="6" class="pa-0 pr-2" v-if="chk_pass">
                        <v-text-field
                          v-model="indexUser.pass"
                          :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, rules.min]"
                          :type="show_pass ? 'text' : 'password'"
                          name="pass_input"
                          label="Contraseña"
                          counter
                          @click:append="show_pass = !show_pass"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" class="pa-0 pl-2" v-if="chk_pass">
                        <v-text-field
                          v-model="indexUser.repeat_pass"
                          :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
                          :rules="[rules.required, rules.min, repeart_rule]"
                          :type="show_pass ? 'text' : 'password'"
                          name="pass_input"
                          label="Reperir Contraseña"
                          counter
                          @click:append="show_pass = !show_pass"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn outlined enabled @click="dialog = false">Cancelar</v-btn>
                <v-btn color="primary" @click="submit">Guardar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <template v-slot:item.unidad="{ item }">{{ item.unidad.siglas }}</template>
      <template v-slot:item.cargo="{ item }">{{ item.cargo.nombre }}</template>
      <template v-slot:item.rol="{ item }">{{ getRolName(item.rol) }}</template>

      <!-- Accionar del Editar y Eliminar -->
      <template v-slot:item.action="{ item }">
        <v-icon class="mr-4" @click="editItem(item)">mdi-pencil</v-icon>
        <v-icon color="error" @click="deleteItem(item)">mdi-delete</v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Actializar</v-btn>
      </template>
    </v-data-table>

    <!-- Dialogo de confirmacion de ELIMINAR -->
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-btn class="ma-3 mt-6" outlined @click="sheet = false">Cancelar</v-btn>
        <v-btn class="ma-3 mt-6" dark color="red" @click="removeItem()">Confirmar</v-btn>
        <div class="py-3">
          Seguro que desea eliminar el Usuario
          <span
            style="color: red; font-weight: 600;"
          >{{indexUser.user}}</span> ?
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <!-- CARGANDO... -->
    <v-overlay :value="!isLoadingUsers">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>
<script>
import auth from "@/security/auth";
import rolesConfig from "@/security/roles";
import { mapGetters, mapState, mapMutations } from "vuex";

export default {
  data: () => ({
    dialog: false,
    show_pass: false,
    show_change_pass: false,
    chk_pass: false,
    sheet: false,
    search: "",
    rol_list: [],
    editedIndex: -1,
    indexUser: {
      id: "",
      user: "",
      full_name: "",
      pass: "",
      cargo: "",
      unidad: "",
      rol: ""
    },
    rules: {
      required: value => !!value || "Obligatorio",
      min: v => (v && v.length >= 8) || "Minimo 8 characters",
      user_string: v =>
        /^[A-Za-z0-9_]+$/.test(v) || "Solo debe contener (letras, números y _ )"
    },
    headers: [
      { text: "ID", value: "id" },
      { text: "Usuario", value: "user" },
      { text: "Nombre Completo", value: "full_name" },
      { text: "Rol", value: "rol" },
      { text: "Cargo", value: "cargo" },
      { text: "Unidad", value: "unidad" },
      { text: "Acciones", value: "action", sortable: false, width: 100 }
    ]
  }),

  // ---------------------------- Computed -----------------------------
  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "Nuevo Usuario"
        : `Editar datos del Usuario`;
    },
    repeart_rule() {
      return this.indexUser.pass === this.indexUser.repeat_pass
        ? true
        : "No cohinciden las contraseñas!";
    },
    exist_rule() {
      if (this.editedIndex === -1) {
        //add
        if (this.indexUser.hasOwnProperty("user")) {
          return (
            !this.lista_usuarios.some(u => u.user === this.indexUser.user) ||
            "el usuario ya está en uso!"
          );
        }
      } else {
        //edit
        return (
          !this.lista_usuarios.some(
            u => u.user === this.indexUser.user && u.id !== this.indexUser.id
          ) || "el usuario ya está en uso!"
        );
      }
      return true;
    },
    form() {
      return {
        user: this.indexUser.user,
        full_name: this.indexUser.full_name,
        pass: this.indexUser.pass,
        repeat_pass: this.indexUser.repeat_pass,
        rol: this.indexUser.rol,
        unidad: this.indexUser.unidad,
        cargo: this.indexUser.cargo
      };
    },
    ...mapState("admin", {
      lista_usuarios: "list__users"
    }),
    ...mapGetters("admin", {
      list__unidades: "orderUnidades",
      list__cargos: "orderCargos",
      isLoadingUsers: "isLoadingUsers"
    })
  },

  // ---------------------------- Watch -----------------------------
  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  // ---------------------------- Hoocks -----------------------------
  created() {
    this.initialize();
  },

  // ---------------------------- Methods -----------------------------
  methods: {
    ...mapMutations("admin", [
      "addListUsers",
      "updateListUsers",
      "deleteListUsers"
    ]),
    ...mapMutations(["showNotify"]),
    getRolName(value) {
      return rolesConfig.find(r => r.id == value).name || "Rol sin nombre";
    },

    async initialize() {
      this.rol_list = rolesConfig;
    },

    close() {
      this.$refs.form.reset();
      setTimeout(() => {
        this.editedIndex = -1;
      }, 300);
    },

    async submit() {
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          const response = await this.axios.put(
            `/userSystem/${this.indexUser.id}`,
            { change_pass: this.chk_pass, ...this.form }
          );
          this.updateListUsers({ id: this.indexUser.id, data: response.data });
          this.showNotify({ msg: `usuario actualizado correctamente` });
        } else {
          const response = await this.axios.post("/userSystem", this.form);
          this.addListUsers(response.data);
          this.showNotify({
            msg: `usuario ${response.data.user} creado correctamente`
          });
        }
        this.$refs.form.reset();
        this.dialog = false;
      }
    },

    editItem(item) {
      this.show_change_pass = true;
      this.chk_pass = false;
      this.editedIndex = this.lista_usuarios.indexOf(item);
      item.rol = Number.parseInt(item.rol);
      this.indexUser = Object.assign(
        {},
        {
          id: item.id,
          user: item.user,
          full_name: item.full_name,
          rol: item.rol,
          unidad: item.unidad.id,
          cargo: item.cargo.id
        }
      );
      this.dialog = true;
    },

    openAddModal() {
      this.show_change_pass = false;
      this.chk_pass = true;
      this.indexUser = {
        /* id: "", user: "", full_name: "", rol: "", unidad: "",
          cargo:""  */
      };
    },

    deleteItem(item) {
      this.sheet = true;
      this.indexUser = {
        id: item.id,
        user: item.user,
        full_name: item.full_name,
        rol: item.rol
      };
    },
    async removeItem() {
      const userdeleted = await this.axios.delete(
        `/userSystem/${this.indexUser.id}`
      );
      this.deleteListUsers(this.indexUser);
      this.showNotify({
        msg: `El usuario ${userdeleted.data.user} fue eliminado correctamente`
      });
      this.sheet = false;
      this.editedIndex = -1;
    }
  }
};
</script>