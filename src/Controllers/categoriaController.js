import { obterConexaoDoPool, sqlExecute } from '../config/db.js';
import Categoria from '../Models/categoriaModel.js';
import * as yup from 'yup';
import { validation } from '../shared/middleware/Validation.js';

export const categoriaController = {

    index: async (req, res) => {
        try {

            res.json({ title: 'Página categoria de produtos' });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    insertCategoria: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();

            const { descricao, ativo } = req.body;
            // Cria os objetos necessários
            const objCategoria = new Categoria({ descricao: descricao })
            // Monta a query com seus respectivos valores, caso existam
            const categoriaSqlValues = await objCategoria.insertCategoria();

            // Cria um array com as queries e values de cada objeto
            const queries = [categoriaSqlValues];

            // Chama a função para executar as queries
            const results = await sqlExecute(conn, ...queries)
            // console.log(results);

            res.json({ data: results, message: 'Registro incluído com sucesso'});
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    updateCategoria: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();
            const { id, descricao, ativo } = req.body;

            // Cria os objetos necessários
            const objCategoria = new Categoria({ id: id, descricao: descricao, ativo: ativo, });

            // console.log("Resultado select :", resultVerificaValor);

            // Monta a query com seus respectivos valores, caso existam
            let queries;

            const categoriaSqlValues = await objCategoria.updateCategoria();

            // console.log(produtoValorSqlValuesUpdate);

            // Cria um array com as queries e values de cada objeto
            queries = [categoriaSqlValues];

            // Chama a função para executar as queries
            const results = await sqlExecute(conn, ...queries);
            // const results = true;
            // console.log(results);

            res.json({ data: results,  message: "Registro atualizado com sucesso" });

        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    deleteCategoria: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();
            const { id } = req.body;

            // Cria os objetos necessários
            const objCategoria = new Categoria({ id: id, descricao: null, ativo: null });

            // console.log("Resultado select :", resultVerificaValor);

            // Monta a query com seus respectivos valores, caso existam
            let queries;

            const categoriaSqlValues = await objCategoria.deleteCategoria();

            // console.log(produtoValorSqlValuesUpdate);

            // Cria um array com as queries e values de cada objeto
            queries = [categoriaSqlValues];

            // Chama a função para executar as queries
            const results = await sqlExecute(conn, ...queries);
            // const results = true;
            // console.log(results);

            res.json({ data: results, message: 'Registro excluído com sucesso' });
        }
        catch (error) {
            console.log(error);
            // let error_message = verificaErro(error);
            // res.render('pages/pag_erro', { message: error_message });
            res.json({ message: error })
        }
    },
    selecionaCategoria: async (req, res) => {
        try {
            const conn = await obterConexaoDoPool();
            // Monta a query com seus respectivos valores, caso existam
            const pSqlValues = await Categoria.selecionaCategorias();

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
    inserirCategoriaValidacao: validation((getSchema) => ({
        body: getSchema(
            yup.object().shape({
                descricao: yup.string().required().min(4).max(45),
                ativo: yup.number().integer().notRequired().default(1),
            })
        ),
    })),
    editarCategoriaValidacao: validation((getSchema) => ({
        body: getSchema(
            yup.object().shape({
                id: yup.number().integer().required().moreThan(0),
                descricao: yup.string().required().min(4).max(45),
                ativo: yup.number().integer().required(),
            })
        ),
    })),
    excluirCategoriaValidacao: validation((getSchema) => ({
        body: getSchema(
            yup.object().shape({
                id: yup.number().integer().required().moreThan(0),
            })
        ),
    }))
};

// Schema de validação usando yup
// export const inserirCategoriaValidacao = validation((getSchema) => ({
//     body: getSchema(
//         yup.object().shape({
//             descricao: yup.string().required().min(4).max(45),
//             ativo: yup.number().integer().notRequired().default(1),
//         })
//     ),
// }));




// export default categoriaController;