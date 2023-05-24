var express = require('express');
var router = express.Router();

const postController = require('../controllers/post');
const sessionController = require('../controllers/session');
const userController = require('../controllers/user');

const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {fileSize: 20 * 1024 *1024} //1024 * 1024 es megabyte, si quisiesemos Kb seria quitar uno, y si queremos Gb añadir un tercero
});

//Pagina ppal
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Pagina de autor
router.get('/author', (req,res,next) => {
  res.render('author');
})

//Cargame el post que corresponda con el postId, esto es para evitar tener que poner un /!,/2 para cada post
router.param('postId', postController.load); //Primero antes de nada consulta parametros a ver si coincide

// el \\d+ hace que pueda ser un numero de mas de una cifra
router.get('/posts/:postId(\\d+)/attachment', postController.attachment); 

router.get('/posts', postController.index);

//:postId(\\d+) se llama escapado, dentro de lo que vaya de los dos puntos es contenido variable, metemos \\d+ para que pueda tener infinitas cifras, llamado escapado regex
router.get('/posts/:postId(\\d+)', postController.show);

//P10

// Si quieres ir a posts/new me cargas el controlador
// porque nunca llegaras ahi sin logearte
router.get('/posts/new', sessionController.loginRequired, postController.new);
// router.get('/posts/new', postController.new); Obsoleto, ahora queremos que haya login, no hace falta meterlo en el create de abajo 

//Gonde guardarlo, en el /post, le subimos la imagen, y ejecutamos el create 
router.post('/posts', upload.single('image'), postController.create); //upload.single('image') es el middlewere que se ejecuta cada vez que se hace un metodo post a /post
// pertenece al paquete multer, sirve para extraer imagenes de la peticion, extrayendola por su id image

/* P10 - Los posts solo pueden ser editados por su autor, o por un usuario administrador. */
router.get('/posts/:postId(\\d+)/edit', postController.adminOrAuthorRequired, postController.edit);
//router.get('/posts/:postId(\\d+)/edit', postController.edit);

router.put('/posts/:postId(\\d+)', upload.single('image'), postController.update);

/* P10 - Los posts solo pueden ser borrados por su autor, o por un usuario administrador. */
router.delete('/posts/:postId(\\d+)', postController.adminOrAuthorRequired, postController.destroy);
//router.delete('/posts/:postId(\\d+)', postController.destroy);





//Practica 8
router.param('userId', userController.load);



/* P10 - La lista de usuarios registrados solo la puede ver un usuario administrador. */
router.get('/users',                    sessionController.adminRequired, userController.index);
//router.get('/users',                    userController.index);

/* P10 - El perfil de un usuario solo lo puede ver el propio usuario, o un usuario administrador. */
router.get('/users/:userId(\\d+)',      sessionController.adminOrMyselfRequired, userController.show);
//router.get('/users/:userId(\\d+)',      userController.show);

/* P10 - Solo el administrador puede crear nuevos usuarios. */
router.get('/users/new',                sessionController.adminRequired, userController.new);
//router.get('/users/new',                userController.new);

/* P10 - Solo el administrador puede crear nuevos usuarios. */
router.post('/users',                   sessionController.adminRequired, userController.create);
// router.post('/users',                   userController.create);

/* P10 - El perfil de un usuario solo lo puede editar el propio usuario, o un usuario administrador. */
router.get('/users/:userId(\\d+)/edit', sessionController.adminOrMyselfRequired, userController.edit);
// router.get('/users/:userId(\\d+)/edit', userController.edit);

/* P10 - El perfil de un usuario solo lo puede editar el propio usuario, o un usuario administrador. */
router.put('/users/:userId(\\d+)',      sessionController.adminOrMyselfRequired, userController.update);
// router.put('/users/:userId(\\d+)',      userController.update);

/* P10 - Borrar a un usuario de la BBDD solo le está permitido al propio usuario, o a un usuario administrador. */
router.delete('/users/:userId(\\d+)',   sessionController.adminOrMyselfRequired, userController.destroy);
// router.delete('/users/:userId(\\d+)',   userController.destroy);

// Routes for the resource /session
router.get('/login',    sessionController.new);     // login form
router.post('/login',   sessionController.create);  // create sesion
router.delete('/login', sessionController.destroy); // close sesion

module.exports = router;
