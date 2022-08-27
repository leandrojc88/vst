import Vue from 'vue'
import VueRouter from 'vue-router'
import RootView from "../views/RootView.vue";
import { initRouters } from '@/security/utils';
import auth from '@/security/auth'
import store from '@/store'
// *************** CASL **********************\\
import { ability } from "@/security/abilitys";
import vm from '@/main'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: RootView,
    meta: { requiresAuth: false }
  },
  // generar rutas desde la configuracion inicial
  ...initRouters(),
  {
    path: '*',
    name: '404',
    component: () => import('@/components/Base/Pages/Page404.vue'),
    meta: { requiresAuth: false }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

/**
 *  middleware que verifica si se tiene acceso a la ruta
 *  primero - que la ruta @param to y sus hijas cumplan con la condicion `requireAuth`:boolean
 *  segundo - que el rol del ususario autenticado este dentro de la lista de `rolesAuthCan`:[]
 * */
router.beforeEach((to, from, next) => {

  // manejo de error en modo __DEV__ para una `$router.push({name:router_name})` donde router_name no existe
  if (!to.matched.length) {
    console.error('LA RUTA NO EXISTE');
    console.log(`%c verifique que ... $router.push({path: ${to.name}}) coincida con alguna ruta en security/configs_modules/*.js`, "color: yellow; font-style: italic; background-color: blue;padding: 2px");
    console.log(`%c en caso de Encontrarse en la Paguina de Inicio de ceccion verifique que exista la configuracion del modulo <b>security/configs_modules/${to.name}.js`, "color: yellow; font-style: italic; background-color: blue;padding: 2px");
    alert(
      "problemas de Configuración del Sistema. Contacte al adminsitrador"
    );
  }

  if (to.matched.some(record => record.meta.requiresAuth)) {

    /**
     * Verificar si el rol del usuario se encuentra dentro del listado de roles con permisos a la ruta
     * sino redireccionarlo al HOME(/)
     */
    const getRolToNext = () => {
      if (to.meta.rolesAuthCan.find(el => store.state.currentUser.rol === el)) {
        return next()
      }
      else {
        return next({
          path: '/',
          query: { redirect: to.fullPath }
        })
      }
    }

    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!auth.loggedIn()) {
      next({
        path: '/',
        query: { redirect: "loggedIn" }
      })
    } else {
      //si esta autenticado. Ahora verificamos si el rol tiene permiso a acceder
      // en caso de que no este el usuario en el store lo carga desde el backend    
      if (store.state.currentUser.hasOwnProperty('rol'))
        getRolToNext()
      else {
        store.dispatch("getUserDatasBy_Token")
          .then(resp => {
            // al recargar los datos se reasigna las abilidades del Usuario
            vm.$ability.update(ability(store.state.currentUser.rol));
            getRolToNext()
          })
      }
    }
  } else if (to.matched.length) {
    next()
  }
})

export default router
