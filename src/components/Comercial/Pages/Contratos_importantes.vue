<template>
    <div>
      <h1>Contratos Importantes</h1>
      <v-btn v-if="$can('create',$router.currentRoute.path)" class="ml-2" color="success">add</v-btn>
      <v-btn v-if="$can('update',$router.currentRoute.path)" class="ml-2" color="warning">update</v-btn>
      <v-btn v-if="$can('delete',$router.currentRoute.path)" class="ml-2" color="error">delete</v-btn>
      <v-btn v-if="$can('aprobar',$router.currentRoute.path)" class="ml-2" >aprobar</v-btn>
      <p> {{ $router.params }}</p>
  </div>
</template>

<script>
export default {
    name:'contratos_importantes',
    mounted(){
      console.log(this);
    }
}
</script>