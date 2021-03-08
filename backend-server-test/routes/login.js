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
    request.input('usuario', mssql.NVarChar, body.usuario);
    request.input('password', mssql.NVarChar, body.password);

    var sQuery = 'SELECT TOP 1 USR_USRINP_CODIGO AS \'ID\', ';
    sQuery += ' USR_USRINP_USRPCK AS \'USUARIO\', ';
    sQuery += ' USR_USRINP_NOMBRE AS \'NOMBRE\', ';
    sQuery += ' USR_USRINP_DEPPCK AS \'DEPOSITO\', ';
    sQuery += ' STTDEH_DESCRP     AS \'DESDEP\' ';
    sQuery += ' FROM USR_USRINP, STTDEH WHERE USR_USRINP_USRPCK = @usuario ';
    sQuery += ' AND USR_USRINP_CLVPCK = @password';
    sQuery += ' AND STTDEH_DEPOSI = USR_USRINP_DEPPCK ';


    request.query(sQuery, function(err, result) {

        if (err) {
            return res.json({
                ok: false,
                mensaje: 'No se encontro usuario' + body.usuario,
                errors: err
            });
        }

        var usuarioBD = result.recordset[0];

        if (!usuarioBD || usuarioBD.length === 0) {
            return res.json({
                ok: false,
                mensaje: 'No se encontro usuario o contraseña incorrecta ' + body.usuario,
                errors: 'No se encontro usuario o contraseña incorrecta ' + body.usuario
            });
        }

        if (!usuarioBD.DEPOSITO) {

            return res.json({
                ok: false,
                mensaje: 'El usuario ' + body.usuario + 'No tienen un depósito asignado',
                errors: 'El usuario ' + body.usuario + 'No tienen un depósito asignado'
            });

        }


        /**
        if (body.password !== usuarioBD.USR_USRINP_CLVDOM) {
            return res.status(200).json({
                ok: false,
                mensaje: 'Password incorrecto',
                errors: 'Password incorrecto'
            });
        }
        */


        // Crear un token!!!
        //usuarioBD.USR_USRINP_CLVDOM = '-';

        var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 0 });

        res.status(200).json({
            ok: true,
            usuario: usuarioBD,
            token: token
        });
    });
});


module.exports = app;