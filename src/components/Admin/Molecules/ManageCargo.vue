<template>
  <v-card outlined class="mb-3 d-flex pa-0 align-center" height="60">
    <v-icon size="25" class="mx-2" left>mdi-chevron-double-right</v-icon>
    <v-divider vertical></v-divider>
    <v-sheet width="330">
      <v-form ref="form" class="ml-2">
        <v-text-field
          style="padding-top: 10px;"
          dense
          oneline
          :error-messages="nombre__errors"
          v-model="nombre"
          name="nombre"
          label="Cargo"
          @input="$v.nombre.$touch()"
          @blur="$v.nombre.$touch()"
        ></v-text-field>
      </v-form>
    </v-sheet>
    <v-btn
      width="80"
      small
      class="mx-2 px-1"
      :color="btn__action.btn__color"
      @click="onSubmit()"
    >{{btn__action.btn__text}}</v-btn>
    <v-btn class="mr-2 px-1" color="error" outlined small @click="onClear()">
      <v-icon v-if="btn__action.clear === 'Limpiar'">mdi-broom</v-icon>
      {{btn__action.clear}}
    </v-btn>
  </v-card>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import auth from "@/security/auth";
import { mapActions } from "vuex";

export default {
  mixins: [validationMixin],
  validations: {
    nombre: { required }
  },
  props: ["cargo__item"],
  data: () => ({
    action: "",
    id: "",
    nombre: "",
    rules: {}
  }),

  //----------------------------- Hoocks -------------------------
  mounted() {
    this.checkActionAndData();
  },

  watch: {
    cargo__item(val) {
      this.checkActionAndData();
    }
  },

  //----------------------------- COMPUTED -------------------------
  computed: {
    btn__action() {
      return this.action === "create"
        ? { btn__text: "Crear", btn__color: "primary", clear: "Limpiar" }
        : { btn__text: "Modificar", btn__color: "warning", clear: "Cancelar" };
    },
    nombre__errors() {
      const errors = [];
      if (!this.$v.nombre.$dirty) return errors;
      !this.$v.nombre.required && errors.push("Campo Obligatorio");
      return errors;
    }
  },

  //----------------------------- METHODS -------------------------
  methods: {
    ...mapActions("admin", ["actionAddcargo", "actionUpdateCargos"]),
    onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.action === "create") {
          this.actionAddcargo({ nombre: this.nombre })
            .then(res => {
              this.$emit("manage-cargo", "add");
              this.onClear();
            })
            .catch(err => {
              this.$emit("error-cargo", `no se pudo crear el cargo`);
            });
        } else {
          //action === update
          this.actionUpdateCargos({
            id: this.id,
            cargo: { nombre: this.nombre }
          })
            .then(res => {
              this.$emit("manage-cargo", "update");
            })
            .catch(err => {
              this.$emit("error-cargo", `no se pudo actualizar el cargo `);
            });
        }
        this.onClear();
      }
    },
    onClear() {
      this.$v.$reset();
      this.nombre = "";
      this.id = "";
      this.action = "create";
      this.$emit("clear");
    },
    checkActionAndData() {
      if (this.cargo__item) {
        this.action = "update";
        this.nombre = this.cargo__item.nombre;
        this.id = this.cargo__item.id;
      } else {
        this.action = "create";
        this.nombre = "";
        this.id = "";
      }
    }
  }
};
</script>

<style scoped>
.unborde-right {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.grados-position {
  height: 48px;
  width: 40px;
  align-items: center;
  justify-content: center;
}

.position-fixed {
  position: fixed;
}
@media screen and (max-width: 550px) {
  .position-fixed {
    position: relative;
  }
}
</style>