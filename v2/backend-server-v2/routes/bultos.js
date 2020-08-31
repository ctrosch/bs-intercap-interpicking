var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mssql = require('mssql');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Bultos'
    });

});

// ==========================================
// Crear un nuevo bulto
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;
    var request = new mssql.Request();
    var request1 = new mssql.Request();

    var sQuery = '';

    request.input('CODFOR', mssql.NVarChar, body.CODFOR);
    request.input('NROFOR', mssql.NVarChar, body.NROFOR);
    //request.input('FCHMOV', mssql.NVarChar, body.FCHMOV);
    //request.input('ESTADO', mssql.NVarChar, body.ESTADO);    
    request.input('CIRCOM', mssql.NVarChar, body.CIRCOM);
    request.input('DEPOSI', mssql.NVarChar, body.DEPOSI);
    request.input('NROCTA', mssql.NVarChar, body.NROCTA);
    request.input('OBSERV', mssql.NVarChar, body.OBSERV);
    request.input('USRPCK', mssql.NVarChar, body.USRPCK);
    request.input('TRACOD', mssql.NVarChar, body.TRACOD);

    sQuery = ' INSERT INTO USR_FCBULT  ';
    sQuery += ' (USR_FCBULT_CODFOR, USR_FCBULT_NROFOR, USR_FCBULT_FCHMOV, USR_FCBULT_ESTADO,';
    sQuery += ' USR_FCBULT_NROCTA, USR_FCBULT_OBSERV, USR_FCBULT_USRPCK, ';
    sQuery += ' USR_FCBULT_DEPOSI, USR_FCBULT_TRACOD, USR_FCBULT_CIRCOM, ';
    sQuery += ' USR_FC_FECALT, USR_FC_FECMOD, USR_FC_USERID, ';
    sQuery += ' USR_FC_ULTOPR, USR_FC_DEBAJA,USR_FC_OALIAS)';

    sQuery += 'VALUES(@codfor, @nrofor, ';
    sQuery += ' GETDATE(), \'A\', ';
    sQuery += ' @nrocta, @observ, @usrpck, ';
    sQuery += ' @deposi, @tracod, @circom, ';
    sQuery += ' GETDATE(), GETDATE(), \'API\',';
    sQuery += '\'A\', \'N\', \'USR_FCBULT\');';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error creando bulto ' + nrofor,
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando bulto' + nrofor,
                errors: { message: 'Error creando bulto' + body }
            });
        }



        res.status(200).json({
            ok: true,
            result: result
        });
    });
});

// ==========================================
// Actualizar Bulto
// ==========================================
app.put('/', (req, res) => {

    var body = req.body;
    var request = new mssql.Request();

    var sQuery = '';
    request.input('CODFOR', mssql.NVarChar, body.CODFOR);
    request.input('NROFOR', mssql.NVarChar, body.NROFOR);
    request.input('FCHMOV', mssql.NVarChar, body.FCHMOV);
    request.input('ESTADO', mssql.NVarChar, body.ESTADO);
    request.input('NROCTA', mssql.NVarChar, body.NROCTA);
    request.input('OBSERV', mssql.NVarChar, body.OBSERV);
    request.input('USRPCK', mssql.NVarChar, body.USRPCK);
    request.input('DEPOSI', mssql.NVarChar, body.DEPOSI);
    request.input('TRACOD', mssql.NVarChar, body.TRACOD);
    request.input('CIRCOM', mssql.NVarChar, body.CIRCOM);

    sQuery = ' UPDATE USR_FCBULT SET  ';
    sQuery += ' USR_FCBULT_ESTADO = @estado,  ';
    sQuery += ' USR_FCBULT_OBSERV = @observ,       ';
    sQuery += ' USR_FC_FECMOD= GETDATE(), ';
    sQuery += ' USR_FC_ULTOPR=\'M\'  ';
    sQuery += ' WHERE USR_FCBULT_CODFOR=@codfor AND USR_FCBULT_NROFOR=@nrofor; ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error actualizando bultos',
                errors: err
            });
        }

        if (!result) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error actualizando bultos',
                errors: { message: 'Error actualizando bultos' + body }
            });
        }

        res.status(200).json({
            ok: true,
            result: result
        });
    });
});

// ==========================================
// Obtener bulto por id
// ==========================================
app.get('/:codfor/:nrofor', (req, res, next) => {

    var codfor = req.params.codfor;
    var nrofor = req.params.nrofor;

    var request = new mssql.Request();
    //request.input('sitio', mssql.NVarChar, sitio);
    request.input('codfor', mssql.NVarChar, codfor);
    request.input('nrofor', mssql.NVarChar, nrofor);

    var sQuery = ' SELECT ';
    sQuery += ' USR_FCBULT_CODFOR AS CODFOR, ';
    sQuery += ' USR_FCBULT_NROFOR AS NROFOR, ';
    sQuery += ' USR_FCBULT_FCHMOV AS FCHMOV, ';
    sQuery += ' USR_FCBULT_CIRCOM AS CIRCOM, ';
    sQuery += ' CASE WHEN USR_FCBULT_CIRCOM = \'0250\' THEN \'MAYORISTA\' WHEN USR_FCBULT_CIRCOM = \'0260\' THEN \'DROPSHIPPING\' WHEN USR_FCBULT_CIRCOM = \'0270\' THEN \'ONLINE\' ELSE \'MAYORISTA\' END AS CIRDES, ';
    sQuery += ' USR_FCBULT_TRACOD AS TRACOD, ';
    sQuery += ' GRTTRA_DESCRP AS TRADES, ';
    sQuery += ' USR_FCBULT_NROCTA AS NROCTA, ';
    sQuery += ' VTMCLH_NOMBRE AS NOMBRE, ';
    sQuery += ' USR_FCBULT_DEPOSI AS DEPOSI, ';
    sQuery += ' USR_FCBULT_OBSERV AS OBSERV, ';
    sQuery += ' USR_FCBULT_USRPCK AS USRPCK, ';
    sQuery += ' USR_FCBULT_ESTADO AS ESTADO ';
    sQuery += ' FROM USR_FCBULT    ';
    sQuery += ' INNER JOIN VTMCLH ON USR_FCBULT_NROCTA = VTMCLH_NROCTA ';
    sQuery += ' INNER JOIN GRTTRA ON USR_FCBULT_TRACOD = GRTTRA_TRACOD  ';
    sQuery += ' WHERE USR_FCBULT_CODFOR=@codfor AND USR_FCBULT_NROFOR=@nrofor; ';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                bulto: {},
                mensaje: 'Error obteniendo bulto ' + codfor + ' - ' + nrofor,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(200).json({
                ok: false,
                bulto: {},
                mensaje: 'Error obteniendo bulto ' + codfor + ' - ' + nrofor,
                errors: { message: 'Error obteniendo bulto ' + codfor + ' - ' + nrofor }
            });
        }

        var bulto = result.recordset[0];

        res.status(200).json({
            ok: true,
            bulto: bulto
        });
    });
});

// ==========================================
// Obtener proximo numero
// ==========================================
app.get('/:codfor', (req, res, next) => {

    var codfor = req.params.codfor;

    var request = new mssql.Request();
    //request.input('sitio', mssql.NVarChar, sitio);
    request.input('codfor', mssql.NVarChar, codfor);

    var sQuery = '(SELECT ISNULL(MAX(USR_FCBULT_NROFOR),0)+1 AS NROFOR FROM USR_FCBULT WHERE USR_FCBULT_CODFOR = @codfor)';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                proximoNumero: 0,
                mensaje: 'Error obteniendo bulto ' + codfor + ' - ' + nrofor,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(200).json({
                ok: false,
                proximoNumero: 0,
                mensaje: 'Error obteniendo bulto ' + codfor + ' - ' + nrofor,
                errors: { message: 'Error obteniendo bulto ' + codfor + ' - ' + nrofor }
            });
        }

        var proximoNumero = result.recordset[0];

        res.status(200).json({
            ok: true,
            proximoNumero: proximoNumero.NROFOR
        });
    });
});


// ==========================================
// Obtener todos los bultos por usuario y estado
// ==========================================
app.get('/pendientes/:usuario/:estado', (req, res, next) => {

    var estado = req.params.estado;
    var usuario = req.params.usuario;

    var request = new mssql.Request();
    //request.input('sitio', mssql.NVarChar, sitio);
    request.input('estado', mssql.NVarChar, estado);
    request.input('usuario', mssql.NVarChar, usuario);

    var sQuery = ' SELECT TOP 100 ';
    sQuery += ' USR_FCBULT_CODFOR AS CODFOR, ';
    sQuery += ' USR_FCBULT_NROFOR AS NROFOR, ';
    sQuery += ' USR_FCBULT_FCHMOV AS FCHMOV, ';
    sQuery += ' USR_FCBULT_CIRCOM AS CIRCOM, ';
    sQuery += ' CASE WHEN USR_FCBULT_CIRCOM = \'0250\' THEN \'MAYORISTA\' WHEN USR_FCBULT_CIRCOM = \'0260\' THEN \'DROPSHIPPING\' WHEN USR_FCBULT_CIRCOM = \'0270\' THEN \'ONLINE\' ELSE \'MAYORISTA\' END AS CIRDES, ';
    sQuery += ' USR_FCBULT_TRACOD AS TRACOD, ';
    sQuery += ' GRTTRA_DESCRP AS TRADES, ';
    sQuery += ' USR_FCBULT_NROCTA AS NROCTA, ';
    sQuery += ' VTMCLH_NOMBRE AS NOMBRE, ';
    sQuery += ' USR_FCBULT_DEPOSI AS DEPOSI, ';
    sQuery += ' USR_FCBULT_OBSERV AS OBSERV, ';
    sQuery += ' USR_FCBULT_USRPCK AS USRPCK, ';
    sQuery += ' USR_FCBULT_ESTADO AS ESTADO ';
    sQuery += ' FROM USR_FCBULT    ';
    sQuery += ' INNER JOIN VTMCLH ON USR_FCBULT_NROCTA = VTMCLH_NROCTA ';
    sQuery += ' INNER JOIN GRTTRA ON USR_FCBULT_TRACOD = GRTTRA_TRACOD  ';
    sQuery += ' WHERE 1=1  ';
    sQuery += ' AND USR_FCBULT_USRPCK = @usuario ';
    sQuery += ' AND USR_FCBULT_ESTADO IN (\'A\',\'B\') ';
    sQuery += ' ORDER BY USR_FCBULT_NROFOR';

    request.query(sQuery, function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                bultos: [],
                mensaje: 'Error obteniendo datos de bultos para el usuario ' + usuario,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(200).json({
                ok: false,
                bultos: [],
                mensaje: 'No existen datos de bultos para el usuario ' + usuario,
                errors: { message: 'No existen datos de bultos para el usuario ' + usuario }
            });
        }

        var bultos = result.recordset;

        res.status(200).json({
            ok: true,
            bultos: bultos
        });
    });
});




module.exports = app;