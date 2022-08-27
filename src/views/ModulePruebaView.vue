<template>
  <v-app>
    <vst-banner title="Prueba" root_url="prueba" app>
      <!-- Slot add menu to toolbar -->
      <template>
        <router-link to="/prueba/ruta_prueba" class="white--text">ruta prueba</router-link>
      </template>
    </vst-banner>
    <v-content app>
      <router-view></router-view>
    </v-content>

    <vst-footer app></vst-footer>
  </v-app>
</template>
<script>

</script>