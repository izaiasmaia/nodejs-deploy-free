
class ProdutoValor {

    constructor(pProdutoValor) {
        this.idValor = (pProdutoValor.idValor !== null || pProdutoValor.idValor > 0) ? this.idValor = pProdutoValor.idValor : this.idValor = null;
        this.idProduto = (pProdutoValor.idProduto == null || pProdutoValor.idProduto > 0 || this.idProduto !== undefined) ? this.idProduto = pProdutoValor.idProduto : this.idProduto = null;
        this.valorCusto = pProdutoValor.valorCusto;
        this.valorVenda = pProdutoValor.valorVenda;
        this.ativo = pProdutoValor.ativo;
    }

    async insertProdutoValor() {
        try {
            const pSql = 'INSERT INTO TBL_PRODUTO_VALOR (id_produto, valor_custo, valor_venda, ativo) VALUES (?, ?,? ,?);';
           
            const idProd = this.idProduto === undefined || this.idProduto === null || this.idProduto < 0 ? 'insertId' : this.idProduto;
            console.log('5462: ', idProd);

            const pValues = [idProd, this.valorCusto, this.valorVenda, 1];
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };

    async updateProdutoValor() {
        try {
            const pSql = 'UPDATE TBL_PRODUTO_VALOR set ativo = ? WHERE id = ?;';
            const pValues = [0, this.idValor];
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };

    async verificaValor() {
        try {
            const pSql = 'SELECT COUNT(*) as TOTAL FROM TBL_PRODUTO_VALOR WHERE id_produto = ? AND ATIVO = 1 AND VALOR_CUSTO = ? AND VALOR_VENDA = ?;';
            const pValues = [this.idProduto, this.valorCusto, this.valorVenda];
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    }
    // Funcionalidade para selecionar todas os produtos cadastrados no banco de dados
    // static async selecionaProdutos() {
    //     try {

    //         const pSql = 'SELECT * FROM TBL_PRODUTO;';
    //         const pValues = null;
    //         return { pSql, pValues };

    //     } catch (error) {
    //         throw error;
    //     }
    // };
};

export default ProdutoValor;