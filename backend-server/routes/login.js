var express = require('express');
var mssql = require('mssql');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;

    var request = new mssql.Request();
    request.input('usuario', mssql.NVarChar, body.usuario)
    request.query('SELECT TOP 1 * FROM USR_USRINP WHERE USR_USRINP_USRLGC = @usuario', function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se encontro usuario' + body.usuario,
                errors: err
            });
        }

        var usuarioBD = result.recordset[0];

        if (!usuarioBD || usuarioBD.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No se encontro usuario ' + body.usuario,
                errors: 'El usuario ' + body.usuario + ' no existe'
            });
        }

        /**
        if (!bcrypt.compareSync(body.password, usuarioBD.USR_USRINP_CLVDOM)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }
         */

        // Crear un token!!!
        usuarioBD.USR_USRINP_CLVDOM = '-';

        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 0 });

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token
        });



    });

});


module.exports = app;