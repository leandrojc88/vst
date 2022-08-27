const express = require('express'),
  app = express(),
  KEY_PASS = 'VST-KeyPassword2020.1.0.*',
  path = require('path'),
  history = require('connect-history-api-fallback')
  router = require('./router'),
  cors = require('cors'),
  securityRouter = require('./security/securityRouter')

  //console colors
  require('colors')

app
  //   .set('port', process.env.PORT)
  .set('port',process.env.PORT || 3030)
  .set('key_pass', KEY_PASS)
  //para parsear application/json
  .use(express.json())
  //para parsear application/xwww-form-urlencoded
  .use(express.urlencoded({ extended: false }))
  .use(cors())
  .use('/api',securityRouter)
  .use('/api',router)
  // siempre ubicar el middleware del history despues de la RUTAS OJO IMPORTANTE
  .use(history())
  .use(express.static(path.join(__dirname, 'public')))

app.listen(
  app.get('port'),
  () => console.log(`\n >>>> Iniciando API RESTfull en el puerto ${app.get('port')} \n`.bgCyan.black)
)

module.exports = app 