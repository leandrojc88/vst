### Funciones

- [ ] revizar el hoocks afterUpdate para el Model.save() el calor nuevo es el mismo que el valor anterior de los campos obtener campo - _previousDataValues: de un Model
- [ ] **Importane** -> se crean mas de un registro en la tabla history cuando se produce la accion de `UPDATE` 
- [ ] `newuser.setUnidad(inst__unidad)` los métodos autogenerados crean un evento update por lo tanto se realiza la actualización en 3 ocasiones en el caso del usuario revisar como poner las relaciones de una ves junto con la primera llamada
- [ ] crear api.js en la vista para la carga de los datos, Revisar el frontend de Camilo pincha exterior: [aqui](file:///F:/Documentacion/Web%20Develop/JavaScript/Vue%20js/Docs/vuex%20espa%C3%B1ol/Application%20Structure%20_%20Vuex.html)
- [ ] crear nomenclator-manage para administrar todos los nomencladores fácilmente
---
- [ ] .env para las configuraciones como (VST_VERSION, APP_NAME, API_URL) y otras
- [ ] Migrations Sequelize
- [ ] instalacion de nginx
---
##### features
- refactorizar componente <vst-banner> y <vst-modules-menu-items> el uso del nombre del modulo mediante **state**

# Backend - API


# Pendiente
- [ ] URGENTE -> resolver lo del doble envio de peticiones de vuejs hacia la Api con axios esto genera un duplicado en el **historial de logs** y en caso de el `DELETE y UPDATE` un mal funcinamiento del mismo al guardar el campo `data` de la dase de datos en null, devido a que no encuentra los datos en la consulta en el Hooks BeforeUpdate_Destroy para encontrar la row q se va a trigger 
- [ ] **La fecha cargada de la base de datos** la fecha esta con la UTF-4 y por lo tanto le resta ese tiempo al cargar los datos en Sequelize
- [ ] revisar también en la parte de los filtros de los logs 
```js
---------------- VER ESTO -----------------------
    
require('pg').types.setTypeParser(1114, stringValue => {
    return new Date(stringValue + '+0000');
    // e.g., UTC offset. Use any offset that you would like.
  });
/*            


//salta 4h mas por delante
              new Date(json_filters.dates[1] + ' 23:59:00.999-04')
       { [Symbol(between)]: [ 2020-04-20T00:00:00.000Z, 2020-04-21T03:59:00.999Z ] } }
```
- Badges -> en los Link del menu y los submnus con la cantidad de nuevas notificaciones (ej. ordenes rechazadas o cosas como esas)
- logotipo de la app
- refactorizar el codigo de los Middleware a `D:\Documentacion\Vue js\Docs\Middleware\vue-middleware`
- ***ESTUDIAR*** la posibilidad de un modo apagado para q las configuraciones iniciales sean configuradas manualmente con el objetivo de la flexibilidad de la app y eliminar las ataduras a las funciones **initRouters** para las rutas y **ability** que se puedan crear manualmente


# Investigar

- [ ] pruebas Unitarias **Junit**
- [ ] git configuracion para subir dustintos ficheros a distintos origins master 
- [ ] npm install --- bcrypt para las contraseñas, passport y passport-local, timeagojs(para las fechas), express-validator(valida datos delures)

# Next Version
- definir funcionamiento o eliminar la propiedad children[] de los permisos en **security/config_modules/\*.json**
- replantearse el uso de ability para direcciones publicas fuera de la estructura de los modulos algo como la página de EDteam que algunas funcionalidades aparecen según el tipo de user y otras se mantienen ocultos 
  - puede ser en un fichero de config **/security/rols_abilitys.js** donde para cada rol se definan algunos permisos(abilitys) de carácter general
- RWD - convertir el componente `vst-modules-menu-items` a un navigator drawer
- campana de notificaciones con nuevas acciones y tareas en los módulos y funcionalidades del sistema