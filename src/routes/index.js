import { Router } from 'express';
const router = Router();
import homeController from '../Controllers/homeController.js';
import { categoriaController } from '../Controllers/categoriaController.js';
import { produtoController } from '../Controllers/produtoController.js';
import { clienteController, inserirClienteValidacao } from '../Controllers/clienteController.js';
import { UsuariosController } from '../Controllers/usuarios/index.js';
import { ensureAuthenticated } from './../shared/middleware/EnsureAuthenticated.js';
import { ensureHasRole } from '../shared/middleware/EnsureRole.js';
import multer from 'multer';

// const ctrlUpload = require('../controllers/upload.controller');

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        console.log('multer: ', req.body);
        cb(null, 'src/public/uploads/imagensProdutos');
    },
    filename: (req, file, cb) => {
        console.log('multer: ', req.body);
        cb(null, Date.now() + '-' + req.body.descricao+('.png'));
    }
});

const upload = multer({ storage });


router.get('/', homeController.index)

router.post('/novoCliente', clienteController.insertCliente, inserirClienteValidacao);
router.post('/entrar', UsuariosController.signIn);

// ROTAS DE CATEGORIAS
router.get('/selecionaCategorias', ensureAuthenticated, ensureHasRole(['admin']), categoriaController.selecionaCategoria)
router.post('/novaCategoria', ensureAuthenticated, ensureHasRole(['admin']), categoriaController.inserirCategoriaValidacao, categoriaController.insertCategoria);
router.post('/alteraCategoria', ensureAuthenticated, ensureHasRole(['admin']), categoriaController.editarCategoriaValidacao, categoriaController.updateCategoria);
router.delete('/excluiCategoria', ensureAuthenticated, ensureHasRole(['admin']), categoriaController.excluirCategoriaValidacao, categoriaController.deleteCategoria);

// ROTAS DE PRODUTOS
router.get('/selecionaProdutos', ensureAuthenticated, ensureHasRole(['admin']), produtoController.selecionaProduto)
router.get('/novoProduto', ensureAuthenticated, ensureHasRole(['admin']), ensureHasRole(['admin']), produtoController.index)
router.post('/novoProduto', ensureAuthenticated, ensureHasRole(['admin']), upload.single('image'),produtoController.inserirProdutoValidacao, produtoController.insertProduto);
router.post('/alteraProduto', ensureAuthenticated, ensureHasRole(['admin']), upload.single('image'),produtoController.editarProdutoValidacao, produtoController.updateProduto);
router.delete('/excluiProduto', ensureAuthenticated, ensureHasRole(['admin']), produtoController.excluiProdutoValidacao, produtoController.deleteProduto);
router.get('/selecionaProdutosAdmin', ensureAuthenticated, ensureHasRole(['admin']), produtoController.selecionaProdutoAdmin)
router.get('/selecionaProdutosComValor', produtoController.selecionaProdutoComValor)




router.use(function (req, res) {
    res.json({ message: '404 - Página não encontrada' })
})

export default router;