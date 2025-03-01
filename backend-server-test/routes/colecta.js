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

    var deposito = req.params.deposito;
    var usuario = req.params.usuario;

    var sOrden = ' NUBICA, TIPPRO, ARTCOD, NROCTA';

    // VER COMO CAMBIAR ESTO
    if (deposito === '40') {
        sOrden = ' TIPPRO, ARTCOD, NROCTA, NUBICA';
    }

    // VER COMO CAMBIAR ESTO
    if (deposito === '30') {
        sOrden = ' FCHMOV, NUBICA, TIPPRO, ARTCOD, NROCTA';
    }

    var request = new mssql.Request();
    // request.input('sitio', mssql.NVarChar, sitio);
    request.input('deposito', mssql.NVarChar, deposito);
    request.input('usuario', mssql.NVarChar, usuario);

    var sQuery = 'SELECT TOP 1500 P.* FROM PCK_PENDIENTE_PRODUCTO P ';
    sQuery += ' WHERE P.DEPOSI = @deposito ';
    sQuery += ' AND (USRPCK IS NULL OR USRPCK = \'\' OR USRPCK = @usuario OR (CNTPCK+CNTFST = 0 AND USRPCK <> \'\')) ';
    sQuery += ' AND (ESTPK2 = \'A\' ) ';
    sQuery += ' ORDER BY ' + sOrden;

    //console.log(request);
    //console.log(req.params);
    //console.log(sQuery);

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
    request.input('NUBICA', mssql.NVarChar, body.NUBICA);
    request.input('NFECHA', mssql.NVarChar, body.NFECHA);
    request.input('NDESPA', mssql.NVarChar, body.NDESPA);
    //request.input('ESTPCK', mssql.NVarChar, body.ESTPCK);
    //request.input('USRPCK', mssql.NVarChar, body.USRPCK);
    request.input('USRPCK', mssql.NVarChar, body.USUARIO);

    // console.log(body.USUARIO);

    sQuery = 'UPDATE FCRMVP ';
    sQuery += 'SET USR_FCRMVP_CNTPCK = CASE WHEN FCRMVP_CODFOR = FCRMVP_CODAPL  THEN @CNTPCK ELSE 0 END , ';
    sQuery += '  USR_FCRMVP_CNTFST = CASE WHEN FCRMVP_CODFOR = FCRMVP_CODAPL  THEN @CNTFST ELSE 0 END, ';
    sQuery += '  USR_FCRMVP_USRPCK = @USRPCK , USR_FCRMVP_ESTPCK = \'A\' ';
    sQuery += ' ,USR_FCRMVP_HORPCK = GETDATE() ';
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

    // var items = JSON.parse(req.body.datos);
    var body = req.body;
    var request = new mssql.Request();


    request.input('@usuario', mssql.NVarChar, body.usuario);
    //EXECUTE
    request.query('EXEC CONFIRMAR_PICKING \'' + body.usuario + '\' ', (err, result) => {
        // ... error checks



        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error confirmando picking',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error confirmando picking',
                errors: { message: 'Error confirmando picking' + body }
            });
        }

        res.status(200).json({
            ok: true,
            result: result
        });

        // ...
    });


});

// ==========================================
// Actualizar estado picking según usuario
// ==========================================
app.put('/confirmar-old', (req, res) => {

    // var items = JSON.parse(req.body.datos);
    var body = req.body;
    var resultado = '';
    var error = '';
    var request = new mssql.Request();

    var sQuery = '';

    request.input('USRPCK', mssql.NVarChar, body.usuario);

    sQuery = 'UPDATE FCRMVP ';
    sQuery += 'SET USR_FCRMVP_ESTPCK = \'B\'  ';
    sQuery += ' WHERE USR_FCRMVP_USRPCK = @USRPCK  ';
    sQuery += ' AND FCRMVP_CANTID = USR_FCRMVP_CNTPCK + USR_FCRMVP_CNTFST ';
    sQuery += ' AND FCRMVP_FECALT > \'20200101\' ';
    sQuery += ' AND USR_FCRMVP_ESTPCK = \'A\'  ';


    /**
    sQuery = 'UPDATE FCRMVP ';
    sQuery += 'SET USR_FCRMVP_ESTPCK = \'B\'  ';
    sQuery += ' WHERE FCRMVP_FECALT > \'20200101\'  ';
    sQuery += ' AND (  ';

    hayItems = false;
    agregaOR = false;

    for (i in items) {

        if (i.CANTID = i.CNTPCK + i.CNTFST) {

            if (agregaOR) {
                sQuery += ' OR ';
            }

            sQuery += ' ( FCRMVP_MODAPL = \'' + i.MODFOR + '\' AND FCRMVP_CODAPL = \'' + i.CODFOR + '\' AND FCRMVP_NROAPL = \'' + i.NROFOR + '\' ';
            sQuery += ' AND FCRMVP_ITMAPL = \'' + i.NROITM + '\' AND FCRMVP_EXPAPL = \'' + i.NIVEXP + '\' ';
            sQuery += ' AND FCRMVP_TIPPRO = \'' + i.TIPPRO + '\' AND FCRMVP_ARTCOD = \'' + i.ARTCOD + '\' AND USR_FCRMVP_ESTPCK = \'A\' ';
            sQuery += ' AND USR_FCRMVP_USRPCK = \'' + i.USRPCK + '\') ';

            agregaOR = true;
            hayItems = true;
        }
    }

    if (!hayItems) {
        sQuery += '1 = 0 ';
    }

    sQuery += '  ) ';
    */

    // sQuery += ' AND (CONVERT(Numeric, dbo.FCRMVI.FCRMVI_NIVEXP) < 10)  ';
    // console.log(body.usuario);


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