import {R_ADMIN} from '../roles'

export default {
    name: "Prueba",
    roles: [R_ADMIN.name],
    routers:[
        {
            name: "dashboard",
            descrip: "Panel principal del Modulo Prueba"
        },
        {
            name: "ruta_prueba",
            descrip: "Ruta de Prueba"
        }
    ]
}