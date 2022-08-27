import { gotodefaultModule } from "@/security/utils";
import auth from "@/security/auth";
import { APP_NAME } from "@/security/config";
import { mapMutations } from 'vuex';
// *************** CASL **********************\\
import { ability } from "@/security/abilitys";
/**
 * Para que **RootView** funcione correctamente:
 * 1- se debe utilizar este securityMixin para controlar el flujo de loggin de los usuarios
 * 2- el HTML del componente se puede modificar siempre que cumpla:
 *    >> *de manera obligatoria* -> un formulario que contenga el la propiedad (ref="form") 
 *                             -> el formulario contenga 2 campos con `v-model="user.user"` y `v-model="user.password"`
 *                             -> y un submit con la propiedad `@click="onLogin()"`
 * 
 *    >> *de forma opcional*     -> overlay = boolean, para mostrar algun tipo de loading...
 *                             -> error = boolean, para controlar los errores de autenticacion
 *                             -> app_name = String, para mostrar el nombe de Sistema , @/security/config--APP_NAME
 *  
 */
export default {
    data: () => ({
        app_name: '',
        show_pass: false,
        overlay: false,
        user: {
            password: "",
            user: ""
        },
        rules: {
            required: value => !!value || "Obligatorio",
            user_string: v =>
                /^[A-Za-z0-9_]+$/.test(v) || "Solo debe contener (letras, números y _ )"
        }
    }),
    mounted() {
        this.app_name = APP_NAME
    },
    methods: {
        ...mapMutations(['showNotify']),
        /**
         * verificar las credenciales del **Usuario** y ejecuta la Promise
         * dependiendo del resultado se registran los datos y
         * se abre el modulo por defecto del Rol perteneciente a el user
         */
        onLogin() {
            if (this.$refs.form.validate()) {
                this.overlay = true;
                this.$store.dispatch("getUserDatas", this.user)
                    .then(response => {
                        this.overlay = false;
                        if (response) {
                            auth.loggin(this.$store.state.currentUser);
                            this.$ability.update(ability(this.$store.state.currentUser.rol));
                            this.$router
                                .push({
                                    path: gotodefaultModule(
                                        this.$store.state.currentUser
                                    ).toLowerCase()
                                })
                                .catch(err => {
                                    console.log(
                                        `%c es posible que el Rol ${this.$store.state.currentUser.rol} no este asignado dentro de los valor 'roles':[] -> de el/los modulo/s que tiene acceso`,
                                        "color: yellow; font-style: italic; background-color: blue;padding: 2px"
                                    );
                                    alert(
                                        "problemas de Configuración del Sistema. Contacte al adminsitrador"
                                    );
                                });
                        } else this.showNotify({ msg: 'Acceso denegado. Credenciales incorrectas...', color: "error" })
                    });
            }
        }
    }
}