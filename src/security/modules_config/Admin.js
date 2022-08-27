// importacion de los roles que tienen acceso al modulo
/** Configuraciones del los modulos
 * se cargan todos los ficheros .json en una sola variable
 * @returns {Array} 
 * estructura de los .json de modules_config/*.json
 *         --> ** ( propiedades obligatorias para el corecto funcionamiento... )
 * {
    "name": "Admin",                          --> ** nombre del modulo
    "roles": [ R_ADMIN.name,R_COMERCIAL.name] --> ** [] roles que tiene permiso de acceso al modulo
    "routes": [                               --> ** [childrens] rutas que componen el modulo
        "dashboard_comercial",                   --> String - define el nombre del modulo sin restricciones
        {                                        --> Objeto - se define una configuracion para la ruta
            "name": "contratos_importantes",        --> ** nombre de la ruta
            "descrip": "descripcion para mostrar",  --> ** descripcion que se modtrara en el panel de administracion
            "params" : ["params_name"],             --> parametros de la ruta ej: (path: '/ruta/:params_name')
            "chieldrens": [],                       --> rutas hijas del componente o ruta 
            "notRoles": ["Comercial"],              --> de rolos:[] del modulo cuales no tiene acceso a esta ruta
            "permisions":[{                         --> config del contructor de CASL[] para las funcionalidades
                [R_ADMIN.name]: [                      Objero donde las `propiedades` son los nombre_roles ej.R_ADMIN.name y `valor`
                    "create",                          es un [array] con las acciones que puede realizar, en caso
                    "update"                           que alguna de los nombre_roles no este como `propiedad` se
                    ],                                 le asignara -> `can('manage', 'nombre_modulo.nombre_ruta')`
                [R_COMERCIAL.name]: [                  [ manage|create|read|update|delete , all|Name ] 
                    "read"                             ...si "permisions": [] o no se define, entonces no se creara 
                    ]                                  una configuracion CASl para esta ruta
                }]                               
        }
    ]
}*/
import { R_ADMIN } from '../roles';

export default {
    name: "Admin",
    roles: [
        R_ADMIN.name
    ],
    routers: [
        {
            name:"dashboard",
            descrip:"Panel de Ctrol de la Administración"
        },
        {
            name:"unidades",
            descrip:"Unidades"
        },
        {
            name:"cargos",
            descrip:"Cargos"
        }
    ]
}