

class Endereco {

    constructor(pEnd) {
        this.id = (pEnd.id !== null || pEnd.id > 0) ? this.id = pEnd.id : this.id = null;
        this.idCliente = (pEnd.idCliente !== null || pEnd.idCliente > 0) ? this.idCliente = pEnd.idCliente : this.idCliente = null;
        this.logradouro = pEnd.logradouro;
        this.numero = pEnd.numero;
        this.complemento = pEnd.complemento;
        this.bairro = pEnd.bairro;
        this.cidade = pEnd.cidade;
        this.uf = pEnd.uf;
        this.cep = pEnd.cep;
    }

    // Funcionalidade para cadastrar um endereço vinculado a um cliente
    async insertEndereco() {
        try {

            const pSql = 'INSERT INTO TBL_ENDERECO (id_cliente, logradouro, numero, complemento, bairro, cidade, uf, cep) VALUES (?,?,?,?,?,?,?,?);';
            const pValues = ['insertId', this.logradouro, this.numero, this.complemento, this.bairro, this.cidade, this.uf, this.cep
            ];
            // const result = await sqlExecute(conn, ...[{ sql: pSql, values: null }]);
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };
}

export default Endereco;