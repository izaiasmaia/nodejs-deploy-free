
class Produto {

    constructor(pProduto) {
        this.id = (pProduto.id !== null || pProduto.id > 0) ? this.id = pProduto.id : this.id = null;
        this.idCategoria = (pProduto.idCategoria !== null || pProduto.idCategoria > 0) ? this.idCategoria = pProduto.idCategoria : this.idCategoria = null;
        this.descricao = pProduto.descricao;
        this.ativo = pProduto.ativo;
        this.estoqueControlado = pProduto.estoqueControlado;
        this.imagem = pProduto.imagem;
    }

    async insertProduto() {
        try {

            const pSql = 'INSERT INTO TBL_PRODUTO (id_categoria, descricao, imagem_path) VALUES ( ?, ?,?);';
            const pValues = [this.idCategoria, this.descricao, this.imagem];
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };
    async updateProduto() {
        try {
            let pSql;
            let pValues;
            if (this.imagem) {
                pSql = 'UPDATE TBL_PRODUTO  SET id_categoria = ?, descricao = ?, ativo = ?, estoque_controlado = ?, imagem_path=? WHERE ID = ?;';
                pValues = [this.idCategoria, this.descricao, this.ativo, this.estoqueControlado, this.imagem, this.id];
            } else {
                pSql = 'UPDATE TBL_PRODUTO  SET id_categoria = ?, descricao = ?, ativo = ?, estoque_controlado = ? WHERE ID = ?;';
                pValues = [this.idCategoria, this.descricao, this.ativo, this.estoqueControlado, this.id];
            }
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };
    // Funcionalidade para marcar o produto como inativo, neste caso não estamos deletando um registro caso ele tenha uma venda vinculada a ele
    async deleteProduto() {
        try {
            const pSql = 'UPDATE TBL_PRODUTO SET ativo = ? WHERE ID = ?;';
            const pValues = [0, this.id];
            return { pSql, pValues };
        } catch (error) {
            throw error;
        };
    };
    // Seleciona nome da imagem antiga para excluir do diretório
    static async imagemProduto(idProd) {
        try {
            const pSql = 'SELECT IMAGEM_PATH FROM TBL_PRODUTO WHERE ID = ?;';
            const pValues = [idProd];
            return { pSql, pValues };
        } catch (error) {
            throw error;
        };
    };
    // Funcionalidade para selecionar todas os produtos cadastrados no banco de dados
    static async selecionaProdutos() {
        try {

            const pSql = 'SELECT * FROM TBL_PRODUTO;';
            const pValues = null;
            return { pSql, pValues };

        } catch (error) {
            throw error;
        }
    };
    static async selecionaProdutosComValor() {

        try {

            const pSql = `
            SELECT PROD.ID, PROD.DESCRICAO, PROD.IMAGEM_PATH, VAL.ID, VAL.VALOR_VENDA 
            FROM TBL_PRODUTO PROD 
            INNER JOIN TBL_PRODUTO_VALOR VAL 
            ON PROD.ID = VAL.ID_PRODUTO 
            WHERE PROD.ATIVO=1 AND VAL.ATIVO = 1;`;
            const pValues = null;
            return { pSql, pValues };

        } catch (error) {
            throw error;
        }
    };
    static async selecionaProdutosAdmin() {

        try {
            const pSql = `
            SELECT PROD.ID, PROD.ID_CATEGORIA, PROD.DESCRICAO, PROD.ATIVO, PROD.ESTOQUE_CONTROLADO, 
            PROD.IMAGEM_PATH, PROD.ALT_HTML, VAL.ID AS ID_VALOR, VAL.VALOR_CUSTO, VAL.VALOR_VENDA, VAL.ATIVO
            FROM TBL_PRODUTO PROD 
            INNER JOIN TBL_PRODUTO_VALOR VAL 
            ON PROD.ID = VAL.ID_PRODUTO 
            WHERE PROD.ATIVO=1 AND VAL.ATIVO = 1;`;
            const pValues = null;
            return { pSql, pValues };

        } catch (error) {
            throw error;
        }
    };
};

export default Produto;