const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { errors } = require('celebrate');
const routes = require('./routes');
const path = require('path');


const app = express();

//Determina quem pode acessar a aplicação
//Ex: app.use(cors({orgin: 'http://meuapp.com'}));
app.use(cors());
//Informa que formato de arquivo vai ser recebido
app.use(express.json());
//Pra acessar a pasta pública
app.use(express.static('public'));
//Para poder fazer upload
app.use(fileUpload());
//Usa as rotas definidas no arquivo routes.js
app.use(routes);
//Mostra de forma melhor os erros da aplicação, impedindo de gerar erro 500
app.use(errors());

app.use(express.static('uploads'));

module.exports = app;
