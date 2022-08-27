const express = require('express'),
  router = express.Router()

/** 
 *  ------------------------------ RUTAS DE LA APP ------------------------------
 * definir las rutas utilizadas por la APP  router.get | post | put | delete 
 */

// router.get('/test', (req, res) => res.send('test'))


/**
 *  -------------------- ADMIN ------------------------------
 */

 // ------ Unidades --------
const UNIDADE = require('./security/routers/unidad')
router.get('/unidad', UNIDADE.getAll)
router.post('/unidad', UNIDADE.create)
router.put('/unidad/:id', UNIDADE.update)
router.delete('/unidad/:id', UNIDADE.delete)

// ------ Cargos --------
const CARGO = require('./security/routers/cargo')
router.get('/cargo', CARGO.getAll)
router.post('/cargo', CARGO.create)
router.put('/cargo/:id', CARGO.update)
router.delete('/cargo/:id', CARGO.delete)

//------------ ejemplo Upload ------------
const multer = require("multer")

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Incorrect file");
    error.code = "INCORRECT_FILETYPE";
    return cb(error, false)
  }
  cb(null, true);
}

const upload = multer({
  dest: './api/uploads',
  fileFilter,
  limits: {
    fileSize: 5000000
  }
});

router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});

/* app.use((err, req, res, next) => {
  if (err.code === "INCORRECT_FILETYPE") {
    res.status(422).json({ error: 'Only images are allowed' });
    return;
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(422).json({ error: 'Allow file size is 500KB' });
    return;
  }
}); */

module.exports = router
