import Vue from 'vue'
import Vuex from 'vuex'
import auth from '../security/auth'
import rolesConfig from '../security/roles';
import axios from 'axios';

// Modules
import admin from './modules/admin';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { admin, app },
  state: {
    currentUser: {},
    notify: {
      visible: false,
      msg: '...',
      color: 'success',
      time: 2000
    },
  },
  mutations: {
    setCurrentUser(state, userdata) {
      Object.assign(state.currentUser, { ...userdata })
    },
    /**
     * mutation para mostrar un `<v-snackbar>` con un mensaje
     * @param {*} state 
     * @param {{visible:boolean,msg:String,color:String,time:Number}} values - **Object** de configuracion para la
     * notificación
     */
    showNotify(state, values) {
      const notify = {
        visible: true,
        msg: values.msg || '...',
        color: values.color || 'success',
        time: values.time || 2000
      }
      Object.assign(state.notify, { ...notify })
    },
    closeNotify(state) {
      state.notify.visible = false
    },
  },
  actions: {
    /**
     * verifica los datos del usuario que intenta logearce o ya esta drento d la app y rellena los mismos en el 
     * objeto en la mutacion (setCurrentUser)
     * @returns {boolean} retorna `true` si es usuario se loguea de manera correcta
     * @param {} commit parametro de las acciones 
     * @param {*} user datos del usuario logeado
     */
    async getUserDatas({ commit }, user) {

      try {
        const data = await axios.post("/loggin", {
          user: user.user,
          pass: user.password
        })

        if (data.status >= 200 && data.status < 300) {
          const { user, full_name, rol, id, _token } = data.data
          const rolName = rolesConfig.find(el => el.id == rol).name
          commit('setCurrentUser', { user, full_name, id, _token, rol: rolName })
          return true;
        } else return false
      }
      catch (error) { // manejo del error desde la API
        console.log(error)
        return false
      }
    },
    /**
     * verifica si la la validez del usuario por el _token y carga los datos en el  
     * objeto en la mutacion (setCurrentUser)
     * @returns {boolean} retorna `true` si es usuario se loguea de manera correcta
     * @param {} commit parametro de las acciones 
     */
    async getUserDatasBy_Token({ commit }) {

      try {
        const { user, id } = auth.getUser()
        auth.registerHeadersTokenAxios()
        const data = await axios.post("/userSystem/getDataByToken", { user, id })
        if (data.status >= 200 && data.status < 300) {
          const { user, full_name, rol } = data.data
          const rolName = rolesConfig.find(el => el.id == rol).name
          commit('setCurrentUser', { user, full_name, id, rol: rolName })
          return true;
        } else return false
      }
      catch (error) { // manejo del error desde la API
        console.log(error)
        return false
      }
    }
  }
})
