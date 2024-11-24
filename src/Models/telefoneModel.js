

class Telefone {

    constructor(pTel) {
        this.id = (pTel.id !== null || pTel.id > 0) ? this.id = pTel.id : this.id = null;
        this.idCliente = (pTel.idCliente !== null || pTel.idCliente > 0) ? this.idCliente = pTel.idCliente : this.idCliente = null;
        this.numero = pTel.numero;
    }

    // Funcionalidade para selecionar todas as categorias cadastradas no banco de dados
    async insertTelefone() {
        try {

            const pSql = 'INSERT INTO TBL_TELEFONE (id_cliente, numero) VALUES (?,?);';
            const pValues = ['insertId', this.numero];
            // const result = await sqlExecute(conn, ...[{ sql: pSql, values: null }]);
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };
}

export default Telefone;