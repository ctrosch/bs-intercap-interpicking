var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mssql = require('mssql');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// ==========================================
// Obtener todos los sitios con despachos de reposicion pendientes
// ==========================================
app.get('/:usuario/:deposito', (req, res, next) => {

    var sitio = req.params.sitio;
    var deposito = req.params.deposito;
    var usuario = req.params.usuario;

    var request = new mssql.Request();
    //request.input('sitio', mssql.NVarChar, sitio);
    request.input('deposito', mssql.NVarChar, deposito);
    request.input('usuario', mssql.NVarChar, usuario);

    var sQuery = ' SELECT TOP 500 MODFOR, CODFOR, NROFOR, FCHMOV, SITIOS, SITDES, CIRCOM, ';
    sQuery += ' DEPOSI, NROCTA, NOMBRE,SITDES_DESCRP, SUM(CANTID) AS CANTID, SUM(CNTPCK) AS CNTPCK, SUM(CNTFST) AS CNTFST ';
    sQuery += ' FROM REP_PENDIENTE_PRODUCTO  ';
    sQuery += ' WHERE 1=1  ';
    sQuery += ' AND DEPOSI = @deposito ';
    sQuery += ' AND (USRPCK IS NULL OR USRPCK = \'\' OR USRPCK = @usuario) ';
    sQuery += ' AND (ESTPCK = \'A\' ) ';
    sQuery += ' GROUP BY MODFOR, CODFOR, NROFOR, FCHMOV, SITIOS, SITDES, CIRCOM, DEPOSI, NROCTA, NOMBRE, SITDES_DESCRP ';
    sQuery += ' ORDER BY SITDES, NROCTA ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                packing: [],
                mensaje: 'Error obteniendo datos reposicion para el deposito ' + deposito,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(200).json({
                ok: false,
                packing: [],
                mensaje: 'No existen datos de reposicion para el deposito ' + deposito,
                errors: { message: 'No existen datos de reposicion para el deposito ' + deposito }
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
    request.query('SELECT TOP 1 * FROM REP_PENDIENTE_PRODUCTO WHERE ID = @id', function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                packing: [],
                mensaje: 'Error obteniendo item packing con el id ' + id,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(200).json({
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
// Obtener lista de items pendientes por despacho
// ==========================================
app.get('/items/:modfor/:codfor/:nrofor', (req, res, next) => {

    var modfor = req.params.modfor;
    var codfor = req.params.codfor;
    var nrofor = req.params.nrofor;

    var request = new mssql.Request();
    request.input('modfor', mssql.NVarChar, modfor);
    request.input('codfor', mssql.NVarChar, codfor);
    request.input('nrofor', mssql.NVarChar, nrofor);

    var sQuery = ' SELECT * FROM REP_PENDIENTE_PRODUCTO ';
    sQuery += ' WHERE MODFOR = @modfor ';
    sQuery += ' AND CODFOR = @codfor ';
    sQuery += ' AND NROFOR = @nrofor ';
    sQuery += ' AND ESTPCK = \'A\' ';
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


        var datos = result.recordset;

        res.status(200).json({
            ok: true,
            datos: datos
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
    request.input('CNTFST', mssql.Int, body.CNTFST);
    request.input('NUBICA', mssql.NVarChar, body.NUBICA);
    request.input('NFECHA', mssql.NVarChar, body.NFECHA);
    request.input('NDESPA', mssql.NVarChar, body.NDESPA);
    //request.input('ESTPCK', mssql.NVarChar, body.ESTPCK);
    //request.input('USRPCK', mssql.NVarChar, body.USRPCK);
    request.input('USRPCK', mssql.NVarChar, body.USUARIO);

    sQuery = ' UPDATE CORMVI ';
    sQuery += 'SET USR_CORMVI_CNTPCK = @CNTPCK, ';
    sQuery += ' USR_CORMVI_CNTFST = @CNTFST, ';
    sQuery += ' USR_CORMVI_USRPCK = @USRPCK , ';
    sQuery += ' USR_CORMVI_ESTPCK = \'A\' ';
    sQuery += ' WHERE CORMVI_MODAPL = @MODFOR ';
    sQuery += ' AND CORMVI_CODAPL = @CODFOR ';
    sQuery += ' AND CORMVI_NROAPL = @NROFOR ';
    sQuery += ' AND CORMVI_ITMAPL = @NROITM ';
    sQuery += ' AND CORMVI_EXPAPL = @NIVEXP ';
    sQuery += ' AND CORMVI_TIPPRO = @TIPPRO ';
    sQuery += ' AND CORMVI_ARTCOD = @ARTCOD ';
    //sQuery += ' AND CORMVI_NUBICA = @NUBICA ';
    //sQuery += ' AND CORMVI_NFECHA = @NFECHA ';
    //sQuery += ' AND CORMVI_NDESPA = @NDESPA ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando cantidades reposición',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error actualizando cantidades reposición',
                errors: { message: 'Error actualizando cantidades reposición' + body }
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

    sQuery = 'UPDATE CORMVI ';
    sQuery += 'SET USR_CORMVI_ESTPCK = \'B\'  ';
    sQuery += ' WHERE  USR_CORMVI_USRPCK = @USRPCK ';
    sQuery += ' AND CORMVI_CANTID = USR_CORMVI_CNTPCK + USR_CORMVI_CNTFST ';
    sQuery += ' AND USR_CORMVI_ESTPCK = \'A\'  ';
    sQuery += ' AND CORMVI_FECALT > \'20200101\' ';
    // sQuery += ' AND (CONVERT(Numeric, dbo.CORMVI.CORMVI_NIVEXP) < 10)  ';


    // console.log(body.USUARIO);
    // console.log(sQuery);

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando estado reposición',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error actualizando estado reposición',
                errors: { message: 'Error actualizando estado reposición' + body }
            });
        }

        res.status(200).json({
            ok: true,
            result: result
        });

    });

});


module.exports = app;