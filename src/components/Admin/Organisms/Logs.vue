<template>
  <!-- <v-sheet class="overflow-hidden" style="position: relative;"> -->
  <v-container fluid class="overflow-hidden" style="position: relative; min-height: 80vh;">
    <!-- Panel de Opciones -->
    <v-row>
      <v-col>
        <v-sheet class="d-flex">
          <v-btn small color="primary" outlined @click="changeOrder">
            <v-icon left>{{icon_order}}</v-icon>Ordenar
          </v-btn>
          <v-btn small class="ml-1" color="primary" outlined @click="expandAll()">
            <v-icon left>mdi-arrow-expand-all</v-icon>Expandir
          </v-btn>
          <v-btn small class="ml-1" color="primary" outlined @click="expands = []">
            <v-icon left>mdi-arrow-collapse-all</v-icon>Contraer
          </v-btn>
          <v-spacer></v-spacer>
          <v-badge :value="has_filters" color="red" offset-x="11" offset-y="11" overlap dot>
            <v-btn small color="primary" outlined @click="showFilters()">
              <v-icon left>mdi-filter-outline</v-icon>Filtros
            </v-btn>
          </v-badge>
          <v-btn small color="primary" class="ml-1" @click="init()">
            <v-icon left>mdi-find-replace</v-icon>Actualizar
          </v-btn>
        </v-sheet>
        <v-divider class="my-2"></v-divider>
      </v-col>
    </v-row>
    <!-- Listado de Historial -->
    <v-row>
      <v-col>
        <!-- Alerta Vacio -->
        <v-alert
          type="warning"
          dense
          border="left"
          v-if="!count_histry"
        >No hay datos para mostrar ... !</v-alert>
        <v-timeline dense>
          <v-timeline-item
            v-for="(item,index) in list_history"
            :color="getColorByAction(item.action)"
            :key="index"
            fill-dot
            :icon="getIconByAction(item.action)"
            icon-color="black"
            small
            class="pb-1"
          >
            <v-card>
              <v-card-title
                @click="expandAndContract(index)"
                class="py-2 pl-1 pr-2 d-flex body-2 justify-space-between mouse-hove"
              >
                <div>
                  <v-icon>mdi-music-accidental-sharp</v-icon>
                  {{item['id']}}
                  <v-icon title="Tabla" class="pl-5">mdi-table</v-icon>
                  {{item.table}}
                </div>
                <div>
                  <v-icon title="Usuario">mdi-account-outline</v-icon>
                  {{item.user.user}}
                </div>
                <div>
                  <v-icon title="Fecha">mdi-clock-outline</v-icon>
                  <!-- {{Date(item.moment).toLocaleString('en-gb', { hour12:true })}} -->
                  {{ (new Date(item.moment)).toLocaleString('en-gb', { timeZone: 'UTC',hour12:true }) }}
                </div>
              </v-card-title>
              <v-expand-transition>
                <div v-if="expands.some(el => el === index)">
                  <v-divider></v-divider>
                  <v-card-text v-if="item.action != 'Update'">
                    <template>
                      <v-data-table
                        elevation-5
                        dense
                        :headers="headers"
                        :items="action_doby(item.data)"
                        item-key="name"
                        class="elevation-1"
                        hide-default-footer
                      ></v-data-table>
                    </template>
                  </v-card-text>
                  <v-card-text v-else>
                    <template>
                      <v-data-table
                        elevation-5
                        dense
                        :headers="headersUpdate"
                        :items="action_dobyUpdate(item.data)"
                        item-key="name"
                        class="elevation-1"
                        hide-default-footer
                      ></v-data-table>
                    </template>
                  </v-card-text>
                </div>
              </v-expand-transition>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
    <!-- Paginacion -->
    <v-row>
      <v-pagination
        v-model="current_page"
        page="current_page"
        total-visible="10"
        :length="length"
        circle
      ></v-pagination>
    </v-row>

    <!-- Navigaton Drawer Laterar para los FILTROS -->
    <v-navigation-drawer height="85vh" width="370" v-model="drawer" absolute temporary>
      <v-card height="100%" class="d-flex flex-column">
        <v-card-title primary-title class="pa-0">
          <v-app-bar color="grey lighten-3" dense>
            <v-icon left>mdi-filter-outline</v-icon>
            <v-card-title primary-title class="px-2">Filtros</v-card-title>
            <v-spacer></v-spacer>
            <v-btn text small color="error" @click="clearAllFilters()" outlined>
              <v-icon>mdi-broom</v-icon>Limpiar
            </v-btn>
          </v-app-bar>
        </v-card-title>
        <v-card-text primary-title class="px-1">
          <!-- Listado de Acciones -->
          <v-form ref="form">
            <v-combobox
              v-model="filter_action"
              :items="list_actions"
              item-text="es"
              label="Acciones"
              multiple
            >
              <template v-slot:selection="data">
                <v-chip
                  class="px-2"
                  :key="JSON.stringify(data.item)"
                  v-bind="data.attrs"
                  outlined
                  :input-value="data.selected"
                  :disabled="data.disabled"
                  @click:close="data.parent.selectItem(data.item)"
                >
                  <v-avatar :color="data.item.color" left>
                    <v-icon size="16" color="black">{{data.item.icon}}</v-icon>
                  </v-avatar>
                  {{ data.item.es }}
                </v-chip>
              </template>
            </v-combobox>

            <!-- Piker de Fechas -->
            <v-menu
              ref="menu"
              v-model="date_piker"
              :close-on-content-click="false"
              :return-value.sync="date_piker"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field :value="seeDates" label="Rango de Fecha" readonly v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="filter_dates" range locale="es-es">
                <v-btn small text color="error" @click="clearDate()" outlined>
                  <v-icon>mdi-broom</v-icon>Limpiar
                </v-btn>
                <v-btn small text @click="date_piker = false">Cancelar</v-btn>
                <v-btn small text color="primary" @click="$refs.menu.save(date_piker)">OK</v-btn>
              </v-date-picker>
            </v-menu>

            <!-- Lista de Users -->
            <v-select
              v-model="filter_user"
              :items="list__users"
              item-text="user"
              item-value="id"
              label="Usuario"
              :menu-props="{ overflowY: true, 'offset-y' : true }"
              clearable
            ></v-select>
            <!-- Lista de Tablas -->
            <v-select
              clearable
              :menu-props="{ overflowY: true, 'offset-y' : true }"
              label="Tablas"
              v-model="filter_table"
              :items="list_tables"
              item-text="table"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-spacer></v-spacer>
      </v-card>
    </v-navigation-drawer>
  </v-container>
</template>
 <script>
import auth from "@/security/auth";
import { mapState } from "vuex";
export default {
  name: "Logs",
  data: () => ({
    order: "desc",
    list_history: [],
    list_tables: [],
    expands: [],
    filter_dates: [],
    drawer: false,
    cant_to_show: 30,
    current_page: 1,
    count_histry: 0,
    date_piker: false,
    filter_action: [],
    filter_user: "",
    filter_table: "",
    dont_show: ["createdAt", "deletedAt", "updatedAt"],
    headers: [
      { text: "Campo", value: "campo", sortable: false, class: "blue" },
      { text: "Valor", value: "valor", sortable: false, class: "blue" }
    ],
    headersUpdate: [
      { text: "Campo", value: "campo", sortable: false, class: "blue" },
      { text: "Valor", value: "valor", sortable: false, class: "blue" },
      {
        text: "Nuevo Valor",
        value: "valor_updated",
        sortable: false,
        class: "blue"
      }
    ],
    list_actions: [
      {
        name: "Insert",
        es: "Adicionar",
        color: "success",
        icon: "mdi-plus-thick"
      },
      {
        name: "Update",
        es: "Actualizar",
        color: "warning",
        icon: "mdi-pencil"
      },
      { name: "Delete", es: "Eliminar", color: "error", icon: "mdi-delete" }
    ]
  }),

  //****************************   Watchers *********************************/
  watch: {
    current_page(val) {
      this.getDataPaginated();
    }
  },

  //****************************   Computed *********************************/
  computed: {
    ...mapState('admin',['list__users']),
    icon_order() {
      return this.order === "desc"
        ? "mdi-sort-descending"
        : "mdi-sort-ascending";
    },
    length() {
      return Math.ceil(this.count_histry / this.cant_to_show);
    },
    seeDates() {
      return this.filter_dates.join(" al ");
    },
    has_filters() {
      if (this.filter_action.length) return true;
      else if (this.filter_dates.length) return true;
      else if (this.filter_user) return true;
      else if (this.filter_table) return true;
      else return false;
    },
    filters() {
      // console.log(this.filter_action,this.filter_dates,this.filter_user,this.filter_table);
      let filter = {};
      filter.actions = this.filter_action.length
        ? this.filter_action.map(el => el.name)
        : [];

      if (this.filter_dates.length === 1)
        this.filter_dates.push(this.filter_dates[0]);

      filter.dates = this.filter_dates.length ? this.filter_dates : [];
      filter.user = this.filter_user;
      filter.table = this.filter_table;
      return filter;
    }
  },

  //****************************   Hoocks *********************************/
  mounted() {
    this.init();
  },

  //****************************   Methods *********************************/
  methods: {
    changeOrder() {
      this.order = this.order === "desc" ? "asc" : "desc";
      this.init();
    },
    getColorByAction(action) {
      return this.list_actions.find(el => el.name === action).color;
    },
    getIconByAction(action) {
      return this.list_actions.find(el => el.name === action).icon;
    },
    /**
     * @returns {Array} arreglo de objetos {campo, valor} con los campos del historial para INSERTAR y ELIMINAR
     */
    action_doby(data) {
      const objeto = [];
      Object.entries(data).map(el => {
        if (!this.dont_show.some(dc => dc === el[0]))
          objeto.push({
            campo: el[0],
            valor: typeof el[1] === "object" ? JSON.stringify(el[1]) : el[1]
          });
      });
      return objeto;
    },
    /**
     * @returns {Array} arreglo de objetos {campo, valor, valor_updated} con los campos del historial para UPDATE
     */
    action_dobyUpdate(data) {
      const objeto = [];
      Object.entries(data.toChangeData).map(el => {
        if (!this.dont_show.some(dc => dc === el[0]))
          objeto.push({
            campo: el[0],
            valor: typeof el[1] === "object" ? JSON.stringify(el[1]) : el[1]
          });
      });
      objeto.map(el => {
        el.valor_updated = data.changeData.hasOwnProperty(el.campo)
          ? data.changeData[el.campo]
          : "";
      });
      return objeto;
    },
    expandAndContract(index) {
      if (this.expands.some(el => el === index)) {
        const ind = this.expands.indexOf(index);
        this.expands.splice(ind, 1);
      } else this.expands.push(index);
    },

    async getDataPaginated() {
      const offset = this.cant_to_show * (this.current_page - 1);
      const res = await this.axios.get(
        `/historySystem/${offset}/${this.cant_to_show}/${
          this.order
        }/${JSON.stringify(this.filters)}`
      );
      this.list_history = res.data;
    },
    async init() {
      this.current_page = 1;
      this.getDataPaginated();
      const res = await this.axios.get(
        `/historySystem/count/${JSON.stringify(this.filters)}`
      );
      this.count_histry = res.data;
    },
    expandAll() {
      for (let index = 0; index < this.cant_to_show; index++) {
        this.expands.push(index);
      }
    },
    clearDate() {
      this.filter_dates = [];
      this.date_piker = false;
    },
    clearAllFilters() {
      this.$refs.form.reset();
      this.filter_dates = [];
    },
    async showFilters() {
      this.drawer = !this.drawer;
      const res = await this.axios.get(`/historySystemTables`);
      this.list_tables = res.data;
    }
  }
};
</script>
<style>
.mouse-hove {
  cursor: pointer;
}
</style>