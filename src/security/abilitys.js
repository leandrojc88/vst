//este configuracion nse cree al loggearse el ususario
import { getRolModuleAccess } from '@/security/utils'
import { modulesConfig } from "./config";
import { ELEMENT_Router } from '@/security/utils'

/**
 * config del CASL(Ability) para los persmisos del @param{ rol }, en dependencia de las rutas con sus
 * respectivos permisos configurados
 * @param {*} rol  
 * @returns {import('@casl/ability').Rule[]} configuracion de las reglas
 * 
 * `{ subject: 'router_path|all', actions: [ manage|create|read|update|delete] },`
 *  
 * `{ subject: 'router_path|all', actions: [ manage|create|read|update|delete], inverted: true },`
 */
export const ability = rol => {

    const modulos = getRolModuleAccess(rol)
    let rules = []

    modulesConfig.forEach(oneModule => {//buscando los modulos q el rol puede acceder
        if (modulos.some(mod => mod.descrip === oneModule.name.toLowerCase())) {

            //estructurando los permisos del rol dentro de las rutas
            if (oneModule.routers)
                oneModule.routers.forEach(route => {
                    const route_subject = `/${oneModule.name}/${ELEMENT_Router.routersNamed(route)}`.toLocaleLowerCase()
                    if (route.hasOwnProperty('permisions')) {
                        //si esta definido el permiso para el rol
                        if (route.permisions.hasOwnProperty(rol)) {
                            rules.push({
                                subject: route_subject,
                                actions: route.permisions[rol]
                            })
                        } else // estan definidos los permisos en la config pero no para el rol, asi que no tiene -ningun- privilegio
                            rules.push({
                                subject: route_subject,
                                actions: 'manage',
                                inverted: true // hace que sea lo contrario de la regla definida (en este caso que no tenga privilegio alguno)
                            })
                    }// se le dan todos los permisos para la ruta, pq no tiene ninguina config de `permisions`
                    else
                        rules.push({
                            subject: route_subject,
                            actions: 'manage'
                        })

                })
        }
    })

    return rules
    // return new Ability(rules)
}