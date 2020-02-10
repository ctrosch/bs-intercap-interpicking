var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mssql = require('mssql');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// ==========================================
// Obtener todos los productos pendientes a colectar
// ==========================================
app.get('/:usuario/:deposito', (req, res, next) => {

    var sitio = req.params.sitio;
    var deposito = req.params.deposito;
    var usuario = req.params.usuario;

    var sOrden = ' NUBICA, TIPPRO, ARTCOD, NROCTA';

    // VER COMO CAMBIAR ESTO
    if (deposito === '40') {
        sOrden = ' TIPPRO, ARTCOD, NROCTA, NUBICA';
    }

    var request = new mssql.Request();
    // request.input('sitio', mssql.NVarChar, sitio);
    request.input('deposito', mssql.NVarChar, deposito);
    request.input('usuario', mssql.NVarChar, usuario);

    var sQuery = 'SELECT TOP 1000 * FROM PCK_PENDIENTE_PRODUCTO P ';
    sQuery += ' WHERE P.DEPOSI = @deposito ';
    // sQuery += ' AND P.SITIOS = @sitio  ';
    sQuery += ' AND (USRPCK IS NULL OR USRPCK = \'\' OR USRPCK = @usuario) ';
    sQuery += ' AND (ESTPCK = \'A\' ) ';
    sQuery += ' ORDER BY ' + sOrden;

    request.query(sQuery, function(err, result) {


        if (err) {
            return res.status(500).json({
                ok: false,
                colecta: [],
                mensaje: 'Error obteniendo datos colecta para el deposito ' + deposito,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(200).json({
                ok: false,
                colecta: [],
                mensaje: 'No existen datos de colecta para el sitio deposito ' + deposito,
                errors: { message: 'No existen datos de colecta para el deposito ' + deposito }
            });
        }

        var colecta = result.recordset;

        res.status(200).json({
            ok: true,
            colecta: colecta
        });
    });
});

// ==========================================
// Obtener un item pendiente
// ==========================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;

    var request = new mssql.Request();
    request.input('id', mssql.NVarChar, id);
    request.query('SELECT TOP 1 * FROM PCK_PENDIENTE_PRODUCTO WHERE ID = @id', function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                colecta: [],
                mensaje: 'Error obteniendo item colecta con el id ' + id,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
                colecta: [],
                mensaje: 'No existe item colecta con id ' + id,
                errors: { message: 'No existe item colecta con id ' + id }
            });
        }


        var colecta = result.recordset[0];

        res.status(200).json({
            ok: true,
            colecta: colecta
        });
    });
});


// ==========================================
// Actualizar cantidades picking y faltante
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
    request.input('CNTFST', mssql.Int, body.CNTFST);
    //request.input('ESTPCK', mssql.NVarChar, body.ESTPCK);
    //request.input('USRPCK', mssql.NVarChar, body.USRPCK);
    request.input('USRPCK', mssql.NVarChar, body.USUARIO);

    // console.log(body.USUARIO);

    sQuery = 'UPDATE FCRMVI ';
    sQuery += 'SET USR_FCRMVI_CNTPCK = @CNTPCK , USR_FCRMVI_CNTFST = @CNTFST, USR_FCRMVI_USRPCK = @USRPCK , USR_FCRMVI_ESTPCK = \'A\' ';
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
                colecta: [],
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

    request.input('USRPCK', mssql.NVarChar, body.usuario);

    sQuery = 'UPDATE FCRMVI ';
    sQuery += 'SET USR_FCRMVI_ESTPCK = \'B\'  ';
    sQuery += ' WHERE USR_FCRMVI_USRPCK = @USRPCK  ';
    sQuery += ' AND FCRMVI_CANTID = USR_FCRMVI_CNTPCK + USR_FCRMVI_CNTFST ';
    sQuery += ' AND FCRMVI_FECALT > \'20191201\' ';
    sQuery += ' AND USR_FCRMVI_ESTPCK = \'A\' ';
    // sQuery += ' AND (CONVERT(Numeric, dbo.FCRMVI.FCRMVI_NIVEXP) < 10)  ';

    // console.log(body.usuario);
    // console.log(sQuery);

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando estado picking',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error actualizando estado picking',
                errors: { message: 'Error actualizando estado picking' + body }
            });
        }

        res.status(200).json({
            ok: true,
            result: result
        });

    });

});


module.exports = app;