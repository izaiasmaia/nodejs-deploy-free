import { obterConexaoDoPool, sqlExecute } from '../config/db.js';
import Cliente from '../Models/clienteModel.js';
import Telefone from '../Models/telefoneModel.js';
import Endereco from '../Models/enderecoModel.js';
import Login from '../Models/loginModel.js';
import {cpfCnpjValidation} from  '../utils/CpfCnpjValidation.js';
import * as yup from 'yup';
import bcrypt from 'bcrypt';
import { validation } from '../shared/middleware/Validation.js';


export const clienteController = {

    index: async (req, res) => {
        try {
            res.json({ title: 'Página inicial clientes' });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    insertCliente: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();

            // console.log(req.body);
            const { nome, cpf, email, telefones, logradouro, numero, bairro, complemento, cidade, uf, cep, senha, perfil } = req.body;

            let objTelefone;

            // Cria os objetos necessários
            const objCliente = new Cliente({ nome: nome, cpf: cpf, email: email })
            // objTelefone = new Telefone(telefones);
            const objEndereco = new Endereco({ logradouro: logradouro, numero: numero, bairro: bairro, complemento: complemento, cidade: cidade, uf: uf, cep: cep });
            const encriptedPass = await encriptedPassword(senha);
            const objLogin = new Login({ login: email, senha: encriptedPass, perfil: perfil })

            // Monta a query com seus respectivos valores, caso existam
            const clienteSqlValues = await objCliente.insertCliente();
            // const telefoneSqlValues = await objTelefone.insertTelefone();
            const enderecoSqlValues = await objEndereco.insertEndereco();

            const loginSqlValues = await objLogin.insertLogin();

            // Cria um array com as queries e values de cada objeto
            //const queries = [clienteSqlValues, telefoneSqlValues, enderecoSqlValues];
            const queries = [clienteSqlValues, enderecoSqlValues, loginSqlValues];
            let cont = 1;
            for (const numero of telefones) {

                // Monta as queries dos telefones e inclui no array
                objTelefone = new Telefone(numero);
                queries.push(await objTelefone.insertTelefone());
                cont++
            };

            console.log(queries);

            // Chama a função para executar as queries
            const results = await sqlExecute(conn, ...queries)
            // console.log(results);

            res.json({ data: results });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    }
};

async function encriptedPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// Schema de validação usando yup
export const inserirClienteValidacao = validation((getSchema) => ({
    body: getSchema(
        yup.object().shape({
            nome: yup.string().required().min(4).max(45),
            cpf: yup.string().matches(/^\d{11}$/).test('CPF válido','CPF inválido',(value) => cpfCnpjValidation(value)).required(),
            email: yup.string().email().required(),
            telefones: yup.array().of(
                yup.object().shape({
                    numero: yup.string().matches(/^\d{10,11}$/).required()
                })
            ),
            logradouro: yup.string().required().min(4).max(100),
            numero: yup.string().required().min(1).max(10),
            bairro: yup.string().required().min(4).max(50),
            cidade: yup.string().required().min(4).max(50),
            uf: yup.string().required().min(2).max(2),
            cep: yup.string().matches(/^\d{8}$/).required(),
            senha: yup.string().required().min(4).max(50),
            perfil: yup.string().required(),
        })
    ),
}));



// export default clienteController;