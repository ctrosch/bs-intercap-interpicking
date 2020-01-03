var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mssql = require('mssql');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// ==========================================
// Obtener todos los productos pendientes a colectar
// ==========================================
app.get('/:sitio/:deposito', (req, res, next) => {

    var sitio = req.params.sitio;
    var deposito = req.params.deposito;

    var request = new mssql.Request();
    request.input('sitio', mssql.NVarChar, sitio);
    request.input('deposito', mssql.NVarChar, deposito);
    request.query('SELECT TOP 20 P.* FROM PCK_PENDIENTE_PRODUCTO P WHERE P.SITIOS = @sitio AND P.DEPOSI = @deposito', function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error obteniendo datos colecta para el sitio ' + sitio + ', deposito ' + deposito,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existen datos de colecta para el sitio ' + sitio + ', deposito ' + deposito,
                errors: { message: 'No existen datos de colecta para el sitio ' + sitio + ', deposito ' + deposito }
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
                mensaje: 'Error obteniendo item colecta con el id ' + id,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe item colecta con id ' + id,
                errors: { message: 'No existe item colecta con id ' + id }
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
// Actualizar cantidades picking
// ==========================================
app.put('/', (req, res) => {

    var body = req.body;
    var resultado = '';
    var error = '';

    var datos = JSON.parse(JSON.stringify(body));

    datos.forEach(item => {

        if (item.ESTPCK === 'B') {

            var request = new mssql.Request();
            var sQuery = '';
            request.input('MODFOR', mssql.NVarChar, item.MODFOR);
            request.input('CODFOR', mssql.NVarChar, item.CODFOR);
            request.input('NROFOR', mssql.Int, item.NROFOR);
            request.input('NROITM', mssql.Int, item.NROITM);
            request.input('NIVEXP', mssql.NVarChar, item.NIVEXP);
            request.input('TIPPRO', mssql.NVarChar, item.TIPPRO);
            request.input('ARTCOD', mssql.NVarChar, item.ARTCOD);
            request.input('CNTPCK', mssql.Int, item.CNTPCK);
            request.input('ESTPCK', mssql.NVarChar, item.ESTPCK);

            sQuery = 'UPDATE FCRMVI ';
            sQuery += 'SET USR_FCRMVI_CNTPCK = @CNTPCK , USR_FCRMVI_ESTPCK = @ESTPCK ';
            sQuery += ' WHERE FCRMVI_MODFOR = @MODFOR ';
            sQuery += ' AND FCRMVI_CODFOR = @CODFOR ';
            sQuery += ' AND FCRMVI_NROFOR = @NROFOR ';
            sQuery += ' AND FCRMVI_NROITM = @NROITM ';
            sQuery += ' AND FCRMVI_NIVEXP = @NIVEXP ';
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

                resultado = result;

            });


        }
    });

    res.status(200).json({
        ok: true,
        result: resultado
    });


});


module.exports = app;