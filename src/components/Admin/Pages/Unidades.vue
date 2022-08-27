<template>
  <v-container fluid>
    <v-row no-gutters>
      <!-- FROM de Unidades -->
      <v-col sm="auto" xs="12" class="d-flex justify-center">
        <v-sheet min-width="300" width="300">
          <manageUnidades
            v-on:manage-unidad="evtManageUnidad"
            v-on:error-unidad="evtError"
            v-on:clear="unidad__item = null"
            :icon__bar="icons.iconUnidad"
            title__bar="Unidades"
            :unidad__item="unidad__item"
          ></manageUnidades>
          <v-btn
            class="mt-1 hidden-sm-and-up"
            small
            fab
            bottom
            right
            fixed
            color="info"
            @click="$vuetify.goTo(0, options)"
          >
            <v-icon>mdi-chevron-up</v-icon>
          </v-btn>
        </v-sheet>
      </v-col>

      <!-- Data - Unidaddes -->

      <v-col class="pa-0">
        <v-container class="pa-0">
          <v-row no-gutters class="pa-0 justify-center">
            <v-col cols="auto" v-for="(item,index) in lista__unidades" :key="index">
              <v-card class="ma-1 d-flex flex-column elevation-3" width="219" height="235">
                <v-sheet
                  height="112"
                  min-height="112"
                  class="grey lighten-2 d-flex flex-column justify-end unborde-down"
                >
                  <div class="d-flex">
                    <v-img
                      width="66"
                      height="56"
                      class="withe--text"
                      contain
                      :src="icons.iconUnidad"
                    ></v-img>
                  </div>
                  <v-card-title class="text-uppercase py-1 pl-2">{{item.siglas}}</v-card-title>
                </v-sheet>
                <v-card-text class="pa-1 text-capitalize">{{item.nombre}}</v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions class="pa-0 mb-2 mr-2">
                  <v-spacer></v-spacer>
                  <v-btn
                    :outlined="outline__edit(item.id)"
                    :dark="!outline__edit(item.id)"
                    fab
                    small
                    color="grey darken-3"
                    @click="editUnidad(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn outlined fab small color="error" @click="deleteUnidad(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>

    <!-- Dialogo de confirmacion de ELIMINAR -->
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-btn class="ma-3 mt-6" outlined @click="sheet = false">Cancelar</v-btn>
        <v-btn class="ma-3 mt-6" dark color="red" @click="removeItem()">Confirmar</v-btn>
        <div class="py-3">
          Seguro que desea eliminar la Unidad
          <span style="color: red; font-weight: 600;">{{siglas}}</span> ?
        </div>
      </v-sheet>
    </v-bottom-sheet>

    <!-- CARGANDO... -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import * as easings from "vuetify/es5/services/goto/easing-patterns";
import iconUnidad from "@/assets/Unidad.png";
import manageUnidades from "@/components/Admin/Molecules/ManageUnidades";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  components: {
    manageUnidades
  },
  data: () => ({
    overlay: false,
    sheet: false,
    icons: {
      iconUnidad
    },
    options: {
      duration: 200,
      easing: "easeInOutCubic"
    },
    unidad__item: null,
    unidad__delete: null
  }),
  // ------------------------ Hoocks ------------------------

  // ------------------------ Computed ------------------------

  computed: {
    siglas() {
      return this.unidad__delete ? this.unidad__delete.siglas : "";
    },
    ...mapGetters("admin", {
      lista__unidades: "orderUnidades"
    })
  },
  // ------------------------ Methods ------------------------

  methods: {
    ...mapActions("admin", ["actionDeleteUnidad"]),
    ...mapMutations(["showNotify"]),
    outline__edit(id) {
      return !(this.unidad__item && this.unidad__item.id === id);
    },
    evtManageUnidad(event) {
      if (event === "add") {
        this.showNotify({ msg: "Unidad Creada satisfactoriamente" });
      } else {
        this.showNotify({ msg: "Unidad Actualizada satisfactoriamente" });
      }
    },
    evtError(event) {
      this.showNotify({ msg: `Error : ${event}`, color: "error" });
    },
    editUnidad(item) {
      this.unidad__item = item;
    },
    deleteUnidad(item) {
      this.unidad__item = null;
      this.sheet = true;
      this.unidad__delete = item;
    },
    removeItem() {
      this.overlay = true;
      this.sheet = false;
      this.actionDeleteUnidad(this.unidad__delete)
        .then(res => {
          this.showNotify({
            msg: `Eliminada la unidad ${this.unidad__delete.siglas}`
          });
          this.overlay = false;
        })
        .catch(err => {
          this.overlay = false;
          this.showNotify({ msg: `Error : ${err}`, color: "error" });
        });
    }
  }
};
</script>

<style scoped>
.unborde-down {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
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