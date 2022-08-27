/** definir los roles del sistema cada uno con sus propiedades
 * {
 *    id      : # identificador unico,
 *    name    : noombre del rol,
 *    default : modulo inicial por defecto del rol
 * }
*/
export const R_ADMIN                = { id: 1, name: "Admin", default: "Admin" }
export const R_COMERCIAL            = { id: 2, name: "Comercial", default: "Comercial" }
export const R_INGENIERIA           = { id: 3, name: "Ingenieria", default: "Comercial" }

// esportar el [Array] de todos los roles del sistema
export default [
    R_ADMIN,
    R_COMERCIAL,
    R_INGENIERIA
]