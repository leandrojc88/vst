import axios from 'axios';
import { instanceAxios } from '../main';
export const CURREN_USER = 'currentUser'

export default {
    /**
     * loggin del usuario en la app y guarda los valores del {id, user, full_name, _token}
     * en el localStores(currentUser), el rol se recupera posteriormente por cuestiones de seguridad
     */
    loggin(user) {
        const currentUser = {
            id: user.id,
            user: user.user,
            full_name: user.full_name,
            _token: user._token
        }
        localStorage.setItem(CURREN_USER, JSON.stringify(currentUser))
        this.registerHeadersTokenAxios()
    },

    /**
     * elimina los datos del localStore(currentUser)
     * 
     * `y posteriormente algunos datos extra del usuario`
     */
    logout() {
        localStorage.removeItem(CURREN_USER)
        this.unRegisterHeadersTokenAxios()
    },

    /**
     * @returns {boolean} si existe algun usuario del tipo que sea loggeado en la app,
     * mediante la validacion del !!localStore(currentUser)
     */
    loggedIn() {
        return !!localStorage.currentUser
    },
    getUser() {
        const user = JSON.parse(localStorage.getItem(CURREN_USER))
        return user
    },
    getToken() {
        const user = JSON.parse(localStorage.getItem(CURREN_USER))
        return user._token
    },

    /**
     * @returns {Object} la configuracion de los Headers necesarias para enviar el _token a la API
     */
    getHeaders() {
        return {
            headers: {
                'access-token': this.getToken()
            }
        }
    },
    registerHeadersTokenAxios() {
        axios.defaults.headers.common['access-token'] = this.getToken()        
    },
    unRegisterHeadersTokenAxios() {
        axios.defaults.headers.common['access-token'] = ''
    }
}