const express = require('express'),
  router = express.Router(),
  // middleware
  generalMiddleware = require('./middleware/generalMiddleware')

/**
 *  -------------------- SISTEMA ------------------------------
 */

/*router.get('/', async (req, res) => { await res.status(200).send({message: 'Funcionando API RESTful'})})*/
router.route('*')
  // seguridad mediante el _token
  .all(generalMiddleware.verifyTokenAccess)
  
  // gusradar el ususario en variable global para utilizarlo en el *historial* 
  .post(generalMiddleware.triggerMiddleware)
  .put(generalMiddleware.triggerMiddleware)
  .delete(generalMiddleware.triggerMiddleware)
  
/**
 *  -------------------- USER SISTEMA ------------------------------
 */
const userSystem = require('./routers/userSystem')
router.post('/loggin', userSystem.loggin)
router.get('/userSystem', userSystem.getUsers)
router.post('/userSystem', userSystem.newUser)
router.put('/userSystem/:id', userSystem.updateUser)
router.delete('/userSystem/:id', userSystem.deleteUser)
router.post('/userSystem/getDataByToken', userSystem.getDataByToken)

/**
 *  -------------------- HISTORY SISTEMA ------------------------------
 */
const history = require('./routers/history')
router.get('/historySystem', history.getHistorys)
router.get('/historySystem/count/:filters', history.getCountHistorys)
router.get('/historySystem/:offset/:limit/:order/:filters', history.getPagHistorys)
router.get('/historySystemTables', history.getHistorysTables)
// router.post('/history', history.newHistory)
// router.put('/history/:id', history.updateHistory)
// router.delete('/history/:id', history.deleteHistory)

/**
 *  -------------------- NOTIFICATIONS SISTEMA ------------------------------
 */


module.exports = router