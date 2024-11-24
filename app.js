// Import do framework Express
import express from 'express';
import router from './src/routes/index.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path'
import './src/shared/services/TraducaoYup.js';
import 'dotenv/config'; // Import das variáveis de ambiente utilizando a biblioteca dotenv, arquivo criado na raiz do projeto para armazenar as as variáveis de ambiente necessárias para uso na nossa aplicação


const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Servindo a pasta public corretamente
app.use('/src/public', express.static(path.join(__dirname, 'src/public')));


app.use(cors());

// BodyParser
const { json, urlencoded } = bodyParser;

// Configurar o BodyParser
app.use(json());
app.use(urlencoded({ extended: false }));

app.use(json());

app.use('/', router);

// console.log(process.env);

// INICIA O SERVIDOR NA PORTA INFORMADA
app.listen(process.env.PORT, () => {
    console.log(`Servidor respondendo na porta ${process.env.PORT}`);
});