import { obterConexaoDoPool, sqlExecute } from "../config/db.js";
import ProdutoValor from "../Models/produtoValorModel.js";
import Produto from './../Models/produtoModel.js';
import { validation } from '../shared/middleware/Validation.js';
import * as yup from 'yup';
import multer from 'multer';
import path from 'path';
import { log } from "console";
import { StatusCodes } from "http-status-codes";
import { excluirImagem } from "../utils/ExcluiImagem.js";



// // Configuração do multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'caminho/para/salvar/imagens'); // Altere para o caminho desejado
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname); // Nome único para evitar conflitos
//     }
// });

// const upload = multer({ storage: storage }).single('imagem');

export const produtoController = {

    index: (req, res) => {
        res.json({ title: 'Bem vindo ao produto' });
    },
    insertProduto: async (req, res) => {
        try {
            const { filename } = req.file;
            const conn = await obterConexaoDoPool();
            const { idCategoria, descricao, valorCusto, valorVenda } = req.body;

            // Cria os objetos necessários
            const objProduto = new Produto({ idCategoria: idCategoria, descricao: descricao, ativo: 1, estoqueControlado: 0, imagem: filename })
            const objProdutoValor = new ProdutoValor({ valorCusto: valorCusto, valorVenda: valorVenda, ativo: 1 })
            log('ASD', req.file)
            log('ASD', objProduto)

            // Monta a query com seus respectivos valores, caso existam
            const produtoSqlValues = await objProduto.insertProduto();
            const produtoValorSqlValues = await objProdutoValor.insertProdutoValor();

            // Cria um array com as queries e values de cada objeto
            const queries = [produtoSqlValues, produtoValorSqlValues];

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

    },
    updateProduto: async (req, res) => {
        try {
            console.log('Chegou no update', req.body);

            // Verificar problema quando imagem não é alterada no update
            const conn = await obterConexaoDoPool();
            let filename;
            if (req.file) {
                ({ filename } = req.file);

                // Código para excluir uma imagem caso ela seja alterada ou excluído o produto relacionado
                const querieNomeImagem = await Produto.imagemProduto(req.body.id)
                const nomeImagem = [querieNomeImagem];
                const [[{ IMAGEM_PATH }]] = await sqlExecute(conn, ...nomeImagem);
                console.log('Nome da imagem', IMAGEM_PATH);

                excluirImagem(`../public/uploads/imagensProdutos/${IMAGEM_PATH}`)

            }
            const { id, idCategoria, descricao, ativoProduto, estoque, idValor, valorCusto, valorVenda, ativoValor } = req.body;

            // Cria os objetos necessários
            const objProduto = new Produto({ id: id, idCategoria: idCategoria, descricao: descricao, ativo: ativoProduto, estoqueControlado: estoque, imagem: filename })
            const objProdutoValor = new ProdutoValor({ idValor: idValor, idProduto: id, valorCusto: valorCusto, valorVenda: valorVenda, ativo: ativoValor })

            console.log(objProdutoValor);

            // verifica se o valor informado é o mesmo que já está na tabela
            const verificaProdutoValorSqlValues = await objProdutoValor.verificaValor();
            const querieVerificavalor = [verificaProdutoValorSqlValues];


            // Chama a função para executar as queries
            const resultVerificaValor = await sqlExecute(conn, ...querieVerificavalor)

            // console.log("Resultado select :", resultVerificaValor);

            // Monta a query com seus respectivos valores, caso existam
            let produtoValorSqlValuesUpdate;
            let produtoValorSqlValues;
            let queries;

            const produtoSqlValues = await objProduto.updateProduto();

            if (resultVerificaValor[0][0].TOTAL === 0) {
                console.log("Resultado select :", resultVerificaValor[0][0].TOTAL);
                produtoValorSqlValuesUpdate = await objProdutoValor.updateProdutoValor();
                produtoValorSqlValues = await objProdutoValor.insertProdutoValor();
                queries = [produtoSqlValues, produtoValorSqlValuesUpdate, produtoValorSqlValues];
            } else {
                queries = [produtoSqlValues];
            }

            // console.log(produtoValorSqlValuesUpdate);


            // Cria um array com as queries e values de cada objeto

            // Chama a função para executar as queries
            const results = await sqlExecute(conn, ...queries);
            // const results = true;
            console.log('RESULTADO UPDATE', results);

            res.status(StatusCodes.OK).json({ message: results });
            // res.json({ data: results });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    deleteProduto: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();
            const { id } = req.body;

            // Cria os objetos necessários
            const objProduto = new Produto({ id: id, idCategoria: null, descricao: null, ativo: 0, estoqueControlado: null });

            // Monta a query com seus respectivos valores, caso existam
            let queries;
            const produtoSqlValues = await objProduto.deleteProduto();

            // Cria um array com as queries e values de cada objeto
            queries = [produtoSqlValues];

            // Chama a função para executar as queries
            const results = await sqlExecute(conn, ...queries);
            // const results = true;
            // console.log(results);

            res.json({ data: results });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    selecionaProduto: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();
            // Monta a query com seus respectivos valores, caso existam
            const pSqlValues = await Produto.selecionaProdutos();

            // Atribui as queries a um Array
            const queries = [pSqlValues];

            //Chama a função para executar a querie
            const results = await sqlExecute(conn, ...queries)
            // console.log(results[0]);

            res.json({ data: results[0] });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    selecionaProdutoComValor: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();
            // Monta a query com seus respectivos valores, caso existam
            const pSqlValues = await Produto.selecionaProdutosComValor();

            // Atribui as queries a um Array
            const queries = [pSqlValues];

            //Chama a função para executar a querie
            const results = await sqlExecute(conn, ...queries)
            // console.log(results[0]);

            res.json({ data: results[0] });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    selecionaProdutoAdmin: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();
            // Monta a query com seus respectivos valores, caso existam
            const pSqlValues = await Produto.selecionaProdutosAdmin();

            // Atribui as queries a um Array
            const queries = [pSqlValues];

            //Chama a função para executar a querie
            const results = await sqlExecute(conn, ...queries)
            // console.log(results[0]);

            res.json({ data: results[0] });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    inserirProdutoValidacao: validation((getSchema) => ({
        body: getSchema(
            yup.object().shape({
                idCategoria: yup.number().integer().required().moreThan(0),
                descricao: yup.string().required().min(4).max(45),
                ativo: yup.number().integer().notRequired().default(1),
                valorCusto: yup.number().required().moreThan(0),
                valorVenda: yup.number().required().moreThan(0),
            })
        ),

    })),
    editarProdutoValidacao: validation((getSchema) => ({
        body: getSchema(
            yup.object().shape({
                id: yup.number().integer().required().moreThan(0),
                idCategoria: yup.number().integer().required().moreThan(0),
                descricao: yup.string().required().min(4).max(45),
                ativo: yup.number().integer().notRequired().default(1),
                idValor: yup.number().integer().notRequired().default(0),
                // id: yup.number().integer().required().moreThan(0),
                valorCusto: yup.number().required().moreThan(0),
                valorVenda: yup.number().required().moreThan(0),
                ativoValor: yup.number().integer().notRequired().default(1),
            })
        ),
    })),
    excluiProdutoValidacao: validation((getSchema) => ({
        body: getSchema(
            yup.object().shape({
                id: yup.number().integer().required().moreThan(0),
            })
        ),
    }))
};
