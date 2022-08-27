<template>
  <v-app>
    <vst-banner title="Comercial" root_url="Comercial" app>
      <!-- Slot add menu to toolbar -->
      <vst-modules-menu-items :menus="menus" module_name="Comercial" />
    </vst-banner>

    <v-content app>
      <router-view></router-view>
    </v-content>

    <vst-footer app></vst-footer>
  </v-app>
</template>

<script>
import Vue from "vue";
// import menuItems from "../components/Comercial/Organisms/MenuItems";

export default {
  name: "ModuleComercialView",
  data: () => ({
    menus: [
      { name: "Comercialización", config: [1, 5] },
      /* {
        name: "Personalizado",
        config: menuItems,
        custom: true
      }, */
      { name: "Ordenes", config: ["contratos_importantes", "producto"] }
    ]
  })
};

      /* {
        name: "Ordenes",
        config: {
          name: "toma",
          render: function (h){  h('div',this.$slots.defoult) }
        },
        custom: true
      }, */
</script>