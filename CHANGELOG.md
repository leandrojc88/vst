# Change Log

Todos los cambios del proyecto serán documentados Aquí.

[repositorio](https://192.168.150.29/leandro/vst-project.git)

## v1.1.2 (2020-06-09)

#### Bug Fixes :no_entry: 
- **securty/utils.js** actualizo el comportamiento de la mutations para los `Objets`

#### Features :rocket: 
- **store/index.js** y **App.vue** se creo el notify para las notificaciones genéricas



## v1.1.1 (2020-06-04)

#### Bug Fixes :no_entry: 
- fix : bug `exist_rules` se arreglo el problema q ocurria con la regla del nombre de usuario existente
- fix : se elimino la multiple actualizacion en el historial del sistema al actualizar algún UserSystems

#### Features :rocket: 
- `<vst-banner>` se le agrego los `slots` (title , exit y options) para su mejor personalización
- **security/utils.js** se le incorporo posibilidad de que la ruta raiz del modulo reciva parametros `/:param`

## v1.1.0 (202-05-26)

#### Bug Fixes :no_entry: 

- arreglo del llamado de la función `router.push` se le cambio el uso del campo `name` por `path`

#### Features :rocket: 

- comportamiento de las Rutas Anidadas, inclusión de una ruta anidada vacía para asignarle un componente de Dashboard, configurado desde las rutas del modulo con el valor `name:"dashboard"`
- Registro de Componentes *Base* en la instancia de Vue, creándolos accesibles de forma Global con el prefijo `vst-` seguido del `nombre-componente-kebabcase` 
- algunas mejoras visuales de la App
- Gestión de las Unidades y los Cargos de los Usuarios
- Mejora de la estructura del core - VST
- registerHeadersTokenAxios and unregisterHeadersTokenAxios en **security/auth.js**
- **security/utils.js** creación del objeto `make` para crear las mutations del store dependiendo el tipo
- datos del modulo/admin cargados desde el store
- Componente personalizado para la barra de Navegación *vst-menu-modules-item*
- actualización del readme.md

## v1.0.0 (2020-05-12)

 **Primera versión estable**