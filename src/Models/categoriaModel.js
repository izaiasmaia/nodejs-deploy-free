
class Categoria{

    constructor(pCategoria) {
        this.id = (pCategoria.id !== null || pCategoria.id > 0) ? this.id = pCategoria.id : this.id = null;
        this.descricao = pCategoria.descricao;
        this.ativo = pCategoria.ativo;
    }

    async insertCategoria() {
        try {

            const pSql = 'INSERT INTO TBL_CATEGORIA (descricao, ativo) VALUES (?,?);';
            const pValues = [this.descricao, 1];
            // const result = await sqlExecute(conn, ...[{ sql: pSql, values: null }]);
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };
    async updateCategoria() {
        try {

            const pSql = 'UPDATE TBL_CATEGORIA SET descricao = ?, ativo = ? WHERE ID = ?;';
            const pValues = [this.descricao, this.ativo, this.id];
            // const result = await sqlExecute(conn, ...[{ sql: pSql, values: null }]);
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };
    async deleteCategoria() {
        try {

            const pSql = 'DELETE FROM TBL_CATEGORIA WHERE ID = ?;';
            const pValues = [this.id];
            return { pSql, pValues };
        } catch (error) {
            throw error;
        };
    };
    // Funcionalidade para selecionar todas as categorias cadastradas no banco de dados
    static async selecionaCategorias() {
        try {

            const pSql = 'SELECT * FROM TBL_CATEGORIA;';
            const pValues = null;
            // const result = await sqlExecute(conn, ...[{ sql: pSql, values: null }]);
            return { pSql, pValues };

        } catch (error) {
            throw error;
        }
    };
};

export default Categoria;