var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mssql = require('mssql');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

// ==========================================
// Obtener todos los clientes con despachos pendientes
// ==========================================
app.get('/:sitio/:deposito', (req, res, next) => {

    var sitio = req.params.sitio;
    var deposito = req.params.deposito;

    var request = new mssql.Request();
    request.input('sitio', mssql.NVarChar, sitio);
    request.input('deposito', mssql.NVarChar, deposito);
    request.query('SELECT * FROM PCK_PENDIENTE_CLIENTE WHERE SITIOS = @sitio AND DEPOSI = @deposito ORDER BY TRADES, NROCTA', function(err, result) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error obteniendo datos packing para el sitio ' + sitio + ', deposito ' + deposito,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
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
                mensaje: 'Error obteniendo item packing con el id ' + id,
                errors: err
            });
        }

        if (!result.recordset || result.recordset.length === 0) {
            return res.status(400).json({
                ok: false,
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
// Actualizar cantidades packing
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
            sQuery += 'SET USR_FCRMVI_CNTPK2 = @CNTPCK , USR_FCRMVI_ESTPK2 = @ESTPCK ';
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