#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Persona = require('./modelos/persona')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var personas = []

function personaCreate(nombre, apellido, fechaNacimiento, fechaMuerte, cb) {
    personaDetalle = {nombre:nombre, apellido:apellido}
    if (fechaNacimiento != false) personaDetalle.fechaNacimiento = fechaNacimiento
    if (fechaMuerte != false) personaDetalle.fechaMuerte = fechaMuerte
    
    var persona = new Persona(personaDetalle);
         
    persona.save(function (err) {
      if (err) {
        cb(err, null)
        return
      }
      console.log('Nueva Persona: ' + persona);
      personas.push(persona)
      cb(null, persona)
    }  );
  }

  function createPersonas(cb) {
    async.parallel([
        function(callback) {
            personaCreate('Ivanico', 'Dos', '1973-06-06', false, callback);
        },
        function(callback) {
            personaCreate('Ben', 'Bova', '1932-11-8', '1992-04-06', callback);
        },
        function(callback) {
            personaCreate('Isaac', 'Asimov', '1920-01-02', '1992-04-06', callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createPersonas
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Personas: '+personas);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});
