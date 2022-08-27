<template>
  <v-sheet height="100vh" class="d-flex align-center">
    <!-- <img alt="Vue logo" src="../assets/logo.png">-->
    <v-card class="mx-auto elevation-3" width="350">
      <v-form ref="form">
        <v-card-title primary-title class="display-1 justify-center mb-12">
          <span style="color: var(--v-primary-base); font-weight: 600;">{{app_name}}</span>
          <v-avatar color="white" class="justify-center float-account" size="95">
            <img
              alt="Vue logo"
              src="@/assets/account.svg"
              style="border: 6px #c1c1c1 double !important;"
            />
          </v-avatar>
        </v-card-title>

        <v-divider class="mx-1"></v-divider>
        <v-card-text class="mb-12">
          <v-text-field
            prepend-inner-icon="mdi-account"
            class="mt-12"
            :rules="[rules.user_string, rules.required]"
            name="user"
            label="Usuario"
            id="user"
            v-model="user.user"
          ></v-text-field>
          <v-text-field
            prepend-inner-icon="mdi-lock"
            :append-icon="show_pass ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show_pass ? 'text' : 'password'"
            :rules="[rules.required]"
            name="pass"
            label="Contraseña"
            id="pass"
            v-model="user.password"
            @click:append="show_pass = !show_pass"
            @keypress.enter="onLogin"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" block @click="onLogin()">Entrar</v-btn>
        </v-card-actions>
        <p class="caption pl-3">
          Olvido la contraseña ? contacte con el
          <a href="#">Adminstrador</a>
        </p>
      </v-form>
    </v-card>

    <!-- CARGANDO... -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-sheet>
</template>

<script>
/**
 * Para que **RootView** funcione correctamente:
 * 1- se debe utilizar el securityMixin para controlar el flujo de loggin de los usuarios
 * 2- el HTML del componente se puede modificar siempre que cumpla:
 *    >> de manera obligatoria -> un formulario que contenga el la propiedad (ref="form") 
 *                             -> el formulario contenga 2 campos con `v-model="user.user"` y `v-model="user.password"`
 *                             -> y un submit con la propiedad `@click="onLogin()"`
 * 
 *    >> de forma opcional     -> overlay = boolean, para mostrar algun tipo de loading...
 *                             -> error = boolean, para controlar los errores de autenticacion
 *                             -> app_name = String, para mostrar el nombe de Sistema , @/security/config--APP_NAME
 *  
 */
import securityMixin from "@/security/mixins/logginMixin";

export default {
  name: "RootView",
  mixins: [securityMixin]
};
</script>
<style scoped>
.float-account {
  position: absolute;
  top: 4.5rem;
  border: 2rem !important;
}
</style>
