var express = require('express');

var app = express();


app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'IntercApp API Rest Server v2'
    });

});

module.exports = app;