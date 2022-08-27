<template>
  <v-footer padless>
    <v-col
      class="text-center"
      cols="12"
    >
       {{vst_version}} <strong>- Vue Security Tool</strong>
    </v-col>
  </v-footer>
</template>
<script>

import {VST_VERSION} from '@/security/config';
export default {
  data: ()=>({
    vst_version : VST_VERSION
  })
}
</script>