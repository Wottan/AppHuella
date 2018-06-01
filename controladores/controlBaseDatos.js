var Connection = require('tedious').Connection;
var Persona = require('../modelos/persona');
var Request = require('tedious').Request;
var rows = [];
var sql = 'select dbo.Proveedores.Nombre as nombre, dbo.Proveedores.[ID Proveedor] as idProveedor, dbo.Proveedores.templatedp45 as huella' +
    ' FROM dbo.Proveedores INNER JOIN dbo.Empleados ON dbo.Proveedores.[ID Proveedor] = dbo.Empleados.Proveedor ' +
    ' INNER JOIN dbo.sarh_horario ON dbo.Empleados.Categoria = dbo.sarh_horario.empleado_Categoria' +
    ' AND dbo.Empleados.Proveedor = dbo.sarh_horario.empleado_Proveedor' +
    ' WHERE(dbo.sarh_horario.activo = 1)' +
    ' GROUP BY dbo.Proveedores.Nombre, dbo.Proveedores.[ID Proveedor], dbo.Proveedores.templatedp45' +
    ' HAVING(dbo.Proveedores.templatedp45 IS NOT NULL)' +
    ' ORDER BY dbo.Proveedores.Nombre';

var sql2 = 'select id as apellido, nombre as nombre from dbo.Personas';

var sql3 = 'select dbo.Proveedores.[ID Proveedor] as idProveedor, dbo.Proveedores.Nombre as nombre' +
    ' FROM dbo.Proveedores INNER JOIN dbo.Empleados ON dbo.Proveedores.[ID Proveedor] = dbo.Empleados.Proveedor' +
    ' INNER JOIN dbo.sarh_horario ON dbo.Empleados.Categoria = dbo.sarh_horario.empleado_Categoria' +
    ' AND dbo.Empleados.Proveedor = dbo.sarh_horario.empleado_Proveedor' +
    ' GROUP BY dbo.sarh_horario.activo, dbo.Proveedores.[ID Proveedor], dbo.Proveedores.Nombre' +
    ' HAVING(dbo.sarh_horario.activo = 1)' +
    ' ORDER BY dbo.Proveedores.Nombre';
var config = {
    userName: 'usuarioalu',
    password: 'iugdalu',
    server: '172.16.0.149',
    options: {
        database: 'DBSistema',
        instancename: 'SQLEXPRESS'
    }
};

var connection = new Connection(config);


connection.on('connect', function (err) {
    // If no error, then good to go...
    if (err) {
        console.log(err);
    } else {
        console.log("Se conecto");
        getSqlData();
    }
    //executeStatement();
    //insertar();
    //connection.close();
}
);

//Set up mongoose connection
console.log("Mongo");
var mongoose = require('mongoose');
var mongoDB = 'mongodb://Wottan:42340852@ds135619.mlab.com:35619/huella_local';
var mongoDBLocal = 'mongodb://localhost/baseLocal';

mongoose.connect(mongoDBLocal);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

function insertIntoMongoDb() {
    console.log('Insertando datos a MongDB');
    for (var i = 0; i < rows.length; i++) {
        // console.log(rows[i]);
        var persona = new Persona(rows[i]);
        persona.save(function (error) {
            if (error) {
                console.log('Error grabando' + error);
            } else {
                console.log('Se grabo exitosamente');
            }
        });
    }
};

function getSqlData() {
    console.log('Obteniendo datos SQL');
    request = new Request(sql, function (err, rowCount) {
        if (err) {
            console.log(err);
        } else {
            // console.log(rows);
            // insertIntoMongoDb();
        }
    });
    request.on('row', function (columns) {
        var row = {};
        columns.forEach(function (column) {
            //console.log("col " + column.value)
            if (column.isNull) {
                row[column.metadata.colName] = null;
            } else {
                row[column.metadata.colName] = column.value;
            }
        });
        //console.log('Fila : ' + JSON.stringify(row));
        rows.push(row);
    });
    connection.execSql(request);

};

exports.persona_list = function (req, res, next) {
    /*Persona.find({}, 'nombre apellido fechaNacimiento').exec(function (err, list_personas) {*/
    /*if (err) { return next(err); }*/
    //Successful, so render
    res.render('personaListaSQL', { title: 'Persona SQList', personaLista: rows });
    /*});*/
};