import axios from 'axios'
import { make } from '@/security/utils';

const state = {
    list__unidades: [],
    list__cargos: [],
    list__users: []
}

const mutations = {
    ...make.mutations(state)
}

// ************** Actions ******************
const actions = {

    // ---------- CRUD Unidad ------------

    loadUnidades({ commit }) {
        axios.get('/unidad')
            .then(res => {
                commit('setListUnidades', res.data)
            })
    },
    addUnidad({ commit }, unidad) {
        return new Promise(async (resolve, reject) => {
            const data = await axios.post("/unidad", unidad)
            commit('addListUnidades', data.data)
            resolve(data)
        })
    },
    updateUnidad({ commit }, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.put(`/unidad/${data.id}`, data.unidad)
                if (res.data) {
                    commit('updateListUnidades', { id: data.id, data: data.unidad })
                    resolve(data)
                }
            } catch (error) {
                reject()
            }
        })
    },
    actionDeleteUnidad({ commit }, unidad) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.delete(`/unidad/${unidad.id}`)
                commit('deleteListUnidades', unidad)
                resolve(res.data)
            } catch (error) {
                reject(error.response.data.msg || `Error interno`)
            }
        })
    },

    // ---------- CRUD Cargo -------------

    loadCargos({ commit }) {
        axios.get('/cargo')
            .then(res => {

                commit('setListCargos', res.data)
            })
    },
    actionAddcargo({ commit }, cargo) {
        return new Promise(async (resolve, reject) => {
            const data = await axios.post("/cargo", cargo)
            commit('addListCargos', data.data)
            resolve(data)
        })
    },
    actionUpdateCargos({ commit }, data) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.put(`/cargo/${data.id}`, data.cargo)
                if (res.data) {
                    commit('updateListCargos', { id: data.id, data: data.cargo })
                    resolve(data)
                }
            } catch (error) {
                reject()
            }
        })
    },
    actionDeleteCargos({ commit }, cargo) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.delete(`/cargo/${cargo.id}`)
                commit('deleteListCargos', cargo)
                resolve(res.data)
            } catch (error) {
                reject(error.response.data.msg || `Error interno`)
            }
        })
    },

    // ---------- CRUD Users -------------

    loadUsers({ commit }) {
        axios.get('/userSystem')
            .then(res => {
                commit('setListUsers', res.data)
            })
    },
}

// ************** Gerrters ******************

const getters = {
    orderUnidades(state) {
        return state.list__unidades
            .sort((one, two) => one.siglas.toLowerCase() > two.siglas.toLowerCase() ? 1 : -1)
    },
    orderCargos(state) {
        return state.list__cargos
            .sort((one, two) => one.nombre.toLowerCase() > two.nombre.toLowerCase() ? 1 : -1)
    },
    isLoadingUsers(state) {
        return state.list__users.length > 0 ? true : false
    }
}
export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}