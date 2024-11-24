

class Cliente {

    constructor(pCliente) {
        this.id = (pCliente.id !== null || pCliente.id > 0) ? this.id = pCliente.id : this.id = null;
        this.nome = pCliente.nome;
        this.cpf = pCliente.cpf;
        this.email = pCliente.email;
    }

    // Funcionalidade para selecionar todas as categorias cadastradas no banco de dados
    async insertCliente() {
        try {

            const pSql = 'INSERT INTO TBL_CLIENTE (nome, cpf, email) VALUES (?,?,?);';
            const pValues = [this.nome, this.cpf, this.email];
            // const result = await sqlExecute(conn, ...[{ sql: pSql, values: null }]);
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };

   
}

export default Cliente;