// imports configs
import { modulesConfig } from '@/security/config'
import rolesConfig from '@/security/roles';

/**
 * funcion encargada de obtener los modulos a los que el ROL tiene permisos  
 *  @return {Array} [modulos]
 */
export function getRolModuleAccess(userRol) {
    let accessModules = [] // listado de nombres de los modulos q puede acceder

    modulesConfig.forEach(module => {
        // validar si el rol existe e incluirlo en la lista module.name
        if (module.roles.find(rol => rol === userRol))
            accessModules.push({ descrip: module.name.toLowerCase() })

    })
    return accessModules
}

/**
 * 
 * @param {String} rol nombre del rol
 * @param {String} module modulo que se va a requerir los permisos
 * @returns {[{ name:String, descrip:String, not:Boolean, permisions:[] }]} el { `name:` nombre_ruta, `descrip:`  descripcion de la ruta, `not:` si es rol tiene acceso a la ruta, `permisions:` [persmisos sobre la ruta] }
 */
export function getPermisionsFromModule(rol, module) {

    const permisionsModule = modulesConfig.find(el => el.name === module.firstUpperCase())

    return permisionsModule.routers ? permisionsModule.routers.map(el => {
        const { name, descrip } = el
        const not = (el.hasOwnProperty('notRoles') && el.notRoles.find(notroles => notroles === rol))
            ? true
            : false
        const permisions = (el.hasOwnProperty('permisions'))
            ? el.permisions.hasOwnProperty(rol) ? el.permisions[rol] : ["sin permisos"]
            : []
        return { name, descrip, not, permisions }
    }) : 'all'
}

/**
 * Iniciar todas las rutas de forma dinamica pra todos los modulos de la 
 * app configurados en `@/roter/modulesConfig.json`
 * y asigna que roles tienen acceso a dichas rutas y cuales no
 * @returns {import("vue-router").RouteConfig[]} configuracion de las rutas
 */
export function initRouters() {
    let systemsRouter = []

    modulesConfig.forEach(oneModule => {

        let children = []
        let params_dashboard = ''
        if (oneModule.routers) {

            oneModule.routers.forEach(element => {

                // verificar posteriormente si es un string o un objeto con otro nivel mas de childrens
                children.push({
                    path: ELEMENT_Router.routersNamed(element) === "dashboard" ? '' : `${ELEMENT_Router.routersNamed(element).toLowerCase()}${ELEMENT_Router.configParams(element)}`,
                    name: `${oneModule.name.toLowerCase()}-${ELEMENT_Router.routersNamed(element).toLowerCase()}`,
                    component: () => import(`@/components/${oneModule.name}/Pages/${ELEMENT_Router.toUpperFirst(element)}.vue`),
                    props: element.props || {},
                    meta: {
                        requiresAuth: true,
                        // filtrado de los roles q pueden accedera a la ruta y se le eliminan los del [notRoles]
                        rolesAuthCan: oneModule.roles.filter(e => !ELEMENT_Router.notRoles(element).some(f => e === f))
                    }
                })

                //parametro para el dashboard /: 
                if (ELEMENT_Router.routersNamed(element) === "dashboard")
                    params_dashboard = ELEMENT_Router.configParams(element)
            })
        }
        systemsRouter.push({
            path: `/${oneModule.name.toLowerCase()}${params_dashboard}`,//${params_dashboard}
            component: () => import(`@/views/Module${oneModule.name}View.vue`),
            children,
            props: oneModule.props || {},
            meta: {
                requiresAuth: true,
                rolesAuthCan: oneModule.roles
            }
        })
    })
    return systemsRouter
}

/**
 * selecciona el modulo por defecto dentro del fichero de configuracion
 * @returns {string} nombre del modulo por defecto del ROl del **user**
 * @param {*} user que contiene el Rol para seleccionar el modulo
 */
export function gotodefaultModule(user) {
    const rol = rolesConfig.find(rol => rol.name === user.rol)
    return rol.default
}

export const ELEMENT_Router = {
    /**
     * @param {object | string}  route es la configuracion de una ruta  
     * @returns {string} retorna el nombre de la ruta
     */
    routersNamed(route) {
        if (typeof route === 'string')
            return route
        else
            return route.name

    },

    /**
     * @param {object | string}  target string o bojeto para convertir  
     * @returns {string} string con la inicial mayuscula ej: (Inicia, Primero, Retorno ...)
     */
    toUpperFirst(target) {

        if (typeof target === 'string')
            return target.firstUpperCase()//target.charAt().toLocaleUpperCase() + target.substring(1).toLocaleLowerCase()
        else
            return target.name.firstUpperCase()//target.name.charAt().toLocaleUpperCase() + target.name.substring(1).toLocaleLowerCase()

    },

    /**     
     * @param {object | string}  route es la configuracion de una ruta  
     * @returns {Array} retorna los roles que no tiene acceso a esta ruta
     */
    notRoles(route) {
        if (typeof route === 'string')
            return []
        else // verificar si existe atributo .norRoles y si no retornar [] vacio
            return route.hasOwnProperty('notRoles') ? route.notRoles : []

    },

    configParams(route) {
        if (typeof route === 'string')
            return ''
        else // verificar si existe atributo .params[] y si no retornar ''
            return route.hasOwnProperty('params') ? "/:" + route.params.join('/:') : ''
    }
}

export const make = {

    /**
     * crea las mutaciones dependiendo del tipo de **state** 
     * 
     * `object` -> CRUD (set | add | update | delete)
     * 
     * `number` -> set | increment | decrement
     *
     * `boolen` -> set | invert
     * 
     * `others` -> set
     * @param {{}} state estado de algun store 
     * @returns {{ setStateProperty: Function,
     * addStateProperty: Function, 
     * updateStateProperty: Function, 
     * deleteStateProperty: Function, 
     * incrementStateProperty: Function, 
     * decrementStateProperty: Function, 
     * invertStateProperty: Function, 
     * } Object de mutations dependiendo del tipo
     */
    mutations(state) {

        const keys_vales = Object.entries(state)
        let mutations = {}

        //recorrer state
        keys_vales.forEach(onekey => {
            // onekey[key, value]
            switch (typeof onekey[1]) {
                case 'object':// array and object and null
                    if (Array.isArray(onekey[1]))
                        Object.assign(mutations, this.mutationsCRUD(onekey[0]))
                    else { //para los {objets}
                        const keyCamelCase = this.keyToCamelCase(onekey[0])
                        Object.assign(mutations, {
                            [`set${keyCamelCase}`]: function (state, items) {
                                Object.assign(state[onekey[0]], { ...items })
                            }
                        })
                    }
                    break;
                case 'number':
                    Object.assign(mutations, this.mutationNumber(onekey[0]))
                    break;
                case 'boolean':
                    Object.assign(mutations, this.mutationBoolen(onekey[0]))
                    break;
                default: // 'string' and others -- only (set)
                    const keyCamelCase = this.keyToCamelCase(onekey[0])
                    Object.assign(mutations, {
                        [`set${keyCamelCase}`]: function (state, items) {
                            state[onekey[0]] = items
                        }
                    })
                    break;
            }
        })
        return mutations

    },

    /**
     * Creación de las 4 mutaciones que representan el **CRUD** de un *state*,
     * del stado que representa el key, con el formato  `(set | add | update | delete)KeyName`
     *Ej. `list__actions` -> setListActions(), addListActions(), updateListActions(), deleteListActions()
     * @param {String} key_state key del state representa un (Objeto | Array) 
     * @returns {{setKeyName(),addKeyName(),updateKeyName(),deleteKeyName()}} mutaciones para la key
     */
    mutationsCRUD(keyValue) {
        // formatear el nombre de la key (__) a kamelCase
        const keyCamelCase = this.keyToCamelCase(keyValue)

        // crear CRUD por cada key
        return {
            [`set${keyCamelCase}`]: function (state, items) {
                state[keyValue] = items
            }
            ,

            [`add${keyCamelCase}`]: function (state, item) {
                state[keyValue].push(item)
            }
            ,

            [`update${keyCamelCase}`]: function (state, item) {
                Object.assign(state[keyValue].find(el => el.id == item.id), item.data);
            }
            ,

            [`delete${keyCamelCase}`]: function (state, item) {
                state[keyValue].splice(state[keyValue].findIndex(el => el.id == item.id), 1);
            }
        }
    },

    /**
     * Creación de las mutaciones (set | increment | decrement)KeyName de un *state*,
     *Ej. `count` -> setCount(), incrementCount(), decrementCount()
     * @param {String} key_state key del state representa un (Number) 
     * @returns {{setKeyName(),incrementKeyName(),decrementKeyName()}} mutaciones para la key
     */
    mutationNumber(keyValue) {
        // formatear el nombre de la key (__) a kamelCase
        const keyCamelCase = this.keyToCamelCase(keyValue)

        // crear y retornar (set | increment | decrement)
        return {
            [`set${keyCamelCase}`]: function (state, value) {
                state[keyValue] = value
            },
            [`increment${keyCamelCase}`]: function (state, cant = 1) {
                state[keyValue] += cant
            },
            [`decrement${keyCamelCase}`]: function (state, cant = 1) {
                state[keyValue] -= cant
            }
        }
    },

    /**
     * Creación de las mutaciones (set | invert )KeyName de un *state*,
     *Ej. `isDown` -> setIsDown(), invertIsDown
     * @param {String} key_state key del state representa un (Boolean) 
     * @returns {{setKeyName(),invertKeyName(),decrementKeyName()}} mutaciones para la key
     */
    mutationBoolen(keyValue) {
        // formatear el nombre de la key (__) a kamelCase
        const keyCamelCase = this.keyToCamelCase(keyValue)

        // crear y retornar (set | invert)
        return {
            [`set${keyCamelCase}`]: function (state, value) {
                state[keyValue] = value
            },
            [`invert${keyCamelCase}`]: function (state) {
                state[keyValue] = !state[keyValue]
            }
        }
    },

    /**
     * formatear el nombre de la keyValue a camelCase, eliminando (_)
     * @param {String} keyValue key del store
     */
    keyToCamelCase(keyValue) {
        // formatear el nombre de la key (__) a camelCase
        return keyValue.split('_').filter(el => !!el).map(el => el.firstUpperCase()).join('')
    }
}