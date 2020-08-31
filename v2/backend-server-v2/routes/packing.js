var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mssql = require('mssql');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// ==========================================
// Obtener todos los clientes con items pendientes de packing
// ==========================================
app.get('/clientes/:deposito', (req, res, next) => {

    var deposito = req.params.deposito;
    //var usuario = req.params.usuario;

    var request = new mssql.Request();
    //request.input('sitio', mssql.NVarChar, sitio);
    request.input('deposito', mssql.NVarChar, deposito);
    //request.input('usuario', mssql.NVarChar, usuario);

    var sQuery = ' SELECT TOP 500 * FROM PCK_PENDIENTE_PACKING ';
    sQuery += ' WHERE 1=1  ';
    sQuery += ' AND DEPOSI = @deposito ';
    //sQuery += ' AND (USRPK2 IS NULL OR USRPK2 = \'\' OR USRPK2 = @usuario OR (CNTPK2 = 0 AND USRPK2 <> \'\')) ';
    //sQuery += ' AND (USRPK2 IS NULL OR USRPK2 = \'\' OR USRPK2 = @usuario ) ';
    //sQuery += ' AND (ESTPCK = \'B\' ) ';
    sQuery += ' ORDER BY TRADES, NROCTA ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                clientes: [],
                mensaje: 'Error obteniendo datos packing para el deposito ' + deposito,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(200).json({
                ok: false,
                clientes: [],
                mensaje: 'No existen datos de packing para el deposito ' + deposito,
                errors: { message: 'No existen datos de packing para el deposito ' + deposito }
            });
        }

        var clientes = result.recordset;

        res.status(200).json({
            ok: true,
            clientes: clientes
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
// Obtener lista de items pendientes por pedido
// ==========================================
app.get('/items/:circom/:deposi/:nrocta/:tracod/:nrofor', (req, res, next) => {

    var circom = req.params.circom;
    var deposi = req.params.deposi;
    var nrocta = req.params.nrocta;
    var tracod = req.params.tracod;
    var nrofor = req.params.nrofor;

    var request = new mssql.Request();
    request.input('circom', mssql.NVarChar, circom);
    request.input('deposi', mssql.NVarChar, deposi);
    request.input('nrocta', mssql.NVarChar, nrocta);
    request.input('tracod', mssql.NVarChar, tracod);
    request.input('nrofor', mssql.NVarChar, nrofor);

    var sQuery = ' SELECT * FROM PCK_PENDIENTE_PRODUCTO ';
    sQuery += ' WHERE CIRCOM = @circom ';
    sQuery += ' AND DEPOSI = @deposi ';
    sQuery += ' AND NROCTA = @nrocta ';
    sQuery += ' AND TRACOD = @tracod ';
    sQuery += ' AND ESTPCK = \'B\' ';
    sQuery += ' AND (NROBUL = \'\' OR NROBUL = @nrofor )';
    sQuery += ' ORDER BY TIPPRO, ARTCOD ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                productos: [],
                mensaje: 'Error obteniendo items pendientes de packing para el número de cuenta' + nrocta,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
                productos: [],
                mensaje: 'No existe item pendientes de packing para ' + nrocta,
                errors: { message: 'No existe item pendientes de packing para ' + nrocta }
            });
        }


        var productos = result.recordset;

        res.status(200).json({
            ok: true,
            packing: productos
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
    request.input('CNTPK2', mssql.Int, body.CNTPK2);
    request.input('NUBICA', mssql.NVarChar, body.NUBICA);
    request.input('NFECHA', mssql.NVarChar, body.NFECHA);
    request.input('NDESPA', mssql.NVarChar, body.NDESPA);
    request.input('ESTPCK', mssql.NVarChar, body.ESTPCK);
    request.input('NROBUL', mssql.NVarChar, body.NROBUL);
    request.input('USRPK2', mssql.NVarChar, body.USUARIO);


    console.log('body.NRONUL ' + body.NROBUL);



    sQuery = ' UPDATE FCRMVP SET';
    sQuery += ' USR_FCRMVP_CNTPK2 = CASE WHEN FCRMVP_CODFOR = FCRMVP_CODAPL  THEN @CNTPK2 ELSE 0 END ,';
    sQuery += ' USR_FCRMVP_USRPK2 = @USRPK2, ';
    sQuery += ' USR_FCRMVP_NROBUL = @NROBUL, ';
    sQuery += ' USR_FCRMVP_ESTPK2 = \'A\' ,';
    sQuery += ' USR_FCRMVP_HORPK2 = GETDATE() ,';
    sQuery += ' USR_FCRMVP_ESTPCK = @ESTPCK ';
    sQuery += ' WHERE FCRMVP_MODAPL = @MODFOR ';
    sQuery += ' AND FCRMVP_CODAPL = @CODFOR ';
    sQuery += ' AND FCRMVP_NROAPL = @NROFOR ';
    sQuery += ' AND FCRMVP_ITMAPL = @NROITM ';
    sQuery += ' AND FCRMVP_EXPAPL = @NIVEXP ';
    sQuery += ' AND FCRMVP_TIPPRO = @TIPPRO ';
    sQuery += ' AND FCRMVP_ARTCOD = @ARTCOD ';
    sQuery += ' AND FCRMVP_NUBICA = @NUBICA ';
    sQuery += ' AND FCRMVP_NFECHA = @NFECHA ';
    sQuery += ' AND FCRMVP_NDESPA = @NDESPA ';
    //sQuery += ' AND FCRMVP_CODFOR = FCRMVP_CODAPL ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando cantidades packing',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error actualizando cantidades packing',
                errors: { message: 'Error actualizando cantidades packing' + body }
            });
        }

        res.status(200).json({
            ok: true,
            result: result
        });

    });

});

// ==========================================
// Actualizar estado packing según usuario
// ==========================================
app.put('/confirmar', (req, res) => {

    // var items = JSON.parse(req.body.datos);
    var body = req.body;
    var request = new mssql.Request();


    request.input('@usuario', mssql.NVarChar, body.usuario);
    //EXECUTE
    request.query('EXEC CONFIRMAR_PACKING \'' + body.usuario + '\' ', (err, result) => {
        // ... error checks



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error confirmando packing',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error confirmando packing',
                errors: { message: 'Error confirmando packing' + body }
            });
        }

        res.status(200).json({
            ok: true,
            result: result
        });

        // ...
    });


});


module.exports = app;

module.exports = app;