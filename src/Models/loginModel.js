

class Login {

    constructor(pLogin) {
        this.id = (pLogin.id !== null || pLogin.id > 0) ? this.id = pLogin.id : this.id = null;
        this.idCiente = (pLogin.idCiente !== null || pLogin.idCiente > 0) ? this.idCiente = pLogin.idCiente : this.idCiente = null;
        this.login = pLogin.login;
        this.senha = pLogin.senha;
        this.perfil = pLogin.perfil;
    }

    // Funcionalidade para cadastrar um login no banco de dados
    async insertLogin() {
        try {

            const pSql = 'INSERT INTO TBL_LOGIN (id_cliente, login, senha, perfil) VALUES (?,?,?,?);';
            const pValues = ['insertId', this.login, this.senha, this.perfil];
            // const result = await sqlExecute(conn, ...[{ sql: pSql, values: null }]);
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };

    // Funcionalidade para cadastrar um login no banco de dados
    static async getByEmail(email) {
        try {

            const pSql = 'SELECT * FROM TBL_LOGIN WHERE LOGIN = ?;';
            const pValues = [email];
            // const result = await sqlExecute(conn, ...[{ sql: pSql, values: null }]);
            return { pSql, pValues };

        } catch (error) {
            throw error;
        };
    };
}

export default Login;