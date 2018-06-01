var Persona = require('../modelos/persona');

var async = require('async');
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res, next) {
    async.parallel({
        persona_count: function(callback) {
            Persona.count({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
    }, function(err, results) {
        res.render('index', { title: 'Huella Local', error: err, data: results });
    });
};

// Display list of all personas.
exports.persona_list = function(req, res,next) {
    Persona.find({}, 'nombre apellido fechaNacimiento').exec(function (err, list_personas) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('personaLista', { title: 'Persona List', personaLista: list_personas });
    });
};

// Display detail page for a specific Author.
exports.persona_detail = function(req, res,next) {
    async.parallel({
        persona: function(callback) {
            Persona.findById(req.params.id)
              .exec(callback)
        },
        /*authors_books: function(callback) {
          Book.find({ 'author': req.params.id },'title summary')
          .exec(callback)
        },*/
    }, function(err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.persona==null) { // No results.
            var err = new Error('Persona not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('personaDetalle', { title: 'Persona Detalle', persona: results.persona/*, author_books: results.authors_books*/ } );
    });
};

// Display Author create form on GET.
exports.persona_create_get = function(req, res,next) {
    res.render('personaForm', { title: 'Crear Persona'});
};

// Handle Author create on POST.
exports.persona_create_post = [ // Validate fields.
body('nombre').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
    .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
body('apellido').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
    .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
body('fechaNacimiento', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
body('fechaMuerte', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

// Sanitize fields.
sanitizeBody('nombre').trim().escape(),
sanitizeBody('apellido').trim().escape(),
sanitizeBody('fechaNacimiento').toDate(),
sanitizeBody('fechaMuerte').toDate(),

// Process request after validation and sanitization.
(req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('personaForm', { title: 'Crear Persona ', persona: req.body, errors: errors.array() });
        return;
    }
    else {
        // Data from form is valid.

        // Create an Author object with escaped and trimmed data.
        var persona = new Persona(
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                fechaNacimiento: req.body.fechaNacimiento,
                fechaMuerte: req.body.date_of_death
            });
            persona.save(function (err) {
            if (err) { return next(err); }
            // Successful - redirect to new author record.
            res.redirect(persona.url);
        });
    }
    }
];

// Display Author delete form on GET.
exports.persona_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Persona delete GET');
};

// Handle Author delete on POST.
exports.persona_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Persona delete POST');
};

// Display Author update form on GET.
exports.persona_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Persona update GET');
};

// Handle Author update on POST.
exports.persona_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Persona update POST');
};