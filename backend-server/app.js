// Requires
var express = require('express');
// variable para conexión a sql server
var mssql = require('mssql');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//CORS Middleware
app.use(function(req, res, next) {
    //Enabling CORS 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, contentType,Content-Type, Accept, Authorization");
    next();
});

// Importar rutas
var appRoutes = require('./routes/app');
var colectaRoutes = require('./routes/colecta');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

//Variables de conexión
var config = {
    user: 'sa',
    password: 'serverlogic=2012',
    server: 'INTER2\\SQLSERVER',
    database: 'TEM'
};

//En caso de error
var connection = mssql.connect(config, function(err, res) {
    if (err) {
        throw err;
    } else {
        console.log('Base de datos: \x1b[32m%s\x1b[0m', 'Conectado');
    }
});


// Rutas
app.use('/colecta', colectaRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});