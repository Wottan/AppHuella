var mongoose = require('mongoose');

var esquema = mongoose.Schema;
var moment = require('moment');

var PersonaSchema = new esquema(
  {
    idProveedor: { type: Number, required: true },
    nombre: { type: String, required: true, max: 100 },
    apellido: { type: String, max: 100 },
    fechaNacimiento: { type: Date },
    huella: { type: Buffer, required: false },
  }, { collection: 'Persona' }
);

// Virtual for persona full name
PersonaSchema
  .virtual('name')
  .get(function () {
    return this.apellido + ', ' + this.nombre;
  });

// Virtual for persona URL
PersonaSchema
  .virtual('url')
  .get(function () {
    return '/catalogo/persona/' + this._id;
  });

PersonaSchema
  .virtual('nacimientoFormateado')
  .get(function () {
    return moment(this.fechaNacimiento).format('MMMM Do, YYYY');
  });
//Export model
module.exports = mongoose.model('Persona', PersonaSchema);