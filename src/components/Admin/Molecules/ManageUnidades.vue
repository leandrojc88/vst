<template>
  <v-card outlined width="300" class="mt-1 position-fixed">
    <v-card-title class="d-flex flex-row" primary-title>
      <div class="title d-flex">
        <v-img contain width="34" height="29" :src="icon__bar" />
        <span class="ml-4">{{title__bar}}</span>
      </div>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on" color="secondary">mdi-help-circle</v-icon>
        </template>
        <span>{{help__bar}}</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text>
      <v-form ref="form">
        <v-text-field
          v-model="siglas"
          :error-messages="siglas__errors"
          counter="20"
          name="siglas"
          label="Siglas"
          required
          @input="$v.siglas.$touch()"
          @blur="$v.siglas.$touch()"
        ></v-text-field>
        <v-text-field
          :error-messages="nombre__errors"
          v-model="nombre"
          name="nombre"
          label="Nombre"
          @input="$v.nombre.$touch()"
          @blur="$v.nombre.$touch()"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" outlined @click="onClear()">
        <v-icon v-if="btn__action.clear === 'Limpiar'">mdi-broom</v-icon>
        {{btn__action.clear}}
      </v-btn>
      <v-btn
        width="106"
        :color="btn__action.btn__color"
        @click="onSubmit()"
      >{{btn__action.btn__text}}</v-btn>
    </v-card-actions>
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
    siglas: { required, maxLength: maxLength(20) },
    nombre: { required }
  },
  props: ["icon__bar", "title__bar", "help__bar", "unidad__item"],
  data: () => ({
    action: "",
    id: "",
    siglas: "",
    nombre: "",
    rules: {}
  }),

  //----------------------------- Hoocks -------------------------
  mounted() {
    this.checkActionAndData();
  },

  watch: {
    unidad__item(val) {
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

    siglas__errors() {
      const errors = [];
      if (!this.$v.siglas.$dirty) return errors;
      !this.$v.siglas.required && errors.push("Campo Obligatorio");
      !this.$v.siglas.maxLength && errors.push("Excede la cantidad maxima");
      return errors;
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
    ...mapActions("admin", ["addUnidad", "updateUnidad"]),
    onSubmit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.action === "create") {
          this.addUnidad({ nombre: this.nombre, siglas: this.siglas })
            .then(res => {
              this.$emit("manage-unidad", "add");
            })
            .catch(err => {
              this.$emit("error-unidad", `no se pudo crear la unidad`);
            });
        } else {
          this.updateUnidad({
            id: this.id,
            unidad: {
              nombre: this.nombre,
              siglas: this.siglas
            }
          })
            .then(res => {
              this.$emit("manage-unidad", "update");
            })
            .catch(err => {
              this.$emit("error-unidad", `no se pudo actualizar la unidad`);
            });
        }
        this.onClear();
      }
    },
    onClear() {
      this.$v.$reset();
      this.siglas = "";
      this.nombre = "";
      this.id = "";
      this.action = "create";
      this.$emit("clear");
    },
    checkActionAndData() {
      if (this.unidad__item) {
        this.action = "update";
        this.nombre = this.unidad__item.nombre;
        this.siglas = this.unidad__item.siglas;
        this.id = this.unidad__item.id;
      } else {
        this.action = "create";
        this.nombre = "";
        this.siglas = "";
        this.id = "";
      }
    }
  }
};
</script>

<style scoped>
.position-fixed {
  position: fixed;
}
@media screen and (max-width: 550px) {
  .position-fixed {
    position: relative;
  }
}
</style>