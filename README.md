VST

> Vue Security Tool

Creado con la intención de tener un punto de partida para la seguridad de los usuarios y roles, el control de los niveles de acceso, las rutas y historia de acciones de un proyecto con **Vue y Vuetify**

## Project setup
```
npm install
```

#### Inicialización del Proyecto

`npm run init`

#### Compilación y hosting para desarrollo

`npm run serve` 	=> servidor Fronent
`npm run api`   	=> servidor Backend


#### Compilación y creación de Producción
`npm run build`

## Flujo Base

1. configurar los parámetros de conexión a la base de datos en la API( **api/config.js** ) 

   ``` js
   module.exports = {
       DB_NAME: 'SVT-database', // base de datos
       DB_USER: 'postgres',
       DB_PASSWORD: 'postgres',
       DB_HOST: 'localhost',
       DB_DIALECT: 'postgres',
       DB_SCHEMAS : {
           SECURITY: 'security' // esquema obligatorio para el Sistema
       }
   }
   ```

2. crear la base de datos con el mismo nombre de la configuración anterior en el gestor de base de datos seleccionado ej. *pgadmin* para *Postgres* 

3. ejecutar el comando `npm run init` para inicializar las configuraciones básicas de la app desde el backend, este comando crear las tablas *user, history, unidad y cargo* del esquema de *seguridad* en la base de datos y un usuario **root** para el acceso inicial al sistema 

4. iniciar el sistema en modo desarrollo, con los siguientes comandos se activa el modo de desarrollo tanto para el frontend como el backend

   - Fronent -> `npm run serve` http://localhost:8080/ 
   - Backend -> `npm run api` http://localhost:3030

5. ya se puede acceder al Sistema con el usuario y contraseña: **root** 

## Frontend

Para iniciar el servidor *Fronen*t para desarrollo se debe correr el comando `npm run serve` y este iniciara por el http://localhost:8080/ 

#### Librerías

- Vuex - para la gestión de los estados de la app
- vuetify - para las interfaces visuales(UI) basadas en Material Design
- vue-router - para el trabajo con las rutas en la SPA
- axios y vue-axios - para las peticiones a la API de forma asíncrona
- CASL - para los permisos de los Roles a las Funcionalidades

#### User Interface (UI)

##### inicio del sistema

página de inicio para acceder a los módulos del sistema, con las credenciales asignadas

![1589222564438](readme\loggin.png)

##### Opciones

Permite acciones para Salir del Sistema, ver los datos del Usuario e intercambiar entre los módulos a los cuales el Usuario tiene acceso, además de poder gestionar algunas configuraciones

![1589223291528](readme\opciones.png)

##### Modulo de Administración

Control de Usuarios, Roles y Permisos e Historial del Sistema

***Usuarios del Sistema***

Gestión de los Usuarios del Sistema

![1589223158817](readme\admin module.png)

***Roles y Permisos***

Visualización de la configuración de los Roles del Sistema y el nivel de permisos a los Módulos y Funcionalidades

![1589223007586](readme\admin module - roles.png)

***Historial***

listado de las acciones de los usuarios en el sistema y con varias opciones para mostrarlas incluyendo un filtrado

![1589223087165](readme\admin module - history.png)

***Uniadades***

![](readme\unidades.PNG)

***Cargos***

![](readme\cargos.PNG)

#### Estructura interna (Core)

la estructura de carpetas es la de una App en **Vuejs** creada inicialmente con vue-cli y con algunas estructuras de carpetas creadas adicionalmente para la gestión de la seguridad del sistema; todo el core Frontend se encuentra en la carpeta ***src***:

:file_folder:api
  :file_cabinet:api.js
:file_folder:assets
:file_folder: components
​	:file_folder:Admin
​	:file_folder:Base
:file_folder: plugins
:file_folder:router
:file_folder:security
    :file_folder:mixins
    :file_folder:modules_config
:file_folder:store
  :file_folder:modules
  :file_cabinet:index.js
:file_folder:views
:file_cabinet: App.vue
:file_cabinet: main.js

----

:file_folder: **api** : (opcional) directorio donde se encuentran los request a la api
  - :file_cabinet:  **api.js** : (opcional) definicion de los request de la api

:file_folder: **assets** : directorio donde se encuentran los recursos (imagenes, videos, etc)

:file_folder: **components** : directorio con los archivos *.vue*  de los componentes utilizados en la App. Inicialmente se encuentran 2 subdirectorios (**Admin y Base**) que contienen los componentes que se utilizan en la administración del Sistema, organizados mediante la metodología [Atomic Design](http://atomicdesign.bradfrost.com/)

- todos los componentes dentro de directorio **Base** a todos sus niveles de subdirectorios se crearan como componentes genéricos de la app en formato kebabCase ej. el componente **ModulesMenuItems.vue** se puede invocar desde cualquier fichero de la app como `<vst-modules-menu-items>`

- Siempre debe existir un subdirectorio para la creación de nuevos módulos con el directorio interno Pages  ej.  **Nuevomodulo/Pages/*.vue** , para garantizar el correcto funcionamiento

:file_folder: **plugins**

- :file_cabinet:  **vuetify.js** : configuración de Vuetify

:file_folder:**​router**

-  :file_cabinet:  **index.js** : Configuración de todas las rutas publicas y privadas de la App. Contiene la 	funcionalidad `...initRouters()` que inicializa todas las rutas privadas de la App según las configuraciones de los módulos: **security/modules_config/modules.js**. 

También se ejecuta el *middleware* para mantener la seguridad sobre las rutas del sistema mediante el Rol del Usuario autenticado

:file_folder:**store**
- :file_folder:**modules** : ficheros moduleName.js con las definiciones de los modulos del **store**
-  :file_cabinet:  **index.js** : gestión de los estados de la App, guardar el estado de *currentUser* para tener el control sobre los datos del usuario registrado en el Sistema en toda la App y las acciones como obtener el token y los datos

:file_folder: **security** directorio donde que contiene todas las Configuraciones y la seguridad implementada para el Sistema 
 - :file_folder: **mixins**
      - :file_cabinet:  **logginMixin.js** : mixin que contiene la implementación de la lógica de ingreso al Sistema       
 - :file_folder: **modules_config** : Configuraciones de las funcionalidades y los niveles acceso de los módulos `/** */ -> esta descrito como funciona la configuración`
     - :file_cabinet: **Admin.js** : configuración de los permisos para el *modulo de Admin* 
     - :file_cabinet: **Comercial.js** : configuración de ejemplo de un modulo
     - :file_cabinet: **NuevoModulo.js** : aquí se estable los permisos para el nuevo modulo 
- :file_cabinet: **abilitys.js** : configuración de las reglas de *CASL(Ability)* para los permisos del Rol
- :file_cabinet: **auth.js** : manejo del *objeto* que controla los recursos de la autenticación (localStore, Token, Headers)
- :file_cabinet: **config.js** : configuraciones iniciales de la App, centralización de los módulos y Contantes utilizadas por la App (APP_NAME - nombre del Sistema, API_URL - url servidor api para axios)
- :file_cabinet: **roles.js** : Definición de los Roles que utilizara el sistema y su Modulo pro defecto
- :file_cabinet: **utils.js** : Funciones que complementan el funcionamiento correcto de la App, como la Inicialización de las rutas `initRouters()` y iniciar el modulo por defecto de un Rol `gotodefaultModule(user)` asi como encapsulamiento de las funciones que permiten trabajar con los módulos del store y sus mutaciones dentro del objeto `make` 

:file_folder:**views** : definición de las vistas genéricas, acepto el componente **RootView.vue** que es el punto de entrada al sistema el resto de vistas que definen los módulos deben contener la siguiente estructura:

   :file_cabinet: **ModuleNombreView.vue** : comenzar con la palabra Module seguido del nombre y terminar con la palabra View mas la extensión .vue, debe contener el `<router-view>` para mostrar el contenido del resto de componentes cargados

``` html
<template>
  <v-app>
    <vst-banner title="Administración" root_url="admin" app>
      <vst-modules-menu-items :menus="menus" module_name="Admin" />
    </vst-banner>
    <v-content app>
      <router-view></router-view>
    </v-content>
    <vst-footer app></vst-footer>
  </v-app>
</template>
```



- :file_cabinet: **RootView.vue** : Componente que define la *vista* de Inicio del Sistema y utiliza el **logginMixin** para el ingreso de los usuarios al mismo
- :file_cabinet: **ModuleAdminView.vue** : Componente que define la *vista general* del Modulo de Admin 
- :file_cabinet: **ModuleComercialView.vue** : Componente que define la *vista general* del Modulo de Comercial de Prueba​ 

:file_cabinet: **App.vue** y :file_cabinet: **main.js** : ficheros necesario para el inicio de la App Vuejs, donde se cargan todas las rutas y las configuraciones del sistema en la instancia `Vue` 

#### Ejemplo de creación y configuración de un Modulo

para el ejemplo se utilizara el modulo de nombre *Prueba*

1. creación de los directorios necesarios

   - crear la carpeta Prueba en el dir: ***components/Prueba*** y dentro la estructura de [Atomic Design](http://atomicdesign.bradfrost.com/) o al menos la carpeta ***Pages*** para los componentes y las rutas del modulo y dentro crea **Ruta_prueba.vue**

   - crear el fichero de config ***secrity/modules_config/Prueba.js*** , para definir toda la configuración del modulo: `ruta_prueba` hace referencia al componente creado Ruta_prueba.vue. Por cada nombre de una ruta debe existir un componente dentro de ***components/Prueba/Pages*** que cargue esta ruta

     ``` js
     import { R_ADMIN } from '../roles';
     export default {
         "name": "Admin",
         "roles": [
             R_ADMIN.name
         ],
         "routes": [
             {
                 name: "ruta_prueba",
                 descrip: "Ruta de Prueba"
             }
         ]
     }
     ```

   - crear en las vistas el punto de entrada al modulo ***views/ModulePruebaView.vue*** 

     ``` html
     <template>
       <v-app>
           <h1>Modulo Prueba</h1>
         <v-content app>
           <router-view></router-view>
         </v-content>
       </v-app>
     </template>
     ```

2. importar la configuración del modulo Prueba dentro de la configuración general en ***security/config.js*** 

   ``` js
   import PruebaConfig from './modules_config/Prueba'
   ...
   export const modulesConfig = [
       ... PruebaConfig
   ]
   ```

   hasta este punto una ves ingrese al sistema le aparecerá el modulo prueba dentro de las opciones del usuario **root** o cualquiera de Rol Admin

3. mejorando la UI de Prueba, incorporaremos el Banner, Footer y la ruta de prueba utilizados por la App

   ***views/ModulePruebaView.vue*** 

``` php+HTML
<template>
  <v-app>
    <vst-banner title="Prueba" root_url="prueba" app>
          <vst-modules-menu-items :menus="menus" module_name="Prueba" />
      </template>
    </vst-banner>
    <v-content app>
      <router-view></router-view>
    </v-content>

    <vst-footer app></vst-footer>
  </v-app>
</template>
<script>
export default {
  name: "ModulePruebaView",
  data: () => ({
    menus: [{ name: "Nomencladores", config: [1, 5] }]
  })
}
</script>
```

***components/Prueba/Pages/Ruta_prueba.vue***

``` php+HTML
<template>
    <h1>Ruta Prueba</h1>
</template>
```

#### utilización del componente `<vst-modules-menu-items/>`

`<vst-modules-menu-items/>` -> es el componente registrado globalmente para crear el contenido de dentro de `<vst-banner>` 

>  no es obligatorio su utilización pero agiliza mucho la creación de los menús para las rutas asociadas a los módulos de los módulos

**utilización**

``` js
 <vst-modules-menu-items :menus="menus" module_name="Prueba" />
     
  data: () => ({
    menus: [
        {name: "Nomencladores", config: [1, 5] },
        {name: "Personalizado",config: menuItems,custom: true}
      ]
  })   
```

1. recibe dos propiedades `menus` y `module_name` 

   - `module_name` - nombre del modulo que se utiliza para cargar el fichero **security/modules_config/module_name.js** y obtener sus rutas para mostrarlas como menús
- `menus` - una lista de objetos(menús) los cuales se mostraran en el banner del modulo, estos objetos tiene la estructura: 
  
    ```
     {
     	name: string,
     	config: [start: int|string , end: ing|string ] | object,
     	custom: boolean  
     }
    ```


-  `name`: (string) nombre del menu mostrado en el toolbar
-  `config`: ([start,end]) array que defini el inicio y fin de las opciones del menu o un componente personalizado
              	-  `start`: (int|string) numero o descripción de la ruta que inicia el listado de menús
                 	-  `end`: (int|string) numero o descripción de la ruta que finaliza el listado de menús
                    	-  `componente`: (object) componente que se mostrara en el menú, la propiedad `custom: true` para que funcione
                	-  `custom`: (boolean) para decirle al componente si es personalizado o no

   

   ***ejemplo:***  

   en el ejemplo inicial el modulo utilizado es *Prueba* `module_name="Prueba"` y los menús están definidos `:menus="menus"` en array `menus`  

   - `{name: "Nomencladores", config: [1, 5] }`: este menú de nombre "Nomencladores" comienza en la ruta 1 del modulo Prueba hasta la ruta 5, ese es el listado de items que mostrara el menú
   - `{name: "Personalizado",config: menuItems,custom: true}`: menu de nombre "Personalizado" mostrara el componente `menuItems`, porque cuenta con el atributo `custom:true` 

## API

#### Librerías

- connect-history-api-fallback - permite controlar el modo de historial para incluir la App en el servidor API
- express - servidor backend para la API
- jsonwebtoken - token web para la seguridad 
- sequelize - ORM node
- colors - colores de la consola
- mongoose - para utilizar MongoDB

#### Estructura interna (Core)

estructura de una API en **Expres** con un sistema de directorios definidos:

:file_folder:data
:file_folder: middleware
:file_folder:models
:file_folder:public
:file_folder:routers
:file_folder:security
  :file_folder:middleware
  :file_folder:models
  :file_folder:routers
  :file_cabinet:init.js
  :file_cabinet:securityRouter.js
:file_cabinet:config.js
:file_cabinet:database.js
:file_cabinet:index.js
:file_cabinet:router.js

---

:file_folder:**data** : los ***Datos*** adicionales de la App, JSON etc.
:file_folder:**middleware** : Definición de los **Middleware** para la App
:file_folder:**models** : Modelos de datos utilizados por la App
:file_folder:**public** : Recursos públicos del sistema, directorio donde se despliega el sistema en producción
:file_folder:**routers** : Ficheros .js que contiene la lógica de las rustas del sistema
:file_folder:**security** : estructura que contiene la seguridad
- :file_folder:**middleware** middleware que garantizan la logica de la seguridad del sistema
  -  :file_cabinet:**generalMiddleware.js** : Middleware para verificar la validez del _token y permitir el acceso al resto de las funcionalidades
  - :file_folder:**models** : contiene los ficheros con los modelos de la seguridad :file_cabinet:**userSystem.js** , :file_cabinet:**history.js**,:file_cabinet:**unidad.js**,:file_cabinet:**cargo.js**
  - :file_folder:**routers** : contiene los ficheros con la lógica de las rustas  de la seguridad :file_cabinet:**userSystem.js** , :file_cabinet:**history.js**, :file_cabinet:**unidad.js**,:file_cabinet:**cargo.js**
  - :file_cabinet:**init.js** : inicialización de la app, crea el esquema y las tablas en la base de datos y el usuario *root*
  - :file_cabinet:**securityRouter.js** : rutas del sistema de seguridad (usuarios sistema y historial)

:file_cabinet:**config.js** : Configuración de la Base de Datos
:file_cabinet:**database.js** : manejo de la instancia *Sequelize* para la Conexión a la Base de Datos y el uso de los hoock para el *Historial*
:file_cabinet:**index.js** : punto de entrada y configuración del servidor ***Expess*** para la API
:file_cabinet:**routers.js** : rutas del sistema en general

## Change Log
[change log](CHANGELOG.md)

 ```

 ```