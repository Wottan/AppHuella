var express = require('express');
var router = express.Router();

// Require controller modules.

var persona_controller = require('../controladores/personaControlador');

var sql_controller = require('../controladores/controlBaseDatos');

// GET catalog home page.
router.get('/', persona_controller.index);

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/persona/create', persona_controller.persona_create_get);

// POST request for creating Author.
router.post('/persona/create', persona_controller.persona_create_post);

// GET request to delete Author.
router.get('/persona/:id/delete', persona_controller.persona_delete_get);

// POST request to delete Author.
router.post('/persona/:id/delete', persona_controller.persona_delete_post);

// GET request to update Author.
router.get('/persona/:id/update', persona_controller.persona_update_get);

// POST request to update Author.
router.post('/persona/:id/update', persona_controller.persona_update_post);

// GET request for one Author.
router.get('/persona/:id', persona_controller.persona_detail);

// GET request for list of all Authors.
router.get('/personas', persona_controller.persona_list);


router.get('/personasql', sql_controller.persona_list);

module.exports = router;