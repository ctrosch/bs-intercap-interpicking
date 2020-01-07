var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mssql = require('mssql');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// ==========================================
// Obtener todos los clientes con despachos pendientes
// ==========================================
app.get('/:sitio/:deposito/:usuario', (req, res, next) => {

    var sitio = req.params.sitio;
    var deposito = req.params.deposito;
    var usuario = req.params.usuario;

    var request = new mssql.Request();
    request.input('sitio', mssql.NVarChar, sitio);
    request.input('deposito', mssql.NVarChar, deposito);
    request.input('usuario', mssql.NVarChar, usuario);

    var sQuery = ' SELECT TOP 100 * FROM PCK_PENDIENTE_CLIENTE ';
    sQuery += ' WHERE SITIOS = @sitio  ';
    sQuery += ' AND DEPOSI = @deposito ';
    // sQuery += ' AND (USRPCK IS NULL OR USRPCK = \'\' OR USRPCK = @usuario) ';
    sQuery += ' AND (ESTPK2 = \'A\' ) ';
    sQuery += ' ORDER BY TRADES, NROCTA ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                packing: [],
                mensaje: 'Error obteniendo datos packing para el sitio ' + sitio + ', deposito ' + deposito,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
                packing: [],
                mensaje: 'No existen datos de paciking para el sitio ' + sitio + ', deposito ' + deposito,
                errors: { message: 'No existen datos de packing para el sitio ' + sitio + ', deposito ' + deposito }
            });
        }


        var packing = result.recordset;

        res.status(200).json({
            ok: true,
            packing: packing
        });
    });
});

// ==========================================
// Obtener un item pendiente de packing
// ==========================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var request = new mssql.Request();
    request.input('id', mssql.NVarChar, id);
    request.query('SELECT TOP 1 * FROM PCK_PENDIENTE_CLIENTE WHERE ID = @id', function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                packing: [],
                mensaje: 'Error obteniendo item packing con el id ' + id,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
                packing: [],
                mensaje: 'No existe item packing con id ' + id,
                errors: { message: 'No existe item packing con id ' + id }
            });
        }


        var packing = result.recordset;

        res.status(200).json({
            ok: true,
            packing: packing
        });
    });
});

// ==========================================
// Obtener lista de items pendientes por pedido
// ==========================================
app.get('/items/:modfor/:codfor/:nrofor', (req, res, next) => {

    var modfor = req.params.modfor;
    var codfor = req.params.codfor;
    var nrofor = req.params.nrofor;

    var request = new mssql.Request();
    request.input('modfor', mssql.NVarChar, modfor);
    request.input('codfor', mssql.NVarChar, codfor);
    request.input('nrofor', mssql.NVarChar, nrofor);

    var sQuery = ' SELECT * FROM PCK_PENDIENTE_PRODUCTO ';
    sQuery += ' WHERE MODFOR = @modfor ';
    sQuery += ' AND CODFOR = @codfor ';
    sQuery += ' AND NROFOR = @nrofor ';
    sQuery += ' AND ESTPK2 = \'A\' ';
    sQuery += ' ORDER BY TIPPRO, ARTCOD ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                packing: [],
                mensaje: 'Error obteniendo items packing del pedido ' + modfor + '-' + codfor + '-' + nrofor,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
                packing: [],
                mensaje: 'No existe item packing del pedido ' + modfor + '-' + codfor + '-' + nrofor,
                errors: { message: 'No existe item packing del pedido ' + modfor + '-' + codfor + '-' + nrofor }
            });
        }


        var packing = result.recordset;

        res.status(200).json({
            ok: true,
            packing: packing
        });
    });
});


// ==========================================
// Actualizar cantidades packing
// ==========================================
app.put('/', (req, res) => {

    var body = req.body;
    var resultado = '';
    var error = '';
    var request = new mssql.Request();

    var sQuery = '';
    request.input('MODFOR', mssql.NVarChar, body.MODFOR);
    request.input('CODFOR', mssql.NVarChar, body.CODFOR);
    request.input('NROFOR', mssql.Int, body.NROFOR);
    request.input('NROITM', mssql.Int, body.NROITM);
    request.input('NIVEXP', mssql.NVarChar, body.NIVEXP);
    request.input('TIPPRO', mssql.NVarChar, body.TIPPRO);
    request.input('ARTCOD', mssql.NVarChar, body.ARTCOD);
    request.input('CNTPCK', mssql.Int, body.CNTPCK);
    //request.input('ESTPCK', mssql.NVarChar, body.ESTPCK);
    //request.input('USRPCK', mssql.NVarChar, body.USRPCK);
    request.input('USRPCK', mssql.NVarChar, 'ctrosch');

    sQuery = 'UPDATE FCRMVI ';
    sQuery += 'SET USR_FCRMVI_CNTPK2 = @CNTPCK , USR_FCRMVI_USRPK2 = @USRPCK ';
    sQuery += ' WHERE FCRMVI_MODAPL = @MODFOR ';
    sQuery += ' AND FCRMVI_CODAPL = @CODFOR ';
    sQuery += ' AND FCRMVI_NROAPL = @NROFOR ';
    sQuery += ' AND FCRMVI_ITMAPL = @NROITM ';
    sQuery += ' AND FCRMVI_EXPAPL = @NIVEXP ';
    sQuery += ' AND FCRMVI_TIPPRO = @TIPPRO ';
    sQuery += ' AND FCRMVI_ARTCOD = @ARTCOD ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando cantidades picking',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error actualizando cantidades picking',
                errors: { message: 'Error actualizando cantidades picking' + body }
            });
        }

        res.status(200).json({
            ok: true,
            result: result
        });

    });

});

// ==========================================
// Actualizar estado picking según usuario
// ==========================================
app.put('/confirmar', (req, res) => {

    var body = req.body;
    var resultado = '';
    var error = '';
    var request = new mssql.Request();

    var sQuery = '';

    request.input('USRPK2', mssql.NVarChar, body.usuario);

    sQuery = 'UPDATE FCRMVI ';
    sQuery += 'SET USR_FCRMVI_ESTPK2 = \'B\'  ';
    sQuery += ' WHERE  USR_FCRMVI_USRPK2 = @USRPK2 ';
    sQuery += ' AND FCRMVI_CANTID = USR_FCRMVI_CNTPK2';
    sQuery += ' AND FCRMVI_FECALT > \'20191201\' ';
    sQuery += ' AND USR_FCRMVI_ESTPK2 = \'A\' ';
    sQuery += ' AND (CONVERT(Numeric, dbo.FCRMVI.FCRMVI_NIVEXP) < 10)  ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando estado packing',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error actualizando estado packing',
                errors: { message: 'Error actualizando estado packing' + body }
            });
        }

        res.status(200).json({
            ok: true,
            result: result
        });

    });

});


module.exports = app;