<template>
  <v-toolbar-items>
    <v-menu offset-y open-on-hover v-for="(menu_item,menu_key) in menus" :key="menu_key">
      <!--open-on-hover-->
      <template v-slot:activator="{ on }">
        <v-btn text class="text-capitalize subtitle-1 font-weight-light px-3" v-on="on">
          {{menu_item.name}}
          <v-icon>mdi-menu-down</v-icon>
        </v-btn>
      </template>
      <!-- Menu desplegable - Lista -->
      <v-sheet v-if="menu_item.custom">
        <!-- si es un componente personalizado hijo renderizarlo -->
        <component :is="menu_item.config.name"></component>
      </v-sheet>
      <v-list dense shaped v-else>
        <v-list-item
          v-for="(router_item, router_key) in getListInterval(menu_item.config)"
          :key="router_key"
          @click="goto(router_item.name)"
        >
          <v-list-item-content>
            <v-list-item-title>
              <v-icon small>mdi-menu-right-outline</v-icon>
              {{router_item.descrip}}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-toolbar-items>
</template>
<script>
export default {
  data: () => ({
    routers: []
  }),
  props: ["menus", "module_name"],
  async mounted() {
    const imp = await import(`@/security/modules_config/${this.module_name}`);
    this.routers = imp.default.routers.filter(el => el.name !== "dashboard");
  },
  beforeMount() {
    // crear los componentes personalizados en el listado de componentes hijos
    this.menus.forEach(element => {
      if (element.custom) {
        this.$options.components[element.config.name] =
          element.config.default || element.config;
      }
    });
  },
  methods: {
    goto(link) {
      this.$router
        .push({
          path: `/${this.module_name.toLowerCase()}/${link.toLowerCase()}`
        })
        .catch(err => {
          console.log("Misma navegacion");
        });
    },

    /**
     * @param config[] configuracion del menu
     * @returns {[]} lista de rutas en el intervalo de la @param confgi
     */
    getListInterval(config) {
      let [start, end] = config;

      if (typeof start === "string")
        start = this.routers.findIndex(el => el.name === start) + 1;

      if (typeof end === "string")
        end = this.routers.findIndex(el => el.name === end) + 1;

      return this.routers
        .slice(start - 1, end)
        .filter(el =>
          this.$can("read", `/${this.module_name.toLowerCase()}/${el.name}`)
        );
    }
  }
};
</script>